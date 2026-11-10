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

When('ele confirma o link {int} hora(s) depois', function (horas) {
  this.avancarHoras(horas)
  this.resultado = this.servico.confirmarRetorno(this.email)
})

Then('a assinatura deve estar {word}', function (situacao) {
  const assinatura = this.servico.assinaturas.get(this.email)
  assert.ok(assinatura, `sem assinatura para ${this.email}`)
  assert.equal(assinatura.ativa, situacao === 'ativa')
})

Then('ele deve receber um e-mail de confirmação do descadastro', function () {
  const confirmacoes = this.servico.emailsEnviados.filter((e) => e.tipo === 'confirmacao-descadastro' && e.para === this.email)
  assert.equal(confirmacoes.length, 1)
  assert.equal(confirmacoes[0].assunto, 'Descadastro confirmado')
})

Then('nenhum e-mail de confirmação deve ser enviado', function () {
  const confirmacoes = this.servico.emailsEnviados.filter((e) => e.tipo === 'confirmacao-descadastro')
  assert.equal(confirmacoes.length, 0)
})
