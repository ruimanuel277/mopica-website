"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminGuard from "./AdminGuard";
import AdminNav from "./AdminNav";

type Atividade = {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  local: string;
  data: string;
  imagem_url: string;
};

type AtividadeRow = Omit<Atividade, "descricao"> & { "descriçao": string };

export default function AdminPanel() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [form, setForm] = useState({
    titulo: "", descricao: "", categoria: "", local: "", data: "", imagem_url: "",
  });

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
      imagem_url: form.imagem_url,
    };
    const { error } = await supabase.from("atividades").insert([dadosParaEnviar]);
    if (error) {
      alert("Erro: " + error.message);
      console.log(error);
      return;
    }
    setForm({ titulo: "", descricao: "", categoria: "", local: "", data: "", imagem_url: "" });
    carregarAtividades();
  };

  const handleDelete = async (id: number) => {
    await supabase.from("atividades").delete().eq("id", id);
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
          <h3 style={{ marginBottom: "16px" }}>Adicionar nova atividade</h3>
          <form onSubmit={handleSubmit} className="form-stack">
            <input className="form-field" placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
            <textarea className="form-field" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
            <input className="form-field" placeholder="Categoria (ex: Educação, Saúde)" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
            <input className="form-field" placeholder="Local (ex: Huambo)" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} />
            <input className="form-field" type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            <input className="form-field" placeholder="URL da imagem (opcional)" value={form.imagem_url} onChange={(e) => setForm({ ...form, imagem_url: e.target.value })} />
            <button type="submit" className="btn-donate-full">Adicionar atividade</button>
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
                <button onClick={() => handleDelete(a.id)} className="btn-small btn-delete">Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminGuard>
  );
}
