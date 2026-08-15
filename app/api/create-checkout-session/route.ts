import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";

const MOEDAS_SUPORTADAS = ["USD", "EUR"] as const;
type MoedaSuportada = (typeof MOEDAS_SUPORTADAS)[number];

// Stripe recusa valores muito baixos (varia por moeda, ~50 cêntimos para USD/EUR)
const VALOR_MINIMO_CENTIMOS = 50;

function getOrigin(request: NextRequest) {
  return request.headers.get("origin") ?? new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const valorCentimos = Number(body?.valorCentimos);
  const moeda = String(body?.moeda ?? "").toUpperCase() as MoedaSuportada;
  const nome = typeof body?.nome === "string" ? body.nome.trim().slice(0, 200) : "";
  const mensagem = typeof body?.mensagem === "string" ? body.mensagem.trim().slice(0, 500) : "";

  if (!Number.isInteger(valorCentimos) || valorCentimos < VALOR_MINIMO_CENTIMOS) {
    return NextResponse.json({ error: "Valor de doação inválido." }, { status: 400 });
  }
  if (!MOEDAS_SUPORTADAS.includes(moeda)) {
    return NextResponse.json({ error: "Moeda não suportada." }, { status: 400 });
  }

  const origin = getOrigin(request);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: moeda.toLowerCase(),
            unit_amount: valorCentimos,
            product_data: {
              name: "Doação à MOPICA",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/doacoes/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/doacoes`,
      metadata: {
        nome: nome || "Anónimo",
        mensagem,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento: " + message }, { status: 500 });
  }
}
