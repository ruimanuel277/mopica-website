"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contacto() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    if (form.nome.trim() === "" || form.email.trim() === "" || form.mensagem.trim() === "") {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos." });
      return;
    }
    if (!EMAIL_RE.test(form.email)) {
      setMensagem({ tipo: "erro", texto: "Introduza um email válido." });
      return;
    }

    setEnviando(true);
    const { error } = await supabase.from("contactos").insert([
      { nome: form.nome, email: form.email, mensagem: form.mensagem },
    ]);
    setEnviando(false);

    if (error) {
      setMensagem({ tipo: "erro", texto: "Não foi possível enviar. Tente novamente: " + error.message });
      return;
    }

    setMensagem({ tipo: "ok", texto: "Mensagem enviada! Entraremos em contacto brevemente." });
    setForm({ nome: "", email: "", mensagem: "" });
  };

  return (
    <section className="pad wrap">
      <div className="section-head">
        <div>
          <div className="eyebrow">Fale connosco</div>
          <h2>Contacto</h2>
        </div>
        <p>Estamos disponíveis para responder a qualquer questão sobre a nossa missão.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <div>
          <h3 style={{ marginBottom: "16px", fontSize: "1.1rem" }}>Informações de contacto</h3>
          <div style={{ marginBottom: "14px" }}>
            <strong>Email:</strong><br />
            <a href="mailto:ong@mopica.org">ong@mopica.org</a>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <strong>Telefone:</strong><br />
            +244 935 518 305 · +244 924 250 525
          </div>
          <div style={{ marginBottom: "14px" }}>
            <strong>Morada:</strong><br />
            Bairro Baixa de Cassange, Vila Nova da Boa-fé, Casa Nº 86, Q.1, Zona 5,
            por detrás da Escola Nº 5093, Ex-9093 — Luanda/Angola
          </div>
        </div>

        <div className="donate-panel" style={{ padding: "30px" }}>
          <h3 style={{ marginBottom: "16px", fontSize: "1.1rem" }}>Envie-nos uma mensagem</h3>
          <form onSubmit={handleSubmit} className="form-stack">
            <input
              type="text"
              placeholder="O seu nome"
              className="form-field"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="O seu email"
              className="form-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <textarea
              placeholder="A sua mensagem"
              rows={5}
              className="form-field"
              style={{ resize: "vertical" }}
              value={form.mensagem}
              onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
              required
            />
            {mensagem && (
              <p className={mensagem.tipo === "ok" ? "form-success" : "form-error"}>{mensagem.texto}</p>
            )}
            <button type="submit" className="btn-donate-full" disabled={enviando}>
              {enviando ? "A enviar..." : "Enviar mensagem"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 