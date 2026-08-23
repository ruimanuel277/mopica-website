"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminGuard from "../AdminGuard";
import AdminNav from "../AdminNav";

type Video = {
  id: number;
  titulo: string;
  video_url: string;
};

type LinhaVideo = { titulo: string; video_url: string };

const LINHA_VAZIA: LinhaVideo = { titulo: "", video_url: "" };

export default function AdminVideos() {
  const [lista, setLista] = useState<Video[]>([]);
  const [linhas, setLinhas] = useState<LinhaVideo[]>([LINHA_VAZIA]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = editandoId
      ? await supabase
          .from("Videos")
          .update({ Titulo: linhas[0].titulo, Video_url: linhas[0].video_url })
          .eq("id", editandoId)
      : await supabase
          .from("Videos")
          .insert(linhas.map((l) => ({ Titulo: l.titulo, Video_url: l.video_url })));

    if (error) {
      alert("Erro: " + error.message);
      return;
    }
    setLinhas([LINHA_VAZIA]);
    setEditandoId(null);
    carregar();
  };

  const handleEditar = (v: Video) => {
    setEditandoId(v.id);
    setLinhas([{ titulo: v.titulo ?? "", video_url: v.video_url ?? "" }]);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setLinhas([LINHA_VAZIA]);
  };

  const atualizarLinha = (indice: number, campo: keyof LinhaVideo, valor: string) => {
    setLinhas((atual) => atual.map((l, i) => (i === indice ? { ...l, [campo]: valor } : l)));
  };

  const adicionarLinha = () => setLinhas((atual) => [...atual, { ...LINHA_VAZIA }]);

  const removerLinha = (indice: number) => setLinhas((atual) => atual.filter((_, i) => i !== indice));

  const handleDelete = async (id: number) => {
    await supabase.from("Videos").delete().eq("id", id);
    if (editandoId === id) cancelarEdicao();
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
          <h3 style={{ marginBottom: "16px" }}>{editandoId ? "Editar vídeo" : "Adicionar novo(s) vídeo(s)"}</h3>
          <form onSubmit={handleSubmit} className="form-stack">
            {linhas.map((linha, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  <input
                    className="form-field"
                    placeholder="Título"
                    value={linha.titulo}
                    onChange={(e) => atualizarLinha(i, "titulo", e.target.value)}
                    required
                  />
                  <input
                    className="form-field"
                    placeholder="URL do vídeo (YouTube ou Vimeo)"
                    value={linha.video_url}
                    onChange={(e) => atualizarLinha(i, "video_url", e.target.value)}
                    required
                  />
                </div>
                {!editandoId && linhas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerLinha(i)}
                    className="btn-small btn-delete"
                    style={{ marginTop: "2px" }}
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
            {!editandoId && (
              <button type="button" onClick={adicionarLinha} className="btn-ghost">+ Adicionar outro vídeo</button>
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-donate-full">
                {editandoId
                  ? "Guardar alterações"
                  : linhas.length > 1
                    ? `Adicionar ${linhas.length} vídeos`
                    : "Adicionar vídeo"}
              </button>
              {editandoId && (
                <button type="button" onClick={cancelarEdicao} className="btn-ghost">Cancelar</button>
              )}
            </div>
          </form>
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
                <button onClick={() => handleEditar(v)} className="btn-small btn-edit">Editar</button>
                <button onClick={() => handleDelete(v.id)} className="btn-small btn-delete">Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminGuard>
  );
}
