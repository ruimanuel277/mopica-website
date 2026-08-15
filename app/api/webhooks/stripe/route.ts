import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { supabase } from "../../../lib/supabase";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Assinatura inválida";
    return NextResponse.json({ error: "Assinatura de webhook inválida: " + message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const valor = (session.amount_total ?? 0) / 100;
    const moeda = (session.currency ?? "usd").toUpperCase();
    const nome = session.metadata?.nome || null;
    const email = session.customer_details?.email || null;

    const { error } = await supabase.from("doacoes").insert([
      {
        nome,
        valor,
        moeda,
        metodo: "Stripe",
        estado: "confirmado",
        stripe_session_id: session.id,
        email,
      },
    ]);

    // Reentregas do mesmo evento pela Stripe violam o índice único de
    // stripe_session_id — isso é esperado e não deve falhar o webhook.
    if (error && error.code !== "23505") {
      return NextResponse.json({ error: "Erro ao registar doação: " + error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
