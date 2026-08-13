"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminGuard from "../AdminGuard";
import AdminNav from "../AdminNav";

type Parceiro = {
  id: number;
  nome: string;
  nivel: string;
  logo_url: string;
  site_url: string;
};

const FORM_VAZIO = { nome: "", nivel: "", logo_url: "", site_url: "" };

export default function AdminParceiros() {
  const [lista, setLista] = useState<Parceiro[]>([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const carregar = async () => {
    const { data } = await supabase
      .from("Parceiros")
      .select("id, nome:Nome, nivel:Nivel, logo_url:Logo_url, site_url:Site_url")
      .order("id", { ascending: false });
    if (data) setLista(data as Parceiro[]);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dados = {
      Nome: form.nome,
      Nivel: form.nivel,
      Logo_url: form.logo_url,
      Site_url: form.site_url,
    };

    const { error } = editandoId
      ? await supabase.from("Parceiros").update(dados).eq("id", editandoId)
      : await supabase.from("Parceiros").insert([dados]);

    if (error) {
      alert("Erro: " + error.message);
      return;
    }
    setForm(FORM_VAZIO);
    setEditandoId(null);
    carregar();
  };

  const handleEditar = (p: Parceiro) => {
    setEditandoId(p.id);
    setForm({ nome: p.nome ?? "", nivel: p.nivel ?? "", logo_url: p.logo_url ?? "", site_url: p.site_url ?? "" });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("Parceiros").delete().eq("id", id);
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
            <h2>Gerir parceiros</h2>
          </div>
        </div>

        <div className="donate-panel" style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "16px" }}>{editandoId ? "Editar parceiro" : "Adicionar novo parceiro"}</h3>
          <form onSubmit={handleSubmit} className="form-stack">
            <input className="form-field" placeholder="Nome do parceiro" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            <input className="form-field" placeholder="Nível (ex: Institucional, Ouro, Prata)" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} />
            <input className="form-field" placeholder="URL do logo" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
            <input className="form-field" placeholder="URL do site do parceiro" value={form.site_url} onChange={(e) => setForm({ ...form, site_url: e.target.value })} />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-donate-full">
                {editandoId ? "Guardar alterações" : "Adicionar parceiro"}
              </button>
              {editandoId && (
                <button type="button" onClick={cancelarEdicao} className="btn-ghost">Cancelar</button>
              )}
            </div>
          </form>
        </div>

        <h3 style={{ marginBottom: "16px" }}>Parceiros existentes ({lista.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {lista.map((p) => (
            <div key={p.id} className="method admin-row">
              <div>
                <strong>{p.nome}</strong> {p.nivel ? `— ${p.nivel}` : ""}
              </div>
              <div className="admin-row-actions">
                <button onClick={() => handleEditar(p)} className="btn-small btn-edit">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="btn-small btn-delete">Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminGuard>
  );
}
