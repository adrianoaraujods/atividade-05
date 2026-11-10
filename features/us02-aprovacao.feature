# language: pt
Funcionalidade: Aprovar edição antes do envio
  Como revisor
  Quero aprovar ou reprovar uma edição escrita por outra pessoa
  Para que nada seja enviado aos assinantes sem conferência

  Contexto:
    Dado que existe a edição "Informativo #42" escrita por "Adriano"
    E que a edição foi enviada para aprovação

  @feliz
  Cenário: Revisor aprova a edição de outra pessoa
    Quando "Sandro" aprova a edição
    Então a edição deve estar "aprovada"

  @excecao
  Cenário: Autor não aprova a própria edição
    Quando "Adriano" aprova a edição
    Então devo ver a mensagem "O autor não pode aprovar a própria edição"
    E a edição deve continuar "em aprovação"

  @excecao
  Cenário: Reprovação exige comentário
    Quando "Sandro" reprova a edição sem comentário
    Então devo ver a mensagem "Informe um comentário para reprovar"
    E a edição deve continuar "em aprovação"

  @feliz
  Cenário: Reprovação com comentário devolve a edição ao autor
    Quando "Sandro" reprova a edição com o comentário "Corrigir o título"
    Então a edição deve estar "rascunho"
    E o autor deve ver o comentário "Corrigir o título"

  @excecao
  Cenário: Edição sem aprovação não chega aos assinantes
    Dado que existe o segmento "Clientes Premium" com os assinantes:
      | ana@email.com |
      | bruno@email.com |
    Quando envio a edição para o segmento
    Então devo ver a mensagem "A edição precisa ser aprovada antes de enviar"
    E nenhum e-mail deve ter sido enviado
