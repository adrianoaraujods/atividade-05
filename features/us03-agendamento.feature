# language: pt
Funcionalidade: Agendar envio de newsletter
  Como gestora de comunicação
  Quero agendar o envio de uma edição aprovada para um segmento
  Para que ela chegue no melhor horário sem eu precisar apertar o botão

  Contexto:
    Dado que existe o segmento "Clientes Premium" com 1200 assinantes

  @feliz
  Cenário: Agendamento com antecedência suficiente
    Dado que existe a edição "Informativo #42" aprovada
    Quando agendo o envio para daqui a 30 minutos
    Então o disparo deve estar agendado
    E devo ver a mensagem "Envio agendado"

  @limite
  Esquema do Cenário: Antecedência mínima de 15 minutos
    Dado que existe a edição "Informativo #42" aprovada
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
    Dado que existe a edição "Informativo #43" ainda em rascunho
    Quando agendo o envio para daqui a 60 minutos
    Então devo ver a mensagem "A edição precisa ser aprovada antes de agendar"
    E o disparo não deve estar agendado

  @excecao
  Cenário: Segmento sem assinantes bloqueia o agendamento
    Dado que existe o segmento "Clientes Inativos" com 0 assinantes
    E que existe a edição "Informativo #42" aprovada
    Quando agendo o envio para daqui a 60 minutos
    Então devo ver a mensagem "Segmento sem assinantes não pode ser agendado"
    E o disparo não deve estar agendado

  @limite
  Esquema do Cenário: Limite de 2 reagendamentos
    Dado que existe a edição "Informativo #42" aprovada
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
    Dado que existe a edição "Informativo #42" aprovada
    E que faltam <restantes> minutos para o envio
    Quando cancelo o envio
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | restantes | mensagem                                                 |
      | 30        | Envio cancelado                                          |
      | 5         | Envio cancelado                                          |
      | 4         | Não é possível cancelar a menos de 5 minutos do envio    |
