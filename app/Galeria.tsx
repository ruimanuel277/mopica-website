"use client";

import { useEffect, useRef, useState } from "react";

export default function Galeria({ imagens, titulo }: { imagens: string[]; titulo: string }) {
  const [aberta, setAberta] = useState<number | null>(null);
  const toqueInicio = useRef<number | null>(null);

  const anterior = () => setAberta((i) => (i === null ? i : (i - 1 + imagens.length) % imagens.length));
  const seguinte = () => setAberta((i) => (i === null ? i : (i + 1) % imagens.length));

  useEffect(() => {
    if (aberta === null) return;
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberta(null);
      if (e.key === "ArrowLeft") setAberta((i) => (i === null ? i : (i - 1 + imagens.length) % imagens.length));
      if (e.key === "ArrowRight") setAberta((i) => (i === null ? i : (i + 1) % imagens.length));
    };
    const overflowAntes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", teclas);
    return () => {
      document.body.style.overflow = overflowAntes;
      document.removeEventListener("keydown", teclas);
    };
  }, [aberta, imagens.length]);

  if (imagens.length === 0) return null;

  return (
    <>
      <div className="galeria-grid">
        {imagens.map((url, i) => (
          <button
            key={url}
            type="button"
            className="galeria-item"
            onClick={() => setAberta(i)}
            aria-label={`Abrir foto ${i + 1} de ${imagens.length} em ecrã inteiro`}
          >
            <img src={url} alt={`${titulo} — foto ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {aberta !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${aberta + 1} de ${imagens.length}`}
          onClick={() => setAberta(null)}
          onTouchStart={(e) => (toqueInicio.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (toqueInicio.current === null) return;
            const dx = e.changedTouches[0].clientX - toqueInicio.current;
            toqueInicio.current = null;
            if (Math.abs(dx) > 50) (dx < 0 ? seguinte : anterior)();
          }}
        >
          <img
            src={imagens[aberta]}
            alt={`${titulo} — foto ${aberta + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="lightbox-contador">
            {aberta + 1} / {imagens.length}
          </div>
          <button
            type="button"
            className="lightbox-btn lightbox-fechar"
            aria-label="Fechar"
            onClick={() => setAberta(null)}
          >
            ✕
          </button>
          {imagens.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox-btn lightbox-anterior"
                aria-label="Foto anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  anterior();
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox-btn lightbox-seguinte"
                aria-label="Foto seguinte"
                onClick={(e) => {
                  e.stopPropagation();
                  seguinte();
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
