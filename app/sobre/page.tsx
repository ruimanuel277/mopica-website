import { supabase } from "../lib/supabase";

const TEXTO_PADRAO = `A MOPICA — Movimento para Proteção Integral de Crianças e Adolescentes Vulneráveis — é uma ONG registada e certificada em Angola, dedicada a proteger o futuro de crianças e adolescentes em situação de vulnerabilidade.

Atuamos em áreas como educação, saúde, acolhimento e reintegração familiar, levando apoio direto a comunidades em várias províncias de Angola. Acreditamos que toda criança merece proteção e um futuro seguro, independentemente das circunstâncias em que nasceu.

Trabalhamos com total transparência, publicando anualmente relatórios sobre como cada contribuição é aplicada, e mantemos parcerias sólidas com instituições que partilham a nossa missão.`;

export default async function Sobre() {
  const { data } = await supabase.from("sobre").select("texto").eq("id", 1).single();
  const texto = data?.texto?.trim() ? data.texto : TEXTO_PADRAO;
  const paragrafos = texto.split(/\n{2,}/).filter((p: string) => p.trim() !== "");

  return (
    <section className="pad wrap">
      <div className="section-head">
        <div>
          <div className="eyebrow">Quem somos</div>
          <h2>Sobre a MOPICA</h2>
        </div>
      </div>

      <div style={{ maxWidth: "70ch" }}>
        {paragrafos.map((p: string, i: number) => (
          <p key={i} style={{ marginBottom: "20px", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {p}
          </p>
        ))}

        <div className="trust-row" style={{ marginTop: "40px" }}>
          <div><strong>12.400+</strong>vidas impactadas</div>
          <div><strong>38</strong>comunidades alcançadas</div>
          <div><strong>96%</strong>vai direto para o terreno</div>
        </div>
      </div>
    </section>
  );
}
