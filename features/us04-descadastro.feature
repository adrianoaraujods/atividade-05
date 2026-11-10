# language: pt
Funcionalidade: Descadastrar da lista
  Como assinante
  Quero sair da lista de newsletters quando eu quiser
  Para parar de receber o que não me interessa

  Contexto:
    Dado que "adriano@email.com" é assinante da lista

  @feliz
  Cenário: Descadastro com efeito imediato e confirmação por e-mail
    Quando ele pede o descadastro
    Então a assinatura deve estar inativa
    E ele deve receber um e-mail de confirmação do descadastro

  @excecao
  Cenário: E-mail que não está na lista
    Dado que "rafael@email.com" não é assinante da lista
    Quando ele pede o descadastro
    Então devo ver a mensagem "E-mail não encontrado na lista"
    E nenhum e-mail de confirmação deve ser enviado

  @excecao
  Cenário: Retorno à lista exige confirmação
    Dado que "adriano@email.com" se descadastrou
    Quando ele pede para voltar à lista
    Então devo ver a mensagem "Confirme seu e-mail para voltar à lista"
    E a assinatura deve estar inativa

  @excecao
  Cenário: Confirmação sem pedido de retorno é recusada
    Dado que "adriano@email.com" se descadastrou
    Quando ele confirma o link 1 hora depois
    Então devo ver a mensagem "Não há pedido de retorno pendente"
    E a assinatura deve estar inativa

  @limite
  Esquema do Cenário: Link de confirmação válido por 48 horas
    Dado que "adriano@email.com" se descadastrou
    E que ele pediu para voltar à lista
    Quando ele confirma o link <horas> horas depois
    Então devo ver a mensagem "<mensagem>"
    E a assinatura deve estar <situacao>

    Exemplos:
      | horas | mensagem                     | situacao |
      | 1     | Assinatura reativada         | ativa    |
      | 48    | Assinatura reativada         | ativa    |
      | 49    | Link de confirmação expirado | inativa  |

  @feliz
  Cenário: Todo e-mail enviado traz o link de descadastro
    Dado que existe a edição "Informativo #42" escrita por "Adriano"
    E que a edição "Informativo #42" foi aprovada
    E que existe o segmento "Clientes Premium" com os assinantes:
      | adriano@email.com |
    Quando envio a edição para o segmento
    Então o e-mail deve ter o link de descadastro
    E "adriano@email.com" deve ter recebido 1 e-mail
