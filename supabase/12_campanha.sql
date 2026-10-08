-- Campanha de angariação mostrada na secção "Doar" da página inicial.
-- Registo único (id fixo = 1), editado em /admin/campanha.
-- A barra de progresso só aparece no site quando nome, arrecadado e meta
-- estão preenchidos (meta > 0). É seguro correr mais que uma vez.

create table if not exists campanha (
  id int primary key default 1,
  nome text,
  arrecadado numeric(14,2),
  meta numeric(14,2),
  updated_at timestamptz not null default now(),
  constraint campanha_singleton check (id = 1)
);
insert into campanha (id) values (1) on conflict (id) do nothing;

alter table campanha enable row level security;

drop policy if exists "leitura publica" on campanha;
create policy "leitura publica" on campanha for select to anon, authenticated using (true);
drop policy if exists "escrita admin" on campanha;
create policy "escrita admin" on campanha for all to authenticated using (true) with check (true);
