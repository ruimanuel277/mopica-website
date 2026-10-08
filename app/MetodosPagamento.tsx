"use client";

import { useState } from "react";
import Link from "next/link";
import CopiarBotao from "./CopiarBotao";
import DadosBancarios from "./DadosBancarios";
import { MULTICAIXA_EXPRESS } from "./lib/dadosBancarios";

export default function MetodosPagamento() {
  const [multicaixaAberto, setMulticaixaAberto] = useState(false);

  const irParaTransferencia = () => {
    setMulticaixaAberto(false);
    document.getElementById("transferencia")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <div className="eyebrow" style={{ color: "rgba(246,239,228,0.5)" }}>Métodos de pagamento</div>
      <div className="method-grid" style={{ marginTop: "10px" }}>
        <button
          type="button"
          className={multicaixaAberto ? "method active" : "method"}
          aria-expanded={multicaixaAberto}
          onClick={() => setMulticaixaAberto(!multicaixaAberto)}
        >
          Multicaixa Express
        </button>
        <button type="button" className="method" onClick={irParaTransferencia}>
          IBAN / Transferência
        </button>
        <Link href="/doacoes" className="method">
          Cartão internacional
        </Link>
      </div>

      {multicaixaAberto && (
        <div className="method-detail">
          <div className="method-detail-num">
            <strong>{MULTICAIXA_EXPRESS}</strong>
            <CopiarBotao texto={MULTICAIXA_EXPRESS} label="Copiar número" />
          </div>
          <ol>
            <li>Abra a app Multicaixa Express.</li>
            <li>Escolha enviar dinheiro para este número e indique o valor da doação.</li>
            <li>
              Envie o comprovativo para{" "}
              <a href="mailto:ong@mopica.org" style={{ textDecoration: "underline" }}>ong@mopica.org</a>.
            </li>
          </ol>
        </div>
      )}

      <div className="bank-details" id="transferencia">
        <div className="eyebrow" style={{ color: "rgba(246,239,228,0.5)" }}>Transferência bancária direta</div>
        <DadosBancarios />
      </div>
    </>
  );
}
