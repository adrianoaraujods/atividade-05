const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que existe a edição {string} escrita por {string}', function (titulo, autor) {
  this.edicao = this.servico.criarEdicao(titulo, autor)
})

Given('que a edição {string} foi aprovada', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  this.servico.aprovar(this.edicao, 'Sandro')
})

Given('que existe o segmento {string} com {int} assinantes', function (nome, quantidade) {
  const assinantes = Array.from({ length: quantidade }, (_, i) => `assinante${i + 1}@email.com`)
  this.segmentos.push({ nome, assinantes })
})

Given('que existe o segmento {string} com os assinantes:', function (nome, tabela) {
  this.segmentos.push({ nome, assinantes: tabela.raw().flat() })
})

When('eu espero {int} segundos sem digitar', function (segundos) {
  this.avancarSegundos(segundos)
})

Then('devo ver a mensagem {string}', function (esperada) {
  assert.equal(this.resultado.mensagem, esperada)
})

Then('a edição deve estar/continuar {string}', function (estado) {
  assert.equal(this.edicao.estado, estado)
})
