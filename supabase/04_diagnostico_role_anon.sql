-- Testa a política RLS diretamente na base de dados, "vestindo a pele" do
-- papel anon, sem passar pela API. Isto isola se o problema é da política
-- em si ou de como a chave publishable está a ser mapeada para o papel anon.

set role anon;

insert into voluntarios (nome, email, mensagem)
values ('[TESTE SQL] Ana Verificacao', 'teste@mopica.org', 'Teste via SQL Editor com SET ROLE anon');

reset role;

-- Se a linha acima INSERIU sem erro, o problema é no mapeamento da chave
-- publishable para o papel anon (algo a corrigir nas definições da API do
-- projeto Supabase), não na política SQL.
-- Se der o MESMO erro "new row violates row-level security policy",
-- o problema está mesmo na política.
