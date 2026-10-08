import CopiarBotao from "./CopiarBotao";
import { BANCO, IBAN, NIB, SWIFT, TITULAR } from "./lib/dadosBancarios";

export default function DadosBancarios() {
  return (
    <>
      <div className="bank-row"><span>Titular</span><span>{TITULAR}</span></div>
      <div className="bank-row"><span>Banco</span><span>{BANCO}</span></div>
      <div className="bank-row">
        <span>NIB</span>
        <span className="bank-value">{NIB} <CopiarBotao texto={NIB} /></span>
      </div>
      <div className="bank-row">
        <span>IBAN</span>
        <span className="bank-value">{IBAN} <CopiarBotao texto={IBAN} /></span>
      </div>
      <div className="bank-row"><span>SWIFT</span><span>{SWIFT}</span></div>
    </>
  );
}
