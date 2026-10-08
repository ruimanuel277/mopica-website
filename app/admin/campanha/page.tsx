"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminGuard from "../AdminGuard";
import AdminNav from "../AdminNav";

export default function AdminCampanha() {
  const [form, setForm] = useState({ nome: "", arrecadado: "", meta: "" });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    const carregar = async () => {
      const { data, error } = await supabase
        .from("campanha")
        .select("nome, arrecadado, meta")
        .eq("id", 1)
        .maybeSingle();
      if (error) {
        setMensagem({ tipo: "erro", texto: "Erro ao carregar: " + error.message });
      } else if (data) {
        setForm({
          nome: data.nome ?? "",
          arrecadado: data.arrecadado != null ? String(data.arrecadado) : "",
          meta: data.meta != null ? String(data.meta) : "",
        });
      }
      setLoading(false);
    };
    carregar();
  }, []);

  const guardar = async (valores: { nome: string | null; arrecadado: number | null; meta: number | null }) => {
    setSalvando(true);
    setMensagem(null);
    const { error } = await supabase
      .from("campanha")
      .upsert({ id: 1, ...valores, updated_at: new Date().toISOString() });
    setSalvando(false);
    if (error) {
      setMensagem({ tipo: "erro", texto: "Erro: " + error.message });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const arrecadado = Number(form.arrecadado);
    const meta = Number(form.meta);
    if (!form.nome.trim()) {
      setMensagem({ tipo: "erro", texto: "Indique o nome da campanha." });
      return;
    }
    if (form.arrecadado === "" || isNaN(arrecadado) || arrecadado < 0) {
      setMensagem({ tipo: "erro", texto: "Indique um valor arrecadado válido (0 ou mais)." });
      return;
    }
    if (form.meta === "" || isNaN(meta) || meta <= 0) {
      setMensagem({ tipo: "erro", texto: "Indique uma meta válida, maior que zero." });
      return;
    }
    if (await guardar({ nome: form.nome.trim(), arrecadado, meta })) {
      setMensagem({ tipo: "ok", texto: "Campanha guardada. A barra já aparece no site." });
    }
  };

  const esconder = async () => {
    if (await guardar({ nome: null, arrecadado: null, meta: null })) {
      setForm({ nome: "", arrecadado: "", meta: "" });
      setMensagem({ tipo: "ok", texto: "Campanha removida. A barra deixou de aparecer no site." });
    }
  };

  return (
    <AdminGuard>
      <section className="pad wrap">
        <AdminNav />
        <div className="section-head">
          <div>
            <div className="eyebrow">Painel de administração</div>
            <h2>Campanha de angariação</h2>
          </div>
          <p>
            A barra de progresso só aparece na secção &quot;Doar&quot; da página inicial quando os três campos
            estão preenchidos.
          </p>
        </div>

        {loading ? (
          <p>A carregar...</p>
        ) : (
          <div className="donate-panel" style={{ maxWidth: "70ch" }}>
            <form onSubmit={handleSubmit} className="form-stack">
              <input
                className="form-field"
                placeholder="Nome da campanha (ex: Proteger é Preciso 2026)"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
              <input
                className="form-field"
                type="number"
                min="0"
                step="1"
                placeholder="Valor arrecadado (Kz)"
                value={form.arrecadado}
                onChange={(e) => setForm({ ...form, arrecadado: e.target.value })}
              />
              <input
                className="form-field"
                type="number"
                min="1"
                step="1"
                placeholder="Meta (Kz)"
                value={form.meta}
                onChange={(e) => setForm({ ...form, meta: e.target.value })}
              />
              {mensagem && (
                <p className={mensagem.tipo === "ok" ? "form-success" : "form-error"}>{mensagem.texto}</p>
              )}
              <button type="submit" className="btn-donate-full" disabled={salvando}>
                {salvando ? "A guardar..." : "Guardar e mostrar no site"}
              </button>
              <button type="button" className="btn-ghost" disabled={salvando} onClick={esconder}>
                Esconder barra (apagar campanha)
              </button>
            </form>
          </div>
        )}
      </section>
    </AdminGuard>
  );
}
