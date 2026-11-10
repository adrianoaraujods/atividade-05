const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que existem {int} segmentos com assinantes', function (quantidade) {
  for (let i = 0; i < quantidade; i++) {
    this.segmentos.push({ nome: `Segmento ${i + 1}`, assinantes: [`assinante${i + 1}@email.com`] })
  }
})

Given('que o envio já foi reagendado {int} vez(es)', function (vezes) {
  this.servico.agendar(this.edicao, this.segmentos, 60)
  for (let i = 0; i < vezes; i++) this.servico.reagendar(this.edicao, 60)
})

Given('que faltam {int} minutos para o envio', function (restantes) {
  this.servico.agendar(this.edicao, this.segmentos, 60)
  this.avancarMinutos(60 - restantes)
})

When('agendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.agendar(this.edicao, this.segmentos, minutos)
})

When('reagendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.reagendar(this.edicao, minutos)
})

When('cancelo o envio', function () {
  this.resultado = this.servico.cancelar(this.edicao)
})

When('o horário do envio chega', function () {
  this.servico.avancarRelogio(this.edicao.agendamento.em - this.servico.agora)
})

When('envio a edição para o segmento', function () {
  this.resultado = this.servico.enviar(this.edicao, this.segmentos)
})

Then('o disparo deve estar agendado para {string}', function (quando) {
  assert.ok(this.edicao.agendamento, 'o disparo não foi agendado')
  assert.equal(this.servico.formatarDataHora(this.edicao.agendamento.em), quando)
})

Then('o disparo não deve estar agendado', function () {
  assert.equal(this.edicao.agendamento, null)
})

Then('o disparo deve ter enviado {int} e-mails', function (quantidade) {
  const enviados = this.servico.emailsEnviados.filter((e) => e.tipo === 'newsletter').length
  assert.equal(enviados, quantidade)
})

Then('{string} deve ter recebido {int} e-mail(s)', function (email, quantidade) {
  const recebidos = this.servico.emailsEnviados.filter((e) => e.tipo === 'newsletter' && e.para === email).length
  assert.equal(recebidos, quantidade)
})

Then('o e-mail deve ter o link de descadastro', function () {
  const newsletters = this.servico.emailsEnviados.filter((e) => e.tipo === 'newsletter')
  assert.ok(newsletters.length > 0, 'nenhum e-mail foi enviado')
  for (const email of newsletters) {
    assert.ok(email.linkDescadastro, `e-mail sem link para ${email.para}`)
    assert.ok(email.linkDescadastro.includes(email.para), `link sem o e-mail do assinante: ${email.linkDescadastro}`)
  }
})

Then('nenhum e-mail deve ter sido enviado', function () {
  assert.equal(this.servico.emailsEnviados.length, 0)
})
