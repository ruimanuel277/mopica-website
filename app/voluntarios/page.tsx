"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Voluntarios() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    area_interesse: "",
    disponibilidade: "",
    mensagem: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    if (form.nome.trim() === "" || form.email.trim() === "") {
      setMensagem({ tipo: "erro", texto: "Preencha pelo menos o nome e o email." });
      return;
    }
    if (!EMAIL_RE.test(form.email)) {
      setMensagem({ tipo: "erro", texto: "Introduza um email válido." });
      return;
    }

    setEnviando(true);
    const { error } = await supabase.from("voluntarios").insert([
      {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone || null,
        area_interesse: form.area_interesse || null,
        disponibilidade: form.disponibilidade || null,
        mensagem: form.mensagem || null,
      },
    ]);
    setEnviando(false);

    if (error) {
      setMensagem({ tipo: "erro", texto: "Não foi possível enviar. Tente novamente: " + error.message });
      return;
    }

    setMensagem({ tipo: "ok", texto: "Obrigado pela sua inscrição! Vamos entrar em contacto em breve." });
    setForm({ nome: "", email: "", telefone: "", area_interesse: "", disponibilidade: "", mensagem: "" });
  };

  return (
    <section className="pad wrap" style={{ maxWidth: "620px", margin: "0 auto" }}>
      <div className="section-head">
        <div>
          <div className="eyebrow">Envolva-se</div>
          <h2>Seja voluntário</h2>
        </div>
        <p>Junte-se a nós e ajude a mudar vidas em Angola.</p>
      </div>

      <div className="donate-panel" style={{ padding: "30px" }}>
        <form onSubmit={handleSubmit} className="form-stack">
          <input
            className="form-field"
            placeholder="O seu nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <input
            className="form-field"
            type="email"
            placeholder="O seu email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="form-field"
            type="tel"
            placeholder="Telefone (opcional)"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />
          <input
            className="form-field"
            placeholder="Área de interesse (ex: Educação, Saúde)"
            value={form.area_interesse}
            onChange={(e) => setForm({ ...form, area_interesse: e.target.value })}
          />
          <input
            className="form-field"
            placeholder="Disponibilidade (ex: Fins de semana)"
            value={form.disponibilidade}
            onChange={(e) => setForm({ ...form, disponibilidade: e.target.value })}
          />
          <textarea
            className="form-field"
            placeholder="Mensagem (opcional)"
            rows={4}
            value={form.mensagem}
            onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
          />
          {mensagem && (
            <p className={mensagem.tipo === "ok" ? "form-success" : "form-error"}>{mensagem.texto}</p>
          )}
          <button type="submit" className="btn-donate-full" disabled={enviando}>
            {enviando ? "A enviar..." : "Quero ser voluntário"}
          </button>
        </form>
      </div>
    </section>
  );
}
