"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminGuard from "../AdminGuard";
import AdminNav from "../AdminNav";

type Voluntario = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  area_interesse: string | null;
  disponibilidade: string | null;
  mensagem: string | null;
  contactado: boolean;
  created_at: string;
};

export default function AdminVoluntarios() {
  const [lista, setLista] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    const { data } = await supabase
      .from("voluntarios")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLista(data as Voluntario[]);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const toggleContactado = async (v: Voluntario) => {
    await supabase.from("voluntarios").update({ contactado: !v.contactado }).eq("id", v.id);
    carregar();
  };

  return (
    <AdminGuard>
      <section className="pad wrap">
        <AdminNav />
        <div className="section-head">
          <div>
            <div className="eyebrow">Painel de administração</div>
            <h2>Inscrições de voluntariado</h2>
          </div>
        </div>

        {loading ? (
          <p>A carregar...</p>
        ) : lista.length === 0 ? (
          <p>Ainda não há inscrições de voluntariado.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {lista.map((v) => (
              <div key={v.id} className="method admin-row" style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>{v.nome}</strong>{" "}
                  <span className={v.contactado ? "status-badge done" : "status-badge"}>
                    {v.contactado ? "Contactado" : "Por contactar"}
                  </span>
                  <div style={{ fontSize: "0.85rem", marginTop: "6px", opacity: 0.8 }}>
                    {v.email} {v.telefone ? `· ${v.telefone}` : ""}
                  </div>
                  {(v.area_interesse || v.disponibilidade) && (
                    <div style={{ fontSize: "0.85rem", marginTop: "4px", opacity: 0.8 }}>
                      {v.area_interesse} {v.disponibilidade ? `· Disponibilidade: ${v.disponibilidade}` : ""}
                    </div>
                  )}
                  {v.mensagem && (
                    <p style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.75 }}>{v.mensagem}</p>
                  )}
                </div>
                <div className="admin-row-actions">
                  <button
                    onClick={() => toggleContactado(v)}
                    className={v.contactado ? "btn-small btn-toggle done" : "btn-small btn-toggle"}
                  >
                    {v.contactado ? "Marcar por contactar" : "Marcar como contactado"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminGuard>
  );
}
