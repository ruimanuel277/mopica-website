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

const FORM_VAZIO = { titulo: "", video_url: "" };

export default function AdminVideos() {
  const [lista, setLista] = useState<Video[]>([]);
  const [form, setForm] = useState(FORM_VAZIO);
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
    const dados = { Titulo: form.titulo, Video_url: form.video_url };

    const { error } = editandoId
      ? await supabase.from("Videos").update(dados).eq("id", editandoId)
      : await supabase.from("Videos").insert([dados]);

    if (error) {
      alert("Erro: " + error.message);
      return;
    }
    setForm(FORM_VAZIO);
    setEditandoId(null);
    carregar();
  };

  const handleEditar = (v: Video) => {
    setEditandoId(v.id);
    setForm({ titulo: v.titulo ?? "", video_url: v.video_url ?? "" });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
  };

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
          <h3 style={{ marginBottom: "16px" }}>{editandoId ? "Editar vídeo" : "Adicionar novo vídeo"}</h3>
          <form onSubmit={handleSubmit} className="form-stack">
            <input className="form-field" placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
            <input className="form-field" placeholder="URL do vídeo (YouTube ou Vimeo)" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} required />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-donate-full">
                {editandoId ? "Guardar alterações" : "Adicionar vídeo"}
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
