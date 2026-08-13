"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminGuard from "../AdminGuard";
import AdminNav from "../AdminNav";

type Doacao = {
  id: number;
  nome: string | null;
  valor: number;
  moeda: string;
  metodo: string;
  created_at: string;
};

export default function AdminDoacoes() {
  const [lista, setLista] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from("doacoes")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setLista(data as Doacao[]);
      setLoading(false);
    };
    carregar();
  }, []);

  return (
    <AdminGuard>
      <section className="pad wrap">
        <AdminNav />
        <div className="section-head">
          <div>
            <div className="eyebrow">Painel de administração</div>
            <h2>Intenções de doação</h2>
          </div>
        </div>

        {loading ? (
          <p>A carregar...</p>
        ) : lista.length === 0 ? (
          <p>Ainda não há intenções de doação registadas.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {lista.map((d) => (
              <div key={d.id} className="method admin-row">
                <div>
                  <strong>{d.nome || "Doação anónima"}</strong> —{" "}
                  {d.valor.toLocaleString("pt-PT", { minimumFractionDigits: 2 })} {d.moeda}
                  <div style={{ fontSize: "0.85rem", marginTop: "4px", opacity: 0.8 }}>
                    Método: {d.metodo} · {new Date(d.created_at).toLocaleString("pt-PT")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminGuard>
  );
}
