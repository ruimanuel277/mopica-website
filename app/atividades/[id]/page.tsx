"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Galeria from "../../Galeria";

type Atividade = {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  local: string;
  data: string;
  imagens: string[];
};

type AtividadeRow = Omit<Atividade, "descricao" | "imagens"> & {
  "descriçao": string;
  imagem_url: string | null;
  imagens: string[] | null;
};

export default function PaginaAtividade() {
  const { id } = useParams<{ id: string }>();
  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [estado, setEstado] = useState<"carregando" | "ok" | "nao-encontrada">("carregando");

  useEffect(() => {
    supabase
      .from("atividades")
      .select("*")
      .eq("id", Number(id))
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          if (error) console.error("Erro ao carregar atividade:", error);
          setEstado("nao-encontrada");
          return;
        }
        const r = data as AtividadeRow;
        setAtividade({
          ...r,
          descricao: r["descriçao"],
          imagens: r.imagens && r.imagens.length > 0 ? r.imagens : r.imagem_url ? [r.imagem_url] : [],
        });
        setEstado("ok");
      });
  }, [id]);

  return (
    <section className="pad wrap">
      <Link href="/#atividades" className="btn-ghost" style={{ display: "inline-block", marginBottom: "28px" }}>
        ← Todas as atividades
      </Link>

      {estado === "carregando" && <p>A carregar...</p>}
      {estado === "nao-encontrada" && <p>Esta atividade não existe ou foi removida.</p>}

      {atividade && (
        <>
          <div className="section-head">
            <div>
              <div className="eyebrow">
                {[
                  atividade.categoria,
                  atividade.data &&
                    new Date(atividade.data + "T00:00:00").toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }),
                  atividade.local,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
              <h2>{atividade.titulo}</h2>
            </div>
          </div>
          <p style={{ maxWidth: "70ch", marginBottom: "32px", whiteSpace: "pre-line", color: "rgba(27,27,22,0.75)" }}>
            {atividade.descricao}
          </p>
          {atividade.imagens.length > 0 && (
            <>
              <h3 style={{ marginBottom: "14px" }}>
                Galeria <span style={{ fontWeight: 400, opacity: 0.55 }}>({atividade.imagens.length} fotos)</span>
              </h3>
              <Galeria imagens={atividade.imagens} titulo={atividade.titulo} />
            </>
          )}
        </>
      )}
    </section>
  );
}
