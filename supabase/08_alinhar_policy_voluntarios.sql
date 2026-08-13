-- Opcional: só para manter a política de "voluntarios" igual às de
-- "contactos"/"doacoes" (o teste anterior tinha-a mudado para "to public",
-- que também funciona, mas isto alinha tudo outra vez).
drop policy if exists "insercao publica" on voluntarios;
create policy "insercao publica" on voluntarios
  for insert
  to anon, authenticated
  with check (true);
