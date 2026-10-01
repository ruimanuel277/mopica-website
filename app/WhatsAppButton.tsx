"use client";

import { useEffect, useRef, useState } from "react";

const CONTACTOS = [
  { label: "Informações gerais", numero: "244935518305", visivel: "+244 935 518 305" },
  { label: "Doações e parcerias", numero: "244924250525", visivel: "+244 924 250 525" },
];

function IconeWhatsApp({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.46 9.46 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.41 9.41 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46zm8.06-17.53A11.32 11.32 0 0 0 12.04.63C5.76.63.65 5.74.65 12.02c0 2.01.52 3.97 1.52 5.69L.55 23.6l6.04-1.58a11.36 11.36 0 0 0 5.44 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.33-8.05z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fecharFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    const fecharEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", fecharFora);
    document.addEventListener("keydown", fecharEsc);
    return () => {
      document.removeEventListener("mousedown", fecharFora);
      document.removeEventListener("keydown", fecharEsc);
    };
  }, [aberto]);

  return (
    <div className="wa-float" ref={ref}>
      {aberto && (
        <div className="wa-menu" role="menu">
          <div className="wa-menu-head">Fale connosco no WhatsApp</div>
          {CONTACTOS.map((c) => (
            <a
              key={c.numero}
              href={`https://wa.me/${c.numero}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-option"
              role="menuitem"
              onClick={() => setAberto(false)}
            >
              <span className="wa-option-icon"><IconeWhatsApp size={18} /></span>
              <span>
                <strong>{c.label}</strong>
                <small>{c.visivel}</small>
              </span>
            </a>
          ))}
        </div>
      )}
      <button
        className="wa-btn"
        aria-label={aberto ? "Fechar menu WhatsApp" : "Contactar por WhatsApp"}
        aria-expanded={aberto}
        onClick={() => setAberto(!aberto)}
      >
        {aberto ? <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>✕</span> : <IconeWhatsApp />}
      </button>
    </div>
  );
}
