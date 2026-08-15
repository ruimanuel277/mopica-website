import Link from "next/link";
import { stripe } from "../../lib/stripe";

async function getResumo(sessionId: string | undefined) {
  if (!sessionId) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session.amount_total || !session.currency) return null;
    return {
      valor: (session.amount_total / 100).toFixed(2),
      moeda: session.currency.toUpperCase(),
    };
  } catch {
    return null;
  }
}

export default async function DoacoesSucesso({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const resumo = await getResumo(session_id);

  return (
    <section className="pad wrap" style={{ maxWidth: "620px", margin: "0 auto" }}>
      <div className="donate-panel" style={{ padding: "30px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "16px" }}>Obrigado pela sua doação!</h2>
        <p style={{ fontSize: "0.95rem", opacity: 0.8, marginBottom: "22px" }}>
          {resumo
            ? `A sua doação de ${resumo.valor} ${resumo.moeda} foi confirmada com sucesso. `
            : "O seu pagamento foi confirmado com sucesso. "}
          A sua generosidade ajuda-nos a continuar o nosso trabalho junto de quem mais precisa.
        </p>
        <Link href="/doacoes" className="btn-ghost">
          Voltar à página de doações
        </Link>
      </div>
    </section>
  );
}
