// Domínio do NewsFlow em memória. Relógio injetável: os testes avançam o tempo sem esperar.
const MIN = 60 * 1000
const HORA = 60 * MIN
const FUSO = 'America/Sao_Paulo'
const LIMITE_SEGMENTOS = 5
const LIMITE_VERSOES = 20
const INTERVALO_SALVAMENTO = 30 * 1000

const ok = (mensagem) => ({ ok: true, mensagem })
const erro = (mensagem) => ({ ok: false, mensagem })

class Servico {
  constructor() {
    // 10/03/2025 09:00 no fuso America/Sao_Paulo (RN03).
    this.agora = Date.UTC(2025, 2, 10, 12, 0, 0)
    this.edicoes = []
    this.assinaturas = new Map()
    this.emailsEnviados = []
  }

  avancarRelogio(ms) {
    this.agora += ms
    for (const ed of this.edicoes) {
      // RN01: salvamento automático após 30 s sem digitar
      if (ed.sujo && this.agora - ed.ultimaAlteracao >= INTERVALO_SALVAMENTO) this.salvarVersao(ed)
    }
    this.enviarDisparosPendentes()
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
    if (ed.versoes.length > LIMITE_VERSOES) ed.versoes.shift()
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

  // ---- RN03 / RN04 Agendamento e segmentação ----
  agendar(ed, segmentos, minutos) {
    if (ed.estado !== 'aprovada') return erro('A edição precisa ser aprovada antes de agendar')
    if (segmentos.length > LIMITE_SEGMENTOS) return erro('Limite de 5 segmentos atingido')
    if (segmentos.some((s) => s.assinantes.length === 0)) return erro('Segmento sem assinantes não pode ser agendado')
    if (minutos < 15) return erro('O envio precisa de ao menos 15 minutos de antecedência')
    ed.agendamento = { em: this.agora + minutos * MIN, reagendamentos: 0, segmentos, enviado: false }
    return ok('Envio agendado')
  }

  reagendar(ed, minutos) {
    if (!ed.agendamento) return erro('O envio ainda não foi agendado')
    if (ed.agendamento.reagendamentos >= 2) return erro('Limite de reagendamentos atingido')
    if (minutos < 15) return erro('O envio precisa de ao menos 15 minutos de antecedência')
    ed.agendamento.em = this.agora + minutos * MIN
    ed.agendamento.reagendamentos++
    return ok('Envio reagendado')
  }

  cancelar(ed) {
    if (!ed.agendamento) return erro('O envio ainda não foi agendado')
    if (ed.agendamento.em - this.agora < 5 * MIN) {
      return erro('Não é possível cancelar a menos de 5 minutos do envio')
    }
    ed.agendamento = null
    return ok('Envio cancelado')
  }

  // ---- Disparo ----
  enviarDisparosPendentes() {
    for (const ed of this.edicoes) {
      const agendamento = ed.agendamento
      if (agendamento && !agendamento.enviado && agendamento.em <= this.agora) {
        this.enviarParaSegmentos(ed, agendamento.segmentos)
        agendamento.enviado = true
      }
    }
  }

  enviar(ed, segmentos) {
    if (ed.estado !== 'aprovada') return erro('A edição precisa ser aprovada antes de enviar')
    this.enviarParaSegmentos(ed, segmentos)
    return ok('Edição enviada')
  }

  // RN04: quem está em dois segmentos recebe um único e-mail. RN06: todo e-mail traz o link de descadastro.
  enviarParaSegmentos(ed, segmentos) {
    const destinatarios = new Set()
    for (const segmento of segmentos) for (const email of segmento.assinantes) destinatarios.add(email)
    for (const email of destinatarios) {
      this.emailsEnviados.push({
        para: email,
        tipo: 'newsletter',
        assunto: ed.titulo,
        linkDescadastro: `https://newsflow.vertice.com/descadastro?email=${email}`
      })
    }
    return destinatarios.size
  }

  formatarDataHora(instante) {
    const partes = new Intl.DateTimeFormat('pt-BR', {
      timeZone: FUSO, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(instante)
    const valor = (tipo) => partes.find((p) => p.type === tipo).value
    return `${valor('day')}/${valor('month')} às ${valor('hour')}:${valor('minute')}`
  }

  // ---- RN06 Descadastro ----
  cadastrar(email) {
    this.assinaturas.set(email, { ativa: true, retornoPedidoEm: null })
  }

  descadastrar(email) {
    const assinatura = this.assinaturas.get(email)
    if (!assinatura) return erro('E-mail não encontrado na lista')
    assinatura.ativa = false
    this.emailsEnviados.push({ para: email, tipo: 'confirmacao-descadastro', assunto: 'Descadastro confirmado' })
    return ok('Descadastro concluído')
  }

  solicitarRetorno(email) {
    const assinatura = this.assinaturas.get(email)
    if (!assinatura) return erro('E-mail não encontrado na lista')
    assinatura.retornoPedidoEm = this.agora
    return ok('Confirme seu e-mail para voltar à lista')
  }

  confirmarRetorno(email) {
    const assinatura = this.assinaturas.get(email)
    if (!assinatura) return erro('E-mail não encontrado na lista')
    if (assinatura.retornoPedidoEm === null) return erro('Não há pedido de retorno pendente')
    if (this.agora - assinatura.retornoPedidoEm > 48 * HORA) return erro('Link de confirmação expirado')
    assinatura.ativa = true
    assinatura.retornoPedidoEm = null
    return ok('Assinatura reativada')
  }
}

module.exports = { Servico, MIN, HORA }
