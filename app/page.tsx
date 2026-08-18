"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "./lib/supabase";
import AtividadeThumb from "./AtividadeThumb";

type Atividade = {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  local: string;
  data: string;
  imagem_url: string;
  imagens: string[] | null;
};

type AtividadeRow = Omit<Atividade, "descricao"> & { "descriçao": string };

type Parceiro = {
  id: number;
  nome: string;
  logo_url: string;
  site_url: string;
};

type Testemunho = {
  id: number;
  autor: string;
  cargo: string;
  mensagem: string;
};

type Video = {
  id: number;
  titulo: string;
  video_url: string;
};

const CORES = [
  ["#E8A33D", "#B5502F"],
  ["#0F3B36", "#1B1B16"],
  ["#D6473F", "#B5502F"],
  ["#E8A33D", "#0F3B36"],
  ["#B5502F", "#1B1B16"],
  ["#D6473F", "#E8A33D"],
];

function formatarData(data: string) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.slice(1)
        : u.searchParams.get("v") ?? u.pathname.split("/embed/")[1] ?? "";
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [testemunhos, setTestemunhos] = useState<Testemunho[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    supabase
      .from("atividades")
      .select("*")
      .order("data", { ascending: false })
      .then(({ data, error }) => {
        if (error) return console.error("Erro ao carregar atividades:", error);
        setAtividades(
          (data as AtividadeRow[]).map((r) => ({ ...r, descricao: r["descriçao"] }))
        );
      });

    supabase
      .from("Parceiros")
      .select("id, nome:Nome, logo_url:Logo_url, site_url:Site_url")
      .order("id", { ascending: false })
      .then(({ data, error }) => {
        if (error) return console.error("Erro ao carregar parceiros:", error);
        setParceiros(data as Parceiro[]);
      });

    supabase
      .from("Testemunhas")
      .select("id, autor:Autor, cargo:Cargo, mensagem:Mensagem")
      .order("id", { ascending: false })
      .then(({ data, error }) => {
        if (error) return console.error("Erro ao carregar testemunhos:", error);
        setTestemunhos(data as Testemunho[]);
      });

    supabase
      .from("Videos")
      .select("id, titulo:Titulo, video_url:Video_url")
      .order("id", { ascending: false })
      .then(({ data, error }) => {
        if (error) return console.error("Erro ao carregar vídeos:", error);
        setVideos(data as Video[]);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [atividades, parceiros, testemunhos, videos]);

  useEffect(() => {
    const amountButtons = document.querySelectorAll(".amount");
    const handleAmountClick = (btn: Element) => () => {
      amountButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    };
    amountButtons.forEach((btn) => btn.addEventListener("click", handleAmountClick(btn)));

    const toggleButtons = document.querySelectorAll(".toggle");
    const handleToggleClick = (btn: Element) => () => {
      toggleButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    };
    toggleButtons.forEach((btn) => btn.addEventListener("click", handleToggleClick(btn)));
  }, []);

  return (
    <>
      <section className="hero wrap">
        <div className="hero-grid">
          <div data-reveal>
            <div className="eyebrow">MOPICA · Angola · ONG Registada</div>
            <h1>
              Toda criança merece <em>proteção</em> e um <em>futuro</em> seguro.
            </h1>
            <p className="lead">
              A MOPICA protege crianças e adolescentes vulneráveis em Angola, levando educação,
              saúde e acolhimento a quem mais precisa. A sua doação — de qualquer lugar do mundo —
              chega diretamente a quem precisa dela.
            </p>
            <div className="cta-row">
              <a href="#doar" className="btn-primary">Quero doar</a>
              <Link href="/voluntarios" className="btn-ghost">Ser voluntário</Link>
            </div>
            <div className="trust-row">
              <div><strong>12.400+</strong>vidas impactadas</div>
              <div><strong>38</strong>comunidades alcançadas</div>
              <div><strong>96%</strong>vai direto para o terreno</div>
            </div>
          </div>
          <div className="hero-visual" data-reveal>
            <div className="stat-float">
              <div className="num">500</div>
              <div className="lbl">crianças e adolescentes acompanhados este trimestre</div>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-strip">
        <div className="wrap impact-grid">
          <div className="item"><strong>12.400+</strong><span>Crianças e adolescentes apoiados</span></div>
          <div className="item"><strong>38</strong><span>Comunidades alcançadas</span></div>
          <div className="item"><strong>210</strong><span>Voluntários ativos</span></div>
          <div className="item"><strong>18</strong><span>Parceiros institucionais</span></div>
        </div>
      </section>

      <div className="faixa">
        <span style={{ background: "var(--night)" }}></span>
        <span style={{ background: "var(--sun)" }}></span>
        <span style={{ background: "var(--clay)" }}></span>
        <span style={{ background: "var(--coral)" }}></span>
        <span style={{ background: "var(--night)" }}></span>
        <span style={{ background: "var(--sun)" }}></span>
      </div>

      <section className="pad wrap" id="atividades">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow">Linha do tempo</div>
            <h2>Ações realizadas no terreno</h2>
          </div>
          <p>Um registo transparente de tudo o que fazemos, comunidade a comunidade.</p>
        </div>
        {atividades.length === 0 ? (
          <p style={{ color: "rgba(27,27,22,0.55)" }}>Ainda não há atividades publicadas.</p>
        ) : (
          <div className="timeline" data-reveal>
            {atividades.map((a, i) => {
              const [c1, c2] = CORES[i % CORES.length];
              return (
                <div className="t-card" key={a.id}>
                  <AtividadeThumb
                    imagens={a.imagens && a.imagens.length > 0 ? a.imagens : a.imagem_url ? [a.imagem_url] : []}
                    titulo={a.titulo}
                    categoria={a.categoria}
                    corVars={{ "--c1": c1, "--c2": c2 } as React.CSSProperties}
                  />
                  <div className="t-body">
                    <div className="t-date">
                      {a.data ? formatarData(a.data) : ""}{a.data && a.local ? " · " : ""}{a.local}
                    </div>
                    <h3>{a.titulo}</h3>
                    <p>{a.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="pad wrap" id="doar">
        <div className="donate-section" data-reveal>
          <div>
            <div className="eyebrow">Faça a diferença hoje</div>
            <h2>Doe hoje e mude a vida de uma criança amanhã.</h2>
            <p className="lead">
              Faltam poucos dias para atingirmos a meta da campanha &quot;Proteger é Preciso 2026&quot;,
              que financia acolhimento e reintegração familiar. Cada Kwanza — ou cada dólar, euro, real — conta.
            </p>

            <div className="progress-wrap">
              <div className="progress-labels">
                <span><strong>4.850.000 Kz</strong> arrecadados</span>
                <span className="goal">meta: 7.600.000 Kz</span>
              </div>
              <div className="progress-track"><div className="progress-fill"></div></div>
            </div>

            <div className="eyebrow" style={{ color: "rgba(246,239,228,0.5)" }}>Métodos de pagamento</div>
            <div className="method-grid" style={{ marginTop: "10px" }}>
              <div className="method">Multicaixa Express</div>
              <div className="method">Referência</div>
              <div className="method">IBAN / Transferência</div>
              <div className="method">Pay/Pay</div>
              <div className="method">Cartão internacional</div>
              <div className="method">PayPal</div>
            </div>
            <p className="method-caption">Deteção automática do método mais adequado conforme a sua localização.</p>

            <div className="bank-details">
              <div className="eyebrow" style={{ color: "rgba(246,239,228,0.5)" }}>Transferência bancária direta</div>
              <div className="bank-row"><span>NIB</span><span>0051 0000 4017 1306 1515</span></div>
              <div className="bank-row"><span>IBAN</span><span>AO06 0051 0000 4017 1306 1515</span></div>
              <div className="bank-row"><span>SWIFT</span><span>BCCBAOLU</span></div>
            </div>
          </div>

          <div className="donate-panel">
            <div className="toggle-row">
              <button className="toggle active">Doação única</button>
              <button className="toggle">Mensal</button>
            </div>
            <div className="amount-grid">
              <button className="amount">5.000 Kz</button>
              <button className="amount active">15.000 Kz</button>
              <button className="amount">30.000 Kz</button>
              <button className="amount">50.000 Kz</button>
              <button className="amount">100.000 Kz</button>
              <button className="amount">Outro</button>
            </div>
            <div className="anon-row">
              <input type="checkbox" id="anon" />
              <label htmlFor="anon">Quero doar de forma anónima</label>
            </div>
            <Link href="/doacoes" className="btn-donate-full" style={{ display: "block", textAlign: "center" }}>
              Continuar para pagamento
            </Link>
          </div>
        </div>
      </section>

      <section className="pad wrap" id="parceiros">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow">Quem torna isto possível</div>
            <h2>Os nossos parceiros</h2>
          </div>
          <p>Instituições e empresas que caminham connosco em cada campanha.</p>
        </div>
        {parceiros.length === 0 ? (
          <p style={{ color: "rgba(27,27,22,0.55)" }}>Ainda não há parceiros publicados.</p>
        ) : (
          <div className="partners-row" data-reveal>
            {parceiros.map((p) => {
              const conteudo = p.logo_url ? (
                <img src={p.logo_url} alt={p.nome} style={{ maxHeight: "40px" }} />
              ) : (
                p.nome
              );
              return p.site_url ? (
                <a
                  key={p.id}
                  href={p.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-chip"
                >
                  {conteudo}
                </a>
              ) : (
                <div key={p.id} className="partner-chip">{conteudo}</div>
              );
            })}
          </div>
        )}
      </section>

      <section className="pad wrap" id="videos">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow">Veja no terreno</div>
            <h2>Histórias em vídeo</h2>
          </div>
          <p>Momentos reais das nossas ações, contados por quem os viveu.</p>
        </div>
        {videos.length === 0 ? (
          <p style={{ color: "rgba(27,27,22,0.55)" }}>Ainda não há vídeos publicados.</p>
        ) : (
          <div className="video-grid" data-reveal>
            {videos.map((v) => {
              const src = embedUrl(v.video_url);
              return (
                <div className="video-card" key={v.id}>
                  {src ? (
                    <div style={{ aspectRatio: "16/10" }}>
                      <iframe
                        src={src}
                        title={v.titulo}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ width: "100%", height: "100%", border: "none" }}
                      />
                    </div>
                  ) : (
                    <a
                      href={v.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-thumb"
                      style={{ "--c1": "#0F3B36", "--c2": "#E8A33D" } as React.CSSProperties}
                    >
                      <div className="play-btn"></div>
                    </a>
                  )}
                  <div className="t-body"><h3>{v.titulo}</h3></div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="pad wrap">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow">Prova social</div>
            <h2>Quem sente o impacto</h2>
          </div>
        </div>
        {testemunhos.length === 0 ? (
          <p style={{ color: "rgba(27,27,22,0.55)" }}>Ainda não há testemunhos publicados.</p>
        ) : (
          <div className="testi-grid" data-reveal>
            {testemunhos.map((t, i) => {
              const [c1, c2] = CORES[i % CORES.length];
              return (
                <div className="testi" key={t.id}>
                  <p>&quot;{t.mensagem}&quot;</p>
                  <div className="who">
                    <div className="avatar" style={{ "--c1": c1, "--c2": c2 } as React.CSSProperties}></div>
                    <div><strong>{t.autor}</strong>{t.cargo && <span>{t.cargo}</span>}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="pad wrap" id="transparencia">
        <div className="transp">
          <div data-reveal>
            <div className="eyebrow">Contas abertas</div>
            <h2>Transparência acima de tudo</h2>
            <p style={{ color: "rgba(27,27,22,0.65)", marginTop: "10px" }}>
              Publicamos todos os anos como cada Kwanza foi aplicado.
            </p>
            <ul className="transp-list">
              <li><span>Educação</span><span>42%</span></li>
              <li><span>Saúde</span><span>28%</span></li>
              <li><span>Alimentação</span><span>18%</span></li>
              <li><span>Operação e gestão</span><span>12%</span></li>
            </ul>
          </div>
          <div className="newsletter-box" data-reveal>
            <h3>Receba o impacto do seu apoio</h3>
            <p>Inscreva-se e acompanhe, por email, as ações que a sua atenção ajuda a manter vivas.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="seu-email@exemplo.com" />
              <button>Inscrever</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
