"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminGuard from "../AdminGuard";
import AdminNav from "../AdminNav";

type Testemunho = {
  id: number;
  autor: string;
  cargo: string;
  mensagem: string;
};

const FORM_VAZIO = { autor: "", cargo: "", mensagem: "" };

export default function AdminTestemunhos() {
  const [lista, setLista] = useState<Testemunho[]>([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const carregar = async () => {
    const { data } = await supabase
      .from("Testemunhas")
      .select("id, autor:Autor, cargo:Cargo, mensagem:Mensagem")
      .order("id", { ascending: false });
    if (data) setLista(data as Testemunho[]);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dados = { Autor: form.autor, Cargo: form.cargo, Mensagem: form.mensagem };

    const { error } = editandoId
      ? await supabase.from("Testemunhas").update(dados).eq("id", editandoId)
      : await supabase.from("Testemunhas").insert([dados]);

    if (error) {
      alert("Erro: " + error.message);
      return;
    }
    setForm(FORM_VAZIO);
    setEditandoId(null);
    carregar();
  };

  const handleEditar = (t: Testemunho) => {
    setEditandoId(t.id);
    setForm({ autor: t.autor ?? "", cargo: t.cargo ?? "", mensagem: t.mensagem ?? "" });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("Testemunhas").delete().eq("id", id);
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
            <h2>Gerir testemunhos</h2>
          </div>
        </div>

        <div className="donate-panel" style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "16px" }}>{editandoId ? "Editar testemunho" : "Adicionar novo testemunho"}</h3>
          <form onSubmit={handleSubmit} className="form-stack">
            <input className="form-field" placeholder="Nome da pessoa" value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} required />
            <input className="form-field" placeholder="Cargo / local (opcional)" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
            <textarea className="form-field" placeholder="Texto do testemunho" value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} required />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-donate-full">
                {editandoId ? "Guardar alterações" : "Adicionar testemunho"}
              </button>
              {editandoId && (
                <button type="button" onClick={cancelarEdicao} className="btn-ghost">Cancelar</button>
              )}
            </div>
          </form>
        </div>

        <h3 style={{ marginBottom: "16px" }}>Testemunhos existentes ({lista.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {lista.map((t) => (
            <div key={t.id} className="method admin-row" style={{ alignItems: "flex-start" }}>
              <div>
                <strong>{t.autor}</strong> {t.cargo ? `— ${t.cargo}` : ""}
                <p style={{ fontSize: "0.85rem", marginTop: "6px", opacity: 0.75 }}>{t.mensagem}</p>
              </div>
              <div className="admin-row-actions">
                <button onClick={() => handleEditar(t)} className="btn-small btn-edit">Editar</button>
                <button onClick={() => handleDelete(t.id)} className="btn-small btn-delete">Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminGuard>
  );
}
