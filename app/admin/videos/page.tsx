"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { youtubeId, youtubeTitulo } from "../../lib/youtube";
import AdminGuard from "../AdminGuard";
import AdminNav from "../AdminNav";

type Video = {
  id: number;
  titulo: string;
  video_url: string;
};

type Mensagem = { tipo: "ok" | "erro"; texto: string };

export default function AdminVideos() {
  const [lista, setLista] = useState<Video[]>([]);
  const [links, setLinks] = useState("");
  const [edicao, setEdicao] = useState<Video | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);

  const carregar = async () => {
    const { data } = await supabase
      .from("Videos")
      .select("id, titulo:Titulo, video_url:Video_url")
      .order("id", { ascending: false });
    if (data) setLista(data as Video[]);
  };

  useEffect(() => {
    carregar();
  }, []);

  const linhasPreenchidas = links.split("\n").map((l) => l.trim()).filter(Boolean);

  const adicionarVarios = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagens([]);

    const invalidas: string[] = [];
    const repetidas: string[] = [];
    const novos: { linha: string; id: string }[] = [];
    const idsExistentes = new Set(lista.map((v) => youtubeId(v.video_url)).filter(Boolean));

    for (const linha of linhasPreenchidas) {
      const id = youtubeId(linha);
      if (!id) invalidas.push(linha);
      else if (idsExistentes.has(id)) repetidas.push(linha);
      else {
        idsExistentes.add(id);
        novos.push({ linha, id });
      }
    }

    const avisos: Mensagem[] = [];
    if (invalidas.length > 0) {
      avisos.push({
        tipo: "erro",
        texto: `${invalidas.length} link(s) não são do YouTube e não foram adicionados (ficaram na caixa para corrigir): ${invalidas.join(", ")}`,
      });
    }
    if (repetidas.length > 0) {
      avisos.push({ tipo: "erro", texto: `${repetidas.length} vídeo(s) já existiam e foram ignorados.` });
    }

    if (novos.length === 0) {
      setMensagens(avisos.length > 0 ? avisos : [{ tipo: "erro", texto: "Cole pelo menos um link do YouTube." }]);
      setLinks(invalidas.join("\n"));
      return;
    }

    setSalvando(true);
    const titulos = await Promise.all(novos.map((n) => youtubeTitulo(n.id)));
    const { error } = await supabase.from("Videos").insert(
      novos.map((n, i) => ({
        Titulo: titulos[i] ?? "Vídeo da MOPICA",
        Video_url: `https://www.youtube.com/watch?v=${n.id}`,
      }))
    );
    setSalvando(false);

    if (error) {
      setMensagens([{ tipo: "erro", texto: "Erro: " + error.message }, ...avisos]);
      return;
    }
    setMensagens([
      { tipo: "ok", texto: `${novos.length} vídeo(s) adicionado(s). Pode mudar os títulos em "Editar".` },
      ...avisos,
    ]);
    setLinks(invalidas.join("\n"));
    carregar();
  };

  const guardarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edicao) return;
    if (!youtubeId(edicao.video_url) && !edicao.video_url.includes("vimeo.com")) {
      setMensagens([{ tipo: "erro", texto: "O link tem de ser do YouTube (ou Vimeo)." }]);
      return;
    }
    setSalvando(true);
    const { error } = await supabase
      .from("Videos")
      .update({ Titulo: edicao.titulo, Video_url: edicao.video_url.trim() })
      .eq("id", edicao.id);
    setSalvando(false);
    if (error) {
      setMensagens([{ tipo: "erro", texto: "Erro: " + error.message }]);
      return;
    }
    setEdicao(null);
    setMensagens([{ tipo: "ok", texto: "Vídeo atualizado." }]);
    carregar();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apagar este vídeo? Esta ação não pode ser desfeita.")) return;
    await supabase.from("Videos").delete().eq("id", id);
    if (edicao?.id === id) setEdicao(null);
    carregar();
  };

  return (
    <AdminGuard>
      <section className="pad wrap">
        <AdminNav />
        <div className="section-head">
          <div>
            <div className="eyebrow">Painel de administração</div>
            <h2>Gerir vídeos</h2>
          </div>
        </div>

        <div className="donate-panel" style={{ marginBottom: "40px" }}>
          {edicao ? (
            <>
              <h3 style={{ marginBottom: "16px" }}>Editar vídeo</h3>
              <form onSubmit={guardarEdicao} className="form-stack">
                <input
                  className="form-field"
                  placeholder="Título"
                  value={edicao.titulo}
                  onChange={(e) => setEdicao({ ...edicao, titulo: e.target.value })}
                  required
                />
                <input
                  className="form-field"
                  placeholder="Link do vídeo"
                  value={edicao.video_url}
                  onChange={(e) => setEdicao({ ...edicao, video_url: e.target.value })}
                  required
                />
                {mensagens.map((m, i) => (
                  <p key={i} className={m.tipo === "ok" ? "form-success" : "form-error"}>{m.texto}</p>
                ))}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" className="btn-donate-full" disabled={salvando}>
                    {salvando ? "A guardar..." : "Guardar alterações"}
                  </button>
                  <button type="button" onClick={() => setEdicao(null)} className="btn-ghost">Cancelar</button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: "16px" }}>Adicionar vídeos do YouTube</h3>
              <form onSubmit={adicionarVarios} className="form-stack">
                <textarea
                  className="form-field"
                  placeholder={"Cole aqui os links do YouTube, um por linha. Exemplo:\nhttps://www.youtube.com/watch?v=...\nhttps://youtu.be/..."}
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  rows={8}
                />
                <span style={{ fontSize: "0.78rem", opacity: 0.6 }}>
                  Cada link cria um vídeo. As linhas vazias são ignoradas e o título é obtido automaticamente
                  do YouTube.
                </span>
                {mensagens.map((m, i) => (
                  <p key={i} className={m.tipo === "ok" ? "form-success" : "form-error"}>{m.texto}</p>
                ))}
                <button type="submit" className="btn-donate-full" disabled={salvando || linhasPreenchidas.length === 0}>
                  {salvando
                    ? "A adicionar..."
                    : linhasPreenchidas.length > 1
                      ? `Adicionar ${linhasPreenchidas.length} vídeos`
                      : "Adicionar vídeo"}
                </button>
              </form>
            </>
          )}
        </div>

        <h3 style={{ marginBottom: "16px" }}>Vídeos existentes ({lista.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {lista.map((v) => (
            <div key={v.id} className="method admin-row">
              <div>
                <strong>{v.titulo}</strong>
                <div style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "4px" }}>{v.video_url}</div>
              </div>
              <div className="admin-row-actions">
                <button
                  onClick={() => {
                    setMensagens([]);
                    setEdicao({ ...v });
                  }}
                  className="btn-small btn-edit"
                >
                  Editar
                </button>
                <button onClick={() => handleDelete(v.id)} className="btn-small btn-delete">Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminGuard>
  );
}
