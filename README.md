# NewsFlow BDD — do Gherkin ao Cucumber

Histórias, cenários Gherkin (em português) e automação com Cucumber.js sobre o NewsFlow. O domínio roda em memória (`features/support/dominio.js`) com relógio injetável e fuso `America/Sao_Paulo` fixo, para que as fronteiras de data e hora não dependam da máquina.

## Como rodar

```
npm install
npm test            # executa tudo e gera relatorios/cucumber-report.html
npm run test:dry    # valida sintaxe e passos, sem executar
```

## Estrutura

- `docs/historias.md` — US01 a US04
- `features/*.feature` — um arquivo por história
- `features/step_definitions/` — steps (`comum.steps.js` tem os reutilizados)
- `features/support/` — domínio em memória e World
- `relatorios/cucumber-report.html` — relatório da última execução

## Mapa de rastreabilidade

| História             | Regras           | Cenários                                                    |
| -------------------- | ---------------- | ----------------------------------------------------------- |
| US01 Salvar rascunho | RN01             | 8 (1 Esquema, 3 linhas)                                     |
| US02 Aprovar edição  | RN02             | 5                                                           |
| US03 Agendar envio   | RN02, RN03, RN04 | 19 (4 Esquemas: antecedência, reagendamentos, cancelamento, segmentos) |
| US04 Descadastrar    | RN06             | 8 (1 Esquema, 3 linhas)                                     |

## Cobertura das regras

| Regra | Cláusulas cobertas                                                  | Onde            |
| ----- | ------------------------------------------------------------------ | --------------- |
| RN01  | nasce como rascunho, versão a cada 30 s, 20 versões, restauração     | US01            |
| RN02  | aprovação por terceiro, autor não aprova, reprovação com comentário, envio exige aprovação | US02, US03 |
| RN03  | 15 min de antecedência, 2 reagendamentos, cancelar até 5 min, fuso `America/Sao_Paulo` | US03 |
| RN04  | máximo de 5 segmentos, segmento vazio bloqueia, assinante em dois segmentos recebe um e-mail | US03 |
| RN06  | link em todo e-mail, descadastro imediato, confirmação por e-mail, duplo opt-in, 48 h | US04 |

## Fora de escopo

- **RN05 (frequência semanal):** exige controle de fila por semana e distinção transacional/campanha; mereceria uma história própria, e quatro bem recortadas valem mais que cinco rasas.
- **RN07 (falha de entrega):** depende de simular retentativas e tipos de bounce; é comportamento de infraestrutura de envio, não da jornada de quem escreve ou assina.
- **RN08 (notificação push):** envolve canal e janela de silêncio próprios, independentes do fluxo de newsletter por e-mail coberto aqui.

## Saída de `npm test`

```
40 scenarios (40 passed)
216 steps (216 passed)
0m 0.054s (0m 0.008s executing your code)
```
