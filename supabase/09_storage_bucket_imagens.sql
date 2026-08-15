-- Corre isto no SQL Editor do Supabase. Cria o bucket público "imagens"
-- (usado pelo upload de imagens no /admin) e as políticas de acesso.
-- É seguro correr mais que uma vez (idempotente).

-- =========================================================
-- 1. BUCKET PÚBLICO "imagens"
-- =========================================================

insert into storage.buckets (id, name, public)
values ('imagens', 'imagens', true)
on conflict (id) do update set public = true;

-- storage.buckets tem RLS ativo por omissão: sem esta política, o endpoint
-- de upload não consegue "ver" o bucket e devolve "Bucket not found" mesmo
-- ele existindo.
drop policy if exists "bucket imagens visivel" on storage.buckets;
create policy "bucket imagens visivel" on storage.buckets
  for select to anon, authenticated
  using (id = 'imagens');

-- =========================================================
-- 2. POLÍTICAS DE ACESSO (storage.objects)
-- =========================================================
-- Leitura pública (qualquer visitante vê as imagens no site),
-- escrita (upload/edição/remoção) só para utilizadores autenticados (admin).

drop policy if exists "imagens leitura publica" on storage.objects;
create policy "imagens leitura publica" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'imagens');

drop policy if exists "imagens upload admin" on storage.objects;
create policy "imagens upload admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'imagens');

drop policy if exists "imagens edicao admin" on storage.objects;
create policy "imagens edicao admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'imagens')
  with check (bucket_id = 'imagens');

drop policy if exists "imagens remocao admin" on storage.objects;
create policy "imagens remocao admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'imagens');

-- =========================================================
-- 3. NOVA COLUNA: foto do testemunho
-- =========================================================

alter table "Testemunhas" add column if not exists "Foto_url" text;
