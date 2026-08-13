"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const MOEDAS = ["AOA", "USD", "EUR"];
const METODOS = ["Referência", "Multicaixa Express", "IBAN / Transferência", "PayPal"];

function Instrucoes({ metodo, valor, moeda }: { metodo: string; valor: string; moeda: string }) {
  switch (metodo) {
    case "IBAN / Transferência":
      return (
        <div className="bank-details" style={{ borderTop: "none", paddingTop: 0, marginTop: 0 }}>
          <div className="bank-row"><span>NIB</span><span>0051 0000 4017 1306 1515</span></div>
          <div className="bank-row"><span>IBAN</span><span>AO06 0051 0000 4017 1306 1515</span></div>
          <div className="bank-row"><span>SWIFT</span><span>BCCBAOLU</span></div>
          <p style={{ fontSize: "0.85rem", marginTop: "14px", opacity: 0.8 }}>
            Após a transferência de {valor} {moeda}, envie o comprovativo para{" "}
            <a href="mailto:ong@mopica.org" style={{ textDecoration: "underline" }}>ong@mopica.org</a> para
            confirmarmos a doação.
          </p>
        </div>
      );
    case "Multicaixa Express":
      return (
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
          Envie {valor} {moeda} por Multicaixa Express para o número <strong>+244 935 518 305</strong>. Depois de
          concluir o pagamento, envie o comprovativo por email para{" "}
          <a href="mailto:ong@mopica.org" style={{ textDecoration: "underline" }}>ong@mopica.org</a>.
        </p>
      );
    case "PayPal":
      return (
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
          Envie {valor} {moeda} através do PayPal para{" "}
          <strong>ong@mopica.org</strong>. Assim que recebermos o pagamento, confirmaremos a sua doação por email.
        </p>
      );
    default:
      return (
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
          A nossa equipa vai contactá-lo(a) com a referência de pagamento para os {valor} {moeda} indicados,
          através do email ou telefone fornecido. Se precisar de falar connosco antes disso, escreva para{" "}
          <a href="mailto:ong@mopica.org" style={{ textDecoration: "underline" }}>ong@mopica.org</a>.
        </p>
      );
  }
}

export default function Doacoes() {
  const [form, setForm] = useState({ nome: "", valor: "", moeda: "AOA", metodo: "" });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [concluida, setConcluida] = useState<{ valor: string; moeda: string; metodo: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const valorNumerico = Number(form.valor);
    if (!form.valor || isNaN(valorNumerico) || valorNumerico <= 0) {
      setErro("Introduza um valor válido, maior que zero.");
      return;
    }
    if (!form.metodo) {
      setErro("Escolha um método de pagamento.");
      return;
    }

    setEnviando(true);
    const { error } = await supabase.from("doacoes").insert([
      {
        nome: form.nome.trim() || null,
        valor: valorNumerico,
        moeda: form.moeda,
        metodo: form.metodo,
      },
    ]);
    setEnviando(false);

    if (error) {
      setErro("Não foi possível registar a doação. Tente novamente: " + error.message);
      return;
    }

    setConcluida({ valor: form.valor, moeda: form.moeda, metodo: form.metodo });
  };

  const recomecar = () => {
    setConcluida(null);
    setForm({ nome: "", valor: "", moeda: "AOA", metodo: "" });
  };

  return (
    <section className="pad wrap" style={{ maxWidth: "620px", margin: "0 auto" }}>
      <div className="section-head">
        <div>
          <div className="eyebrow">Faça a diferença hoje</div>
          <h2>Doar à MOPICA</h2>
        </div>
        <p>A sua doação — de qualquer lugar do mundo — chega diretamente a quem precisa dela.</p>
      </div>

      <div className="donate-panel" style={{ padding: "30px" }}>
        {concluida ? (
          <>
            <h3 style={{ marginBottom: "16px", fontSize: "1.1rem" }}>Obrigado pela sua doação!</h3>
            <p style={{ fontSize: "0.9rem", marginBottom: "18px", opacity: 0.8 }}>
              Registámos a sua intenção de doar {concluida.valor} {concluida.moeda} via {concluida.metodo}.
              Siga as instruções abaixo para concluir o pagamento:
            </p>
            <Instrucoes metodo={concluida.metodo} valor={concluida.valor} moeda={concluida.moeda} />
            <button onClick={recomecar} className="btn-ghost" style={{ marginTop: "22px" }}>
              Fazer outra doação
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="form-stack">
            <input
              className="form-field"
              placeholder="O seu nome (opcional — pode doar de forma anónima)"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                className="form-field"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Valor (ex: 1)"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                required
                style={{ flex: 2 }}
              />
              <select
                className="form-field"
                value={form.moeda}
                onChange={(e) => setForm({ ...form, moeda: e.target.value })}
                style={{ flex: 1 }}
              >
                {MOEDAS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <select
              className="form-field"
              value={form.metodo}
              onChange={(e) => setForm({ ...form, metodo: e.target.value })}
              required
            >
              <option value="" disabled>Método de pagamento preferido</option>
              {METODOS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {erro && <p className="form-error">{erro}</p>}
            <button type="submit" className="btn-donate-full" disabled={enviando}>
              {enviando ? "A registar..." : "Continuar para pagamento"}
            </button>
            <p style={{ fontSize: "0.76rem", opacity: 0.55 }}>
              Isto regista a sua intenção de doação e mostra as instruções de pagamento. O processamento
              automático de pagamentos ainda não está disponível — a confirmação é feita manualmente pela
              nossa equipa.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
