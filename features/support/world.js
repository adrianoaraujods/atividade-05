const { setWorldConstructor } = require('@cucumber/cucumber')
const { Servico, MIN, HORA } = require('./dominio')

// Recriado a cada cenário: nenhum estado vaza de um cenário para outro.
class MundoDoNewsFlow {
  constructor() {
    this.servico = new Servico()
    this.edicao = null
    this.segmento = null
    this.resultado = null
  }

  avancarSegundos(segundos) { this.servico.avancarRelogio(segundos * 1000) }
  avancarMinutos(minutos) { this.servico.avancarRelogio(minutos * MIN) }
  avancarHoras(horas) { this.servico.avancarRelogio(horas * HORA) }
}
setWorldConstructor(MundoDoNewsFlow)
