// Domínio do NewsFlow em memória. Relógio injetável: os testes avançam o tempo sem esperar.
const MIN = 60 * 1000
const HORA = 60 * MIN

const ok = (mensagem) => ({ ok: true, mensagem })
const erro = (mensagem) => ({ ok: false, mensagem })

class Servico {
  constructor() {
    this.agora = Date.UTC(2025, 2, 10, 12, 0, 0)
    this.edicoes = []
    this.lista = new Set()
    this.pendentes = new Map()
    this.emailsEnviados = []
  }

  avancarRelogio(ms) {
    this.agora += ms
    for (const ed of this.edicoes) {
      // RN01: salvamento automático após 30 s sem digitar
      if (ed.sujo && this.agora - ed.ultimaAlteracao >= 30 * 1000) this.salvarVersao(ed)
    }
  }

  // ---- RN01 Rascunho ----
  criarEdicao(titulo, autor) {
    const ed = {
      titulo, autor, texto: '', estado: 'rascunho', comentario: null,
      versoes: [], proximoNumero: 1, sujo: false, ultimaAlteracao: this.agora,
      agendamento: null
    }
    this.edicoes.push(ed)
    return ed
  }

  digitar(ed, texto) {
    ed.texto = texto
    ed.sujo = true
    ed.ultimaAlteracao = this.agora
  }

  salvarVersao(ed) {
    ed.versoes.push({ numero: ed.proximoNumero++, texto: ed.texto })
    if (ed.versoes.length > 20) ed.versoes.shift()
    ed.sujo = false
  }

  popularVersoes(ed, quantidade) {
    for (let i = 1; i <= quantidade; i++) {
      ed.texto = `texto ${i}`
      this.salvarVersao(ed)
    }
  }

  restaurarVersao(ed, numero) {
    const versao = ed.versoes.find((v) => v.numero === numero)
    ed.texto = versao.texto
    ed.sujo = false
  }

  // ---- RN02 Aprovação ----
  enviarParaAprovacao(ed) { ed.estado = 'em aprovação' }

  aprovar(ed, pessoa) {
    if (pessoa === ed.autor) return erro('O autor não pode aprovar a própria edição')
    ed.estado = 'aprovada'
    return ok('Edição aprovada')
  }

  reprovar(ed, pessoa, comentario) {
    if (!comentario) return erro('Informe um comentário para reprovar')
    ed.estado = 'rascunho'
    ed.comentario = comentario
    return ok('Edição devolvida ao autor')
  }

  // ---- RN03 / RN04 Agendamento ----
  agendar(ed, segmento, minutos) {
    if (ed.estado !== 'aprovada') return erro('A edição precisa ser aprovada antes de agendar')
    if (segmento.assinantes === 0) return erro('Segmento sem assinantes não pode ser agendado')
    if (minutos < 15) return erro('O envio precisa de ao menos 15 minutos de antecedência')
    ed.agendamento = { em: this.agora + minutos * MIN, reagendamentos: 0 }
    return ok('Envio agendado')
  }

  reagendar(ed, minutos) {
    if (ed.agendamento.reagendamentos >= 2) return erro('Limite de reagendamentos atingido')
    if (minutos < 15) return erro('O envio precisa de ao menos 15 minutos de antecedência')
    ed.agendamento.em = this.agora + minutos * MIN
    ed.agendamento.reagendamentos++
    return ok('Envio reagendado')
  }

  cancelar(ed) {
    if (ed.agendamento.em - this.agora < 5 * MIN) {
      return erro('Não é possível cancelar a menos de 5 minutos do envio')
    }
    ed.agendamento = null
    return ok('Envio cancelado')
  }

  // ---- RN06 Descadastro ----
  cadastrar(email) { this.lista.add(email) }

  descadastrar(email) {
    if (!this.lista.has(email)) return erro('E-mail não encontrado na lista')
    this.lista.delete(email)
    this.emailsEnviados.push({ para: email, assunto: 'Descadastro confirmado' })
    return ok('Descadastro concluído')
  }

  solicitarRetorno(email) {
    this.pendentes.set(email, this.agora)
    return ok('Confirme seu e-mail para voltar à lista')
  }

  confirmarRetorno(email) {
    if (this.agora - this.pendentes.get(email) > 48 * HORA) return erro('Link de confirmação expirado')
    this.pendentes.delete(email)
    this.lista.add(email)
    return ok('Assinatura reativada')
  }
}

module.exports = { Servico, MIN, HORA }
