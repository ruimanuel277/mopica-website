"use client";

import { useState } from "react";

const LINKS = [
  { href: "/#atividades", label: "Atividades" },
  { href: "/doacoes", label: "Doar" },
  { href: "/#parceiros", label: "Parceiros" },
  { href: "/#videos", label: "Vídeos" },
  { href: "/#transparencia", label: "Transparência" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [aberto, setAberto] = useState(false);

  return (
    <header>
      <nav className="wrap">
        <a href="/" className="logo">
          <span className="dot"></span>MOPICA
          <span className="verified-badge">Registada · Certificada</span>
        </a>
        <div className={aberto ? "nav-links open" : "nav-links"}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setAberto(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <a href="/doacoes" className="btn-donate">Doar agora</a>
        <button
          className="burger"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          onClick={() => setAberto(!aberto)}
        >
          {aberto ? "✕" : "☰"}
        </button>
      </nav>
    </header>
  );
}
