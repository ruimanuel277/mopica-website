"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminGuard from "../AdminGuard";
import AdminNav from "../AdminNav";

export default function AdminSobre() {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const carregar = async () => {
    const { data } = await supabase.from("sobre").select("texto").eq("id", 1).single();
    if (data) setTexto(data.texto ?? "");
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (texto.trim() === "") {
      setMensagem({ tipo: "erro", texto: "O texto não pode estar vazio." });
      return;
    }
    setSalvando(true);
    setMensagem(null);
    const { error } = await supabase.from("sobre").update({ texto }).eq("id", 1);
    setSalvando(false);
    if (error) {
      setMensagem({ tipo: "erro", texto: "Erro: " + error.message });
      return;
    }
    setMensagem({ tipo: "ok", texto: "Texto guardado com sucesso." });
  };

  return (
    <AdminGuard>
      <section className="pad wrap">
        <AdminNav />
        <div className="section-head">
          <div>
            <div className="eyebrow">Painel de administração</div>
            <h2>Editar página Sobre</h2>
          </div>
        </div>

        {loading ? (
          <p>A carregar...</p>
        ) : (
          <div className="donate-panel" style={{ maxWidth: "70ch" }}>
            <form onSubmit={handleSubmit} className="form-stack">
              <textarea
                className="form-field"
                placeholder="Texto da missão/história da MOPICA"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={12}
                required
              />
              {mensagem && (
                <p className={mensagem.tipo === "ok" ? "form-success" : "form-error"}>{mensagem.texto}</p>
              )}
              <button type="submit" className="btn-donate-full" disabled={salvando}>
                {salvando ? "A guardar..." : "Guardar alterações"}
              </button>
            </form>
          </div>
        )}
      </section>
    </AdminGuard>
  );
}
