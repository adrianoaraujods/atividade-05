const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que a edição foi enviada para aprovação', function () {
  this.servico.enviarParaAprovacao(this.edicao)
})

When('{string} aprova a edição', function (pessoa) {
  this.resultado = this.servico.aprovar(this.edicao, pessoa)
})

When('{string} reprova a edição sem comentário', function (pessoa) {
  this.resultado = this.servico.reprovar(this.edicao, pessoa, '')
})

When('{string} reprova a edição com o comentário {string}', function (pessoa, comentario) {
  this.resultado = this.servico.reprovar(this.edicao, pessoa, comentario)
})

Then('o autor deve ver o comentário {string}', function (comentario) {
  assert.equal(this.edicao.comentario, comentario)
})
