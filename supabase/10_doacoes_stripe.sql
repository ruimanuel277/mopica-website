-- Suporte a pagamentos automáticos via Stripe na tabela doacoes
-- estado: distingue doações registadas manualmente (pendente) das confirmadas
--         automaticamente pelo webhook da Stripe (confirmado)
-- stripe_session_id: identifica a sessão de checkout, evita registos duplicados
--         se a Stripe reentregar o mesmo evento de webhook
-- email: capturado pelo Stripe Checkout, útil para contacto/recibo

alter table doacoes
  add column if not exists estado text not null default 'pendente',
  add column if not exists stripe_session_id text unique,
  add column if not exists email text;
