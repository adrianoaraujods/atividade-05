const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");

Given(
  "que existe o segmento {string} com {int} assinantes",
  function (nome, assinantes) {
    this.segmento = { nome, assinantes };
  },
);

Given("que existe a edição {string} aprovada", function (titulo) {
  this.edicao = this.servico.criarEdicao(titulo, "Adriano");
  this.servico.aprovar(this.edicao, "Sandro");
});

Given("que existe a edição {string} ainda em rascunho", function (titulo) {
  this.edicao = this.servico.criarEdicao(titulo, "Adriano");
});

Given(
  "que o envio está agendado para daqui a {int} minutos",
  function (minutos) {
    this.servico.agendar(this.edicao, this.segmento, minutos);
  },
);

Given("que o envio já foi reagendado {int} vez(es)", function (vezes) {
  this.servico.agendar(this.edicao, this.segmento, 60);
  for (let i = 0; i < vezes; i++) this.servico.reagendar(this.edicao, 60);
});

Given("que faltam {int} minutos para o envio", function (restantes) {
  this.servico.agendar(this.edicao, this.segmento, 60);
  this.avancarMinutos(60 - restantes);
});

When("agendo o envio para daqui a {int} minutos", function (minutos) {
  this.resultado = this.servico.agendar(this.edicao, this.segmento, minutos);
});

When("reagendo o envio para daqui a {int} minutos", function (minutos) {
  this.resultado = this.servico.reagendar(this.edicao, minutos);
});

When("cancelo o envio", function () {
  this.resultado = this.servico.cancelar(this.edicao);
});

Then("o disparo deve estar agendado", function () {
  assert.ok(this.edicao.agendamento);
});

Then("o disparo não deve estar agendado", function () {
  assert.equal(this.edicao.agendamento, null);
});
