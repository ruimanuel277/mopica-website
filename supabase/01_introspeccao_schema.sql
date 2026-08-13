-- Corre isto no SQL Editor do Supabase. O resultado é UMA única célula com
-- texto JSON — clique na célula para expandir e copie tudo (Ctrl+A, Ctrl+C
-- dentro da célula, ou o botão de copiar que o Supabase mostra) e cole-o
-- na conversa. Isto evita que a grelha de resultados corte informação.

select jsonb_pretty(
  jsonb_object_agg(table_name, cols order by table_name)
)
from (
  select
    table_name,
    jsonb_agg(
      jsonb_build_object(
        'column', column_name,
        'type', data_type,
        'nullable', is_nullable,
        'default', column_default
      )
      order by ordinal_position
    ) as cols
  from information_schema.columns
  where table_schema = 'public'
    and table_name in ('atividades', 'Parceiros', 'Testemunhas', 'Videos')
  group by table_name
) t;
