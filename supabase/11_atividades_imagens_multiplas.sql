-- Corre isto no SQL Editor do Supabase.
-- Adiciona suporte a múltiplas fotos por atividade, mantendo a coluna
-- "imagem_url" antiga intacta (atividades já existentes continuam a funcionar).
-- É seguro correr mais que uma vez (idempotente).

alter table atividades
  add column if not exists imagens text[] not null default '{}';
