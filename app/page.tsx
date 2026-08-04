"use client";

import { useEffect } from "react";

export default function Home() {
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

    return () => observer.disconnect();
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
              <a href="#voluntariar" className="btn-ghost">Ser voluntário</a>
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
        <div className="timeline" data-reveal>
          <div className="t-card">
            <div className="t-thumb" style={{ "--c1": "#E8A33D", "--c2": "#B5502F" } as React.CSSProperties}>
              <span className="tag">Educação</span>
            </div>
            <div className="t-body">
              <div className="t-date">14 Jul 2026 · Huambo</div>
              <h3>Entrega de material escolar</h3>
              <p>500 kits entregues a crianças em situação de vulnerabilidade em 6 escolas rurais.</p>
            </div>
          </div>
          <div className="t-card">
            <div className="t-thumb" style={{ "--c1": "#0F3B36", "--c2": "#1B1B16" } as React.CSSProperties}>
              <span className="tag">Acolhimento</span>
            </div>
            <div className="t-body">
              <div className="t-date">02 Jul 2026 · Benguela</div>
              <h3>Apoio a centro de acolhimento</h3>
              <p>Reforço de estrutura e acompanhamento psicossocial para 40 crianças acolhidas.</p>
            </div>
          </div>
          <div className="t-card">
            <div className="t-thumb" style={{ "--c1": "#D6473F", "--c2": "#B5502F" } as React.CSSProperties}>
              <span className="tag">Reintegração Familiar</span>
            </div>
            <div className="t-body">
              <div className="t-date">21 Jun 2026 · Malanje</div>
              <h3>Programa de reintegração familiar</h3>
              <p>12 crianças reintegradas com acompanhamento contínuo das famílias.</p>
            </div>
          </div>
          <div className="t-card">
            <div className="t-thumb" style={{ "--c1": "#E8A33D", "--c2": "#0F3B36" } as React.CSSProperties}>
              <span className="tag">Saúde</span>
            </div>
            <div className="t-body">
              <div className="t-date">05 Jun 2026 · Luanda</div>
              <h3>Rastreio de saúde infantil</h3>
              <p>Consultas e acompanhamento médico para mais de 300 crianças e adolescentes.</p>
            </div>
          </div>
        </div>
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
            <button className="btn-donate-full">Continuar para pagamento</button>
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
        <div className="partners-row" data-reveal>
          <div className="partner-chip">Kalunga Corp.</div>
          <div className="partner-chip">Fundação Luz</div>
          <div className="partner-chip">Banco Terra</div>
          <div className="partner-chip">Rede Saúde+</div>
          <div className="partner-chip">Grupo Sanzala</div>
        </div>
      </section>

      <section className="pad wrap" id="videos">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow">Veja no terreno</div>
            <h2>Histórias em vídeo</h2>
          </div>
          <p>Momentos reais das nossas ações, contados por quem os viveu.</p>
        </div>
        <div className="video-grid" data-reveal>
          <div className="video-card">
            <div className="video-thumb" style={{ "--c1": "#0F3B36", "--c2": "#E8A33D" } as React.CSSProperties}>
              <div className="play-btn"></div>
            </div>
            <div className="t-body"><h3>Um dia em Huambo</h3></div>
          </div>
          <div className="video-card">
            <div className="video-thumb" style={{ "--c1": "#B5502F", "--c2": "#1B1B16" } as React.CSSProperties}>
              <div className="play-btn"></div>
            </div>
            <div className="t-body"><h3>Vozes de quem apoiamos</h3></div>
          </div>
          <div className="video-card">
            <div className="video-thumb" style={{ "--c1": "#D6473F", "--c2": "#E8A33D" } as React.CSSProperties}>
              <div className="play-btn"></div>
            </div>
            <div className="t-body"><h3>Voluntariar: como começar</h3></div>
          </div>
        </div>
      </section>

      <section className="pad wrap">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow">Prova social</div>
            <h2>Quem sente o impacto</h2>
          </div>
        </div>
        <div className="testi-grid" data-reveal>
          <div className="testi">
            <p>&quot;Graças ao acompanhamento da MOPICA, o meu filho voltou para casa em segurança e continua a estudar.&quot;</p>
            <div className="who">
              <div className="avatar" style={{ "--c1": "#E8A33D", "--c2": "#B5502F" } as React.CSSProperties}></div>
              <div><strong>Ana M.</strong><span>Mãe acompanhada em Luanda</span></div>
            </div>
          </div>
          <div className="testi">
            <p>&quot;Ser voluntária aqui mudou a forma como vejo o meu próprio país.&quot;</p>
            <div className="who">
              <div className="avatar" style={{ "--c1": "#0F3B36", "--c2": "#1B1B16" } as React.CSSProperties}></div>
              <div><strong>Beatriz K.</strong><span>Voluntária desde 2024</span></div>
            </div>
          </div>
          <div className="testi">
            <p>&quot;A transparência dos relatórios foi o que nos convenceu a ser parceiros fixos.&quot;</p>
            <div className="who">
              <div className="avatar" style={{ "--c1": "#D6473F", "--c2": "#B5502F" } as React.CSSProperties}></div>
              <div><strong>Grupo Sanzala</strong><span>Parceiro institucional</span></div>
            </div>
          </div>
        </div>
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