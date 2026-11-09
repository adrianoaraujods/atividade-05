const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que {string} é assinante da lista', function (email) {
  this.email = email
  this.servico.cadastrar(email)
})

Given('que {string} não é assinante da lista', function (email) {
  this.email = email
})

Given('que {string} se descadastrou', function (email) {
  this.email = email
  this.servico.cadastrar(email)
  this.servico.descadastrar(email)
})

Given('que ele pediu para voltar à lista', function () {
  this.servico.solicitarRetorno(this.email)
})

When('ele pede o descadastro', function () {
  this.resultado = this.servico.descadastrar(this.email)
})

When('ele pede para voltar à lista', function () {
  this.resultado = this.servico.solicitarRetorno(this.email)
})

When('ele confirma o link {int} horas depois', function (horas) {
  this.avancarHoras(horas)
  this.resultado = this.servico.confirmarRetorno(this.email)
})

Then('ele não deve mais estar na lista', function () {
  assert.equal(this.servico.lista.has(this.email), false)
})

Then('ele deve estar na lista', function () {
  assert.equal(this.servico.lista.has(this.email), true)
})

Then('ele deve receber um e-mail de confirmação do descadastro', function () {
  assert.ok(this.servico.emailsEnviados.some((e) => e.para === this.email && e.assunto === 'Descadastro confirmado'))
})

Then('nenhum e-mail de confirmação deve ser enviado', function () {
  assert.equal(this.servico.emailsEnviados.length, 0)
})
