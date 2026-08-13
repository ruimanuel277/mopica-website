"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminGuard from "../AdminGuard";
import AdminNav from "../AdminNav";

type Contacto = {
  id: number;
  nome: string;
  email: string;
  mensagem: string;
  respondido: boolean;
  created_at: string;
};

export default function AdminContactos() {
  const [lista, setLista] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    const { data } = await supabase
      .from("contactos")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLista(data as Contacto[]);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const toggleRespondido = async (c: Contacto) => {
    await supabase.from("contactos").update({ respondido: !c.respondido }).eq("id", c.id);
    carregar();
  };

  return (
    <AdminGuard>
      <section className="pad wrap">
        <AdminNav />
        <div className="section-head">
          <div>
            <div className="eyebrow">Painel de administração</div>
            <h2>Mensagens de contacto</h2>
          </div>
        </div>

        {loading ? (
          <p>A carregar...</p>
        ) : lista.length === 0 ? (
          <p>Ainda não há mensagens de contacto.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {lista.map((c) => (
              <div key={c.id} className="method admin-row" style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>{c.nome}</strong>{" "}
                  <span className={c.respondido ? "status-badge done" : "status-badge"}>
                    {c.respondido ? "Respondido" : "Por responder"}
                  </span>
                  <div style={{ fontSize: "0.85rem", marginTop: "6px", opacity: 0.8 }}>{c.email}</div>
                  <p style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.75 }}>{c.mensagem}</p>
                </div>
                <div className="admin-row-actions">
                  <button
                    onClick={() => toggleRespondido(c)}
                    className={c.respondido ? "btn-small btn-toggle done" : "btn-small btn-toggle"}
                  >
                    {c.respondido ? "Marcar por responder" : "Marcar como respondido"}
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
