-- Corre isto no SQL Editor do Supabase depois de me enviares o resultado do
-- ficheiro 01_introspeccao_schema.sql. É seguro correr mais que uma vez
-- (idempotente): tabelas com IF NOT EXISTS, políticas com DROP + CREATE.

-- =========================================================
-- 1. TABELAS NOVAS
-- =========================================================

-- Sobre: registo único (id fixo = 1) com o texto da missão/história
create table if not exists sobre (
  id int primary key default 1,
  texto text not null default '',
  updated_at timestamptz not null default now(),
  constraint sobre_singleton check (id = 1)
);
insert into sobre (id, texto)
values (1, '')
on conflict (id) do nothing;

-- Voluntários: inscrições do formulário público /voluntarios
create table if not exists voluntarios (
  id bigint generated always as identity primary key,
  nome text not null,
  email text not null,
  telefone text,
  area_interesse text,
  disponibilidade text,
  mensagem text,
  contactado boolean not null default false,
  created_at timestamptz not null default now()
);

-- Contactos: mensagens do formulário público /contacto
create table if not exists contactos (
  id bigint generated always as identity primary key,
  nome text not null,
  email text not null,
  mensagem text not null,
  respondido boolean not null default false,
  created_at timestamptz not null default now()
);

-- Doações: intenções de doação do formulário público /doacoes
create table if not exists doacoes (
  id bigint generated always as identity primary key,
  nome text,
  valor numeric(12,2) not null,
  moeda text not null default 'AOA',
  metodo text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 2. ROW LEVEL SECURITY
-- =========================================================

alter table atividades enable row level security;
alter table "Parceiros" enable row level security;
alter table "Testemunhas" enable row level security;
alter table "Videos" enable row level security;
alter table sobre enable row level security;
alter table voluntarios enable row level security;
alter table contactos enable row level security;
alter table doacoes enable row level security;

-- --- Tabelas administrativas: leitura pública, escrita só admin ---

drop policy if exists "leitura publica" on atividades;
create policy "leitura publica" on atividades for select to anon, authenticated using (true);
drop policy if exists "escrita admin" on atividades;
create policy "escrita admin" on atividades for all to authenticated using (true) with check (true);

drop policy if exists "leitura publica" on "Parceiros";
create policy "leitura publica" on "Parceiros" for select to anon, authenticated using (true);
drop policy if exists "escrita admin" on "Parceiros";
create policy "escrita admin" on "Parceiros" for all to authenticated using (true) with check (true);

drop policy if exists "leitura publica" on "Testemunhas";
create policy "leitura publica" on "Testemunhas" for select to anon, authenticated using (true);
drop policy if exists "escrita admin" on "Testemunhas";
create policy "escrita admin" on "Testemunhas" for all to authenticated using (true) with check (true);

drop policy if exists "leitura publica" on "Videos";
create policy "leitura publica" on "Videos" for select to anon, authenticated using (true);
drop policy if exists "escrita admin" on "Videos";
create policy "escrita admin" on "Videos" for all to authenticated using (true) with check (true);

drop policy if exists "leitura publica" on sobre;
create policy "leitura publica" on sobre for select to anon, authenticated using (true);
drop policy if exists "escrita admin" on sobre;
create policy "escrita admin" on sobre for all to authenticated using (true) with check (true);

-- --- Tabelas de formulários públicos: qualquer visitante insere, só admin lê/edita ---

drop policy if exists "insercao publica" on voluntarios;
create policy "insercao publica" on voluntarios for insert to anon, authenticated with check (true);
drop policy if exists "leitura admin" on voluntarios;
create policy "leitura admin" on voluntarios for select to authenticated using (true);
drop policy if exists "edicao admin" on voluntarios;
create policy "edicao admin" on voluntarios for update to authenticated using (true) with check (true);
drop policy if exists "remocao admin" on voluntarios;
create policy "remocao admin" on voluntarios for delete to authenticated using (true);

drop policy if exists "insercao publica" on contactos;
create policy "insercao publica" on contactos for insert to anon, authenticated with check (true);
drop policy if exists "leitura admin" on contactos;
create policy "leitura admin" on contactos for select to authenticated using (true);
drop policy if exists "edicao admin" on contactos;
create policy "edicao admin" on contactos for update to authenticated using (true) with check (true);
drop policy if exists "remocao admin" on contactos;
create policy "remocao admin" on contactos for delete to authenticated using (true);

drop policy if exists "insercao publica" on doacoes;
create policy "insercao publica" on doacoes for insert to anon, authenticated with check (true);
drop policy if exists "leitura admin" on doacoes;
create policy "leitura admin" on doacoes for select to authenticated using (true);
drop policy if exists "edicao admin" on doacoes;
create policy "edicao admin" on doacoes for update to authenticated using (true) with check (true);
drop policy if exists "remocao admin" on doacoes;
create policy "remocao admin" on doacoes for delete to authenticated using (true);
