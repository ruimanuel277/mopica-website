-- Teste isolado: troca só a política de INSERT de "voluntarios" para usar
-- auth.role() em vez de "TO anon, authenticated". Se isto resolver, reescrevo
-- todas as políticas com este padrão.

drop policy if exists "insercao publica" on voluntarios;
create policy "insercao publica" on voluntarios
  for insert
  to public
  with check (true);
