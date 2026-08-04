import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOPICA — Movimento para Proteção Integral de Crianças e Adolescentes Vulneráveis",
  description:
    "MOPICA protege crianças e adolescentes vulneráveis em Angola, levando educação, saúde e acolhimento a quem mais precisa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-AO">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header>
          <nav className="wrap">
            <a href="/" className="logo">
              <span className="dot"></span>MOPICA
              <span className="verified-badge">Registada · Certificada</span>
            </a>
            <div className="nav-links">
              <a href="/#atividades">Atividades</a>
              <a href="/#doar">Doar</a>
              <a href="/#parceiros">Parceiros</a>
              <a href="/#videos">Vídeos</a>
              <a href="/#transparencia">Transparência</a>
              <a href="/sobre">Sobre</a>
              <a href="/contacto">Contacto</a>
            </div>
            <a href="/#doar" className="btn-donate">Doar agora</a>
            <button className="burger">☰</button>
          </nav>
        </header>

        <div className="faixa">
          <span style={{ background: "var(--sun)" }}></span>
          <span style={{ background: "var(--clay)" }}></span>
          <span style={{ background: "var(--night)" }}></span>
          <span style={{ background: "var(--coral)" }}></span>
          <span style={{ background: "var(--sun)" }}></span>
          <span style={{ background: "var(--clay)" }}></span>
        </div>

        {children}

        <div className="faixa">
          <span style={{ background: "var(--night)" }}></span>
          <span style={{ background: "var(--sun)" }}></span>
          <span style={{ background: "var(--clay)" }}></span>
          <span style={{ background: "var(--coral)" }}></span>
          <span style={{ background: "var(--night)" }}></span>
          <span style={{ background: "var(--sun)" }}></span>
        </div>

        <footer id="voluntariar">
          <div className="wrap">
            <div className="foot-grid">
              <div>
                <div className="foot-logo">MOPICA</div>
                <p style={{ fontSize: "0.86rem", maxWidth: "32ch", opacity: 0.7 }}>
                  Movimento para Proteção Integral de Crianças e Adolescentes Vulneráveis. ONG
                  registada e certificada em Angola, a proteger o futuro de quem mais precisa.
                </p>
              </div>
              <div>
                <h4>Navegação</h4>
                <a href="/#atividades">Atividades</a>
                <a href="/#doar">Doar</a>
                <a href="/#parceiros">Parceiros</a>
                <a href="/#videos">Vídeos</a>
              </div>
              <div>
                <h4>Envolva-se</h4>
                <a href="/#voluntariar">Seja voluntário</a>
                <a href="/#transparencia">Transparência</a>
                <a href="/sobre">Sobre nós</a>
                <a href="/contacto">Contacto</a>
              </div>
              <div>
                <h4>Contacto</h4>
                <a href="mailto:ong@mopica.org">ong@mopica.org</a>
                <a href="/contacto">www.mopica.org</a>
                <a href="tel:+244935518305">+244 935 518 305 · +244 924 250 525</a>
                <a href="/contacto">Luanda, Município dos Mulenvos</a>
                <a href="#">Instagram · Facebook</a>
              </div>
            </div>
            <div className="foot-bottom">
              <span>
                © 2026 MOPICA. Todos os direitos reservados. · NIF 5002179938 · Registo n.º
                38/2025 · Certidão n.º 107-A
              </span>
              <div className="lang-switch"><b>PT</b><span>/</span>EN</div>
            </div>
            <div className="foot-address">
              Sede Nacional: Bairro Baixa de Cassange, Vila Nova da Boa-fé, Casa Nº 86, Q.1,
              Zona 5, por detrás da Escola Nº 5093, Ex-9093 — Luanda/Angola
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 