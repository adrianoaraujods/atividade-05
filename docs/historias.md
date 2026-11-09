# Histórias de usuário — NewsFlow

## US01 — Salvar rascunho automaticamente

**Como** redatora
**Quero** que meu texto seja salvo enquanto escrevo
**Para** não perder trabalho quando a conexão cair

**Critérios de aceitação**

- O rascunho é salvo após 30 segundos sem digitar.
- Cada salvamento cria uma versão numerada.
- Apenas as últimas 20 versões são mantidas.
- Restaurar uma versão não apaga as seguintes.

**Regras cobertas:** RN01
**Prioridade:** Alta — perda de conteúdo é a reclamação número um dos redatores.
**Cenários:** features/us01-rascunho.feature

## US02 — Aprovar edição antes do envio

**Como** revisor
**Quero** aprovar ou reprovar uma edição escrita por outra pessoa
**Para** que nada seja enviado aos assinantes sem conferência

**Critérios de aceitação**

- Um revisor diferente do autor pode aprovar a edição.
- O autor não pode aprovar a própria edição.
- A reprovação exige um comentário.
- Reprovada, a edição volta a rascunho com o comentário visível ao autor.

**Regras cobertas:** RN02
**Prioridade:** Alta — um erro enviado a 40 mil pessoas não tem volta.
**Cenários:** features/us02-aprovacao.feature

## US03 — Agendar envio de newsletter

**Como** gestora de comunicação
**Quero** agendar o envio de uma edição aprovada para um segmento
**Para** que ela chegue no melhor horário sem eu precisar apertar o botão

**Critérios de aceitação**

- Só edições aprovadas podem ser agendadas.
- O envio exige ao menos 15 minutos de antecedência.
- Segmento sem assinantes bloqueia o agendamento.
- Reagendar é permitido até 2 vezes; cancelar, até 5 minutos antes do horário.

**Regras cobertas:** RN02, RN03, RN04
**Prioridade:** Média — o produto funciona sem agendar, mas é o principal ganho de tempo da gestão.
**Cenários:** features/us03-agendamento.feature

## US04 — Descadastrar da lista

**Como** assinante
**Quero** sair da lista de newsletters quando eu quiser
**Para** parar de receber o que não me interessa

**Critérios de aceitação**

- O descadastro tem efeito imediato.
- O assinante recebe um e-mail confirmando a saída.
- Para voltar à lista é preciso confirmar o e-mail (duplo opt-in).
- O link de confirmação é válido por 48 horas.

**Regras cobertas:** RN06
**Prioridade:** Média — obrigação legal e de reputação, mas de baixo volume.
**Cenários:** features/us04-descadastro.feature
