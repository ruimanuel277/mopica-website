export default function Sobre() {
  return (
    <section className="pad wrap">
      <div className="section-head">
        <div>
          <div className="eyebrow">Quem somos</div>
          <h2>Sobre a MOPICA</h2>
        </div>
      </div>

      <div style={{ maxWidth: "70ch" }}>
        <p style={{ marginBottom: "20px", fontSize: "1.05rem", lineHeight: 1.7 }}>
          A MOPICA — Movimento para Proteção Integral de Crianças e Adolescentes Vulneráveis —
          é uma ONG registada e certificada em Angola, dedicada a proteger o futuro de crianças
          e adolescentes em situação de vulnerabilidade.
        </p>
        <p style={{ marginBottom: "20px", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Atuamos em áreas como educação, saúde, acolhimento e reintegração familiar, levando
          apoio direto a comunidades em várias províncias de Angola. Acreditamos que toda
          criança merece proteção e um futuro seguro, independentemente das circunstâncias em
          que nasceu.
        </p>
        <p style={{ marginBottom: "20px", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Trabalhamos com total transparência, publicando anualmente relatórios sobre como cada
          contribuição é aplicada, e mantemos parcerias sólidas com instituições que partilham
          a nossa missão.
        </p>

        <div className="trust-row" style={{ marginTop: "40px" }}>
          <div><strong>12.400+</strong>vidas impactadas</div>
          <div><strong>38</strong>comunidades alcançadas</div>
          <div><strong>96%</strong>vai direto para o terreno</div>
        </div>
      </div>
    </section>
  );
} 