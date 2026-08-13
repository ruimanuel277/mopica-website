-- Versao mais curta: só as políticas de INSERT nas 3 tabelas de formulários.
select tablename, policyname, roles, cmd, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('voluntarios', 'contactos', 'doacoes')
  and cmd = 'INSERT';
