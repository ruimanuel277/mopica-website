"use client";

import { useState } from "react";

export default function AtividadeThumb({
  imagens,
  titulo,
  categoria,
  corVars,
}: {
  imagens: string[];
  titulo: string;
  categoria: string;
  corVars: React.CSSProperties;
}) {
  const [indice, setIndice] = useState(0);
  const imagemAtual = imagens[indice];

  return (
    <div className="t-thumb" style={corVars}>
      {imagemAtual && (
        <img
          src={imagemAtual}
          alt={titulo}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {categoria && <span className="tag">{categoria}</span>}
      {imagens.length > 1 && (
        <div className="t-thumb-dots">
          {imagens.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ver foto ${i + 1} de ${titulo}`}
              className={i === indice ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setIndice(i);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
