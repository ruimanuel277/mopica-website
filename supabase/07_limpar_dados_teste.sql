-- Remove os registos de teste criados durante a verificação.
delete from atividades where titulo = '[TESTE] Atividade de verificação';
delete from voluntarios where nome in ('[TESTE] Ana Verificacao', '[TESTE2] Publishable Key');
delete from contactos where nome = '[TESTE] Bruno Verificacao';
delete from doacoes where nome = '[TESTE] Doador Verificacao';
