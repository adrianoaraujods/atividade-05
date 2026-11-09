const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que a redatora digitou {string} na edição', function (texto) {
  this.servico.digitar(this.edicao, texto)
})

Given('que a edição não foi alterada', function () {
  assert.equal(this.edicao.sujo, false)
})

Given('que a edição tem {int} versão/versões salva(s)', function (quantidade) {
  this.servico.popularVersoes(this.edicao, quantidade)
})

When('restauro a versão {int}', function (numero) {
  this.servico.restaurarVersao(this.edicao, numero)
})

Then('o rascunho deve ter {int} versão/versões salva(s)', function (quantidade) {
  assert.equal(this.edicao.versoes.length, quantidade)
})

Then('a versão mais antiga mantida deve ser a {int}', function (numero) {
  assert.equal(this.edicao.versoes[0].numero, numero)
})

Then('o texto da edição deve ser {string}', function (texto) {
  assert.equal(this.edicao.texto, texto)
})
