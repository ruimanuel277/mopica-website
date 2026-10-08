"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminGuard from "./AdminGuard";
import AdminNav from "./AdminNav";
import ImagensUpload from "./ImagensUpload";
import { apagarImagens } from "../lib/uploadImagem";

// Limpeza do bucket: se falhar, a atividade já está gravada, por isso só regista o erro
async function apagarSemErro(urls: string[]) {
  try {
    await apagarImagens(urls);
  } catch (err) {
    console.error("Erro ao apagar fotos do bucket:", err);
  }
}

type Atividade = {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  local: string;
  data: string;
  imagem_url: string;
  imagens: string[] | null;
};

type AtividadeRow = Omit<Atividade, "descricao"> & { "descriçao": string };

const FORM_VAZIO = { titulo: "", descricao: "", categoria: "", local: "", data: "", imagens: [] as string[] };

export default function AdminPanel() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  // Fotos já gravadas na atividade em edição, e todas as que passaram pelo formulário
  // (gravadas + enviadas agora): serve para apagar do bucket as que forem removidas.
  const [originais, setOriginais] = useState<string[]>([]);
  const [conhecidas, setConhecidas] = useState<string[]>([]);
  const [enviandoFotos, setEnviandoFotos] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const carregarAtividades = async () => {
    const { data } = await supabase.from("atividades").select("*").order("id", { ascending: false });
    if (data) {
      setAtividades(
        (data as AtividadeRow[]).map((r) => ({ ...r, descricao: r["descriçao"] }))
      );
    }
  };

  useEffect(() => {
    carregarAtividades();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dadosParaEnviar = {
      titulo: form.titulo,
      "descriçao": form.descricao,
      categoria: form.categoria,
      local: form.local,
      data: form.data === "" ? null : form.data,
      imagens: form.imagens,
      // ao editar, a coluna antiga imagem_url fica vazia: as fotos vivem todas em `imagens`
      // (texto vazio e não null, para não depender de a coluna aceitar null)
      ...(editandoId ? { imagem_url: "" } : {}),
    };
    setSalvando(true);
    const { error } = editandoId
      ? await supabase.from("atividades").update(dadosParaEnviar).eq("id", editandoId)
      : await supabase.from("atividades").insert([dadosParaEnviar]);
    if (error) {
      setSalvando(false);
      alert("Erro: " + error.message);
      console.log(error);
      return;
    }
    await apagarSemErro(conhecidas.filter((u) => !form.imagens.includes(u)));
    setSalvando(false);
    limparFormulario();
    carregarAtividades();
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setOriginais([]);
    setConhecidas([]);
  };

  const handleEditar = async (a: Atividade) => {
    // fotos enviadas mas não gravadas na edição anterior deixam de ser precisas
    await apagarSemErro(conhecidas.filter((u) => !originais.includes(u)));
    const imagens = a.imagens && a.imagens.length > 0 ? a.imagens : a.imagem_url ? [a.imagem_url] : [];
    setEditandoId(a.id);
    setOriginais(imagens);
    setConhecidas(imagens);
    setForm({
      titulo: a.titulo ?? "",
      descricao: a.descricao ?? "",
      categoria: a.categoria ?? "",
      local: a.local ?? "",
      data: a.data ?? "",
      imagens,
    });
  };

  const cancelarEdicao = async () => {
    await apagarSemErro(conhecidas.filter((u) => !originais.includes(u)));
    limparFormulario();
  };

  const handleDelete = async (a: Atividade) => {
    if (!confirm(`Apagar a atividade "${a.titulo}" e as suas fotos?`)) return;
    const { error } = await supabase.from("atividades").delete().eq("id", a.id);
    if (error) {
      alert("Erro: " + error.message);
      return;
    }
    await apagarSemErro([...(a.imagens ?? []), ...(a.imagem_url ? [a.imagem_url] : [])]);
    if (editandoId === a.id) limparFormulario();
    carregarAtividades();
  };

  return (
    <AdminGuard>
      <section className="pad wrap">
        <AdminNav />
        <div className="section-head">
          <div>
            <div className="eyebrow">Painel de administração</div>
            <h2>Gerir atividades</h2>
          </div>
        </div>

        <div className="donate-panel" style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "16px" }}>{editandoId ? "Editar atividade" : "Adicionar nova atividade"}</h3>
          <form onSubmit={handleSubmit} className="form-stack">
            <input className="form-field" placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
            <textarea className="form-field" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
            <input className="form-field" placeholder="Categoria (ex: Educação, Saúde)" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
            <input className="form-field" placeholder="Local (ex: Huambo)" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} />
            <input className="form-field" type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            <ImagensUpload
              pasta="atividades"
              valores={form.imagens}
              onChange={(urls) => {
                // forma funcional: o envio demora e o resto do formulário pode ter mudado entretanto
                setForm((atual) => ({ ...atual, imagens: urls }));
                setConhecidas((atual) => Array.from(new Set([...atual, ...urls])));
              }}
              onEnviando={setEnviandoFotos}
              label="Fotos (opcional)"
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-donate-full" disabled={enviandoFotos || salvando}>
                {enviandoFotos
                  ? "Aguarde o envio das fotos..."
                  : salvando
                    ? "A guardar..."
                    : editandoId
                      ? "Guardar alterações"
                      : "Adicionar atividade"}
              </button>
              {editandoId && (
                <button type="button" onClick={cancelarEdicao} className="btn-ghost">Cancelar</button>
              )}
            </div>
          </form>
        </div>

        <h3 style={{ marginBottom: "16px" }}>Atividades existentes ({atividades.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {atividades.map((a) => (
            <div key={a.id} className="method admin-row">
              <div>
                <strong>{a.titulo}</strong> — {a.categoria} · {a.local}
              </div>
              <div className="admin-row-actions">
                <button onClick={() => handleEditar(a)} className="btn-small btn-edit">Editar</button>
                <button onClick={() => handleDelete(a)} className="btn-small btn-delete">Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminGuard>
  );
}
