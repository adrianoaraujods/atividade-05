# language: pt
Funcionalidade: Agendar envio de newsletter
  Como gestora de comunicação
  Quero agendar o envio de uma edição aprovada para os segmentos escolhidos
  Para que cada público receba só o que interessa, no melhor horário

  Contexto:
    Dado que existe a edição "Informativo #42" escrita por "Adriano"

  @feliz
  Cenário: Agendamento com antecedência suficiente
    Dado que existe o segmento "Clientes Premium" com 1200 assinantes
    E que a edição "Informativo #42" foi aprovada
    Quando agendo o envio para daqui a 30 minutos
    Então devo ver a mensagem "Envio agendado"
    E o disparo deve estar agendado para "10/03 às 09:30"

  @limite
  Esquema do Cenário: Antecedência mínima de 15 minutos
    Dado que existe o segmento "Clientes Premium" com 1200 assinantes
    E que a edição "Informativo #42" foi aprovada
    Quando agendo o envio para daqui a <minutos> minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                                          |
      | 60      | Envio agendado                                    |
      | 16      | Envio agendado                                    |
      | 15      | Envio agendado                                    |
      | 14      | O envio precisa de ao menos 15 minutos de antecedência |
      | 0       | O envio precisa de ao menos 15 minutos de antecedência |

  @excecao
  Cenário: Edição sem aprovação não pode ser agendada
    Dado que existe o segmento "Clientes Premium" com 1200 assinantes
    Quando agendo o envio para daqui a 60 minutos
    Então devo ver a mensagem "A edição precisa ser aprovada antes de agendar"
    E o disparo não deve estar agendado

  @excecao
  Cenário: Segmento sem assinantes bloqueia o agendamento
    Dado que existe o segmento "Clientes Inativos" com 0 assinantes
    E que a edição "Informativo #42" foi aprovada
    Quando agendo o envio para daqui a 60 minutos
    Então devo ver a mensagem "Segmento sem assinantes não pode ser agendado"
    E o disparo não deve estar agendado

  @limite
  Esquema do Cenário: Limite de 2 reagendamentos
    Dado que existe o segmento "Clientes Premium" com 1200 assinantes
    E que a edição "Informativo #42" foi aprovada
    E que o envio já foi reagendado <vezes> vezes
    Quando reagendo o envio para daqui a 60 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | vezes | mensagem                         |
      | 0     | Envio reagendado                 |
      | 1     | Envio reagendado                 |
      | 2     | Limite de reagendamentos atingido |

  @limite
  Esquema do Cenário: Cancelamento até 5 minutos antes do horário
    Dado que existe o segmento "Clientes Premium" com 1200 assinantes
    E que a edição "Informativo #42" foi aprovada
    E que faltam <restantes> minutos para o envio
    Quando cancelo o envio
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | restantes | mensagem                                                 |
      | 30        | Envio cancelado                                          |
      | 5         | Envio cancelado                                          |
      | 4         | Não é possível cancelar a menos de 5 minutos do envio    |

  @limite
  Esquema do Cenário: Limite de 5 segmentos
    Dado que existem <quantidade> segmentos com assinantes
    E que a edição "Informativo #42" foi aprovada
    Quando agendo o envio para daqui a 30 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | quantidade | mensagem                       |
      | 4          | Envio agendado                 |
      | 5          | Envio agendado                 |
      | 6          | Limite de 5 segmentos atingido |

  @feliz
  Cenário: Assinante em dois segmentos recebe um único e-mail
    Dado que existe o segmento "Clientes Premium" com os assinantes:
      | ana@email.com |
      | bruno@email.com |
    E que existe o segmento "Empresas" com os assinantes:
      | ana@email.com |
      | carla@email.com |
    E que a edição "Informativo #42" foi aprovada
    Quando agendo o envio para daqui a 30 minutos
    E o horário do envio chega
    Então o disparo deve ter enviado 3 e-mails
    E "ana@email.com" deve ter recebido 1 e-mail
    E "bruno@email.com" deve ter recebido 1 e-mail
    E "carla@email.com" deve ter recebido 1 e-mail

  @limite
  Cenário: Envio agendado para o dia seguinte no fuso de São Paulo
    Dado que existe o segmento "Clientes Premium" com 1200 assinantes
    E que a edição "Informativo #42" foi aprovada
    Quando agendo o envio para daqui a 960 minutos
    Então o disparo deve estar agendado para "11/03 às 01:00"
