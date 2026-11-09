# NewsFlow BDD — do Gherkin ao Cucumber

Histórias, cenários Gherkin (em português) e automação com Cucumber.js sobre o NewsFlow. O domínio roda em memória (`features/support/dominio.js`) com relógio injetável.

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
| US01 Salvar rascunho | RN01             | 7 (1 Esquema, 3 linhas)                                     |
| US02 Aprovar edição  | RN02             | 4                                                           |
| US03 Agendar envio   | RN02, RN03, RN04 | 14 (3 Esquemas: antecedência, reagendamentos, cancelamento) |
| US04 Descadastrar    | RN06             | 6 (1 Esquema, 3 linhas)                                     |

## Fora de escopo

- **RN05 (frequência semanal):** exige controle de fila por semana e distinção transacional/campanha; mereceria uma história própria, e quatro bem recortadas valem mais que cinco rasas.
- **RN07 (falha de entrega):** depende de simular retentativas e tipos de bounce; é comportamento de infraestrutura de envio, não da jornada de quem escreve ou assina.
- **RN08 (notificação push):** envolve canal e janela de silêncio próprios, independentes do fluxo de newsletter por e-mail coberto aqui.

## Saída de `npm test`

```
31 scenarios (31 passed)
149 steps (149 passed)
0m 0.039s (0m 0.003s executing your code)
```
