-- Corre tudo isto de uma vez no SQL Editor (varias instrucoes).

-- 1) Insere uma atividade real para eu poder confirmar se a LEITURA publica
--    (via API) realmente devolve dados, ou se está igualmente bloqueada.
insert into atividades (titulo, "descriçao", categoria, local, data)
values ('[TESTE] Atividade de verificação', 'Usada só para testar a API pública.', 'Teste', 'Luanda', current_date);

-- 2) Estado completo das políticas de "voluntarios" (todas as colunas, todos os comandos)
select jsonb_pretty(jsonb_agg(to_jsonb(p)))
from pg_policies p
where tablename = 'voluntarios';
