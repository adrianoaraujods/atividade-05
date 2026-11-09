const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que existe a edição {string} escrita por {string}', function (titulo, autor) {
  this.edicao = this.servico.criarEdicao(titulo, autor)
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
