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
    Então ele não deve mais estar na lista
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
    E ele não deve mais estar na lista

  @limite
  Esquema do Cenário: Link de confirmação válido por 48 horas
    Dado que "adriano@email.com" se descadastrou
    E que ele pediu para voltar à lista
    Quando ele confirma o link <horas> horas depois
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | horas | mensagem                        |
      | 1     | Assinatura reativada            |
      | 48    | Assinatura reativada            |
      | 49    | Link de confirmação expirado    |
