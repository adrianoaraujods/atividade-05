# language: pt
Funcionalidade: Salvar rascunho automaticamente
  Como redatora
  Quero que meu texto seja salvo enquanto escrevo
  Para não perder trabalho quando a conexão cair

  Contexto:
    Dado que existe a edição "Informativo #42" escrita por "Adriano"

  @feliz
  Cenário: Toda edição nasce como rascunho
    Dado que a redatora digitou "Primeiro parágrafo" na edição
    Quando eu espero 30 segundos sem digitar
    Então a edição deve estar "rascunho"

  @feliz
  Cenário: Rascunho salvo após 30 segundos sem digitar
    Dado que a redatora digitou "Primeiro parágrafo" na edição
    Quando eu espero 30 segundos sem digitar
    Então o rascunho deve ter 1 versão salva

  @excecao
  Cenário: Edição sem alterações não gera versão
    Dado que a edição não foi alterada
    Quando eu espero 30 segundos sem digitar
    Então o rascunho deve ter 0 versões salvas

  @excecao
  Cenário: Salvamento não ocorre antes de 30 segundos
    Dado que a redatora digitou "Primeiro parágrafo" na edição
    Quando eu espero 29 segundos sem digitar
    Então o rascunho deve ter 0 versões salvas

  @limite
  Esquema do Cenário: Mantém apenas as últimas 20 versões
    Dado que a edição tem <salvas> versões salvas
    E que a redatora digitou "texto novo" na edição
    Quando eu espero 30 segundos sem digitar
    Então o rascunho deve ter <mantidas> versões salvas
    E a versão mais antiga mantida deve ser a <antiga>

    Exemplos:
      | salvas | mantidas | antiga |
      | 0      | 1        | 1      |
      | 19     | 20       | 1      |
      | 20     | 20       | 2      |

  @feliz
  Cenário: Restaurar uma versão não apaga as seguintes
    Dado que a edição tem 3 versões salvas
    Quando restauro a versão 1
    Então o texto da edição deve ser "texto 1"
    E o rascunho deve ter 3 versões salvas
