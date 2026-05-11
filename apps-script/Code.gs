/**
 * ============================================================================
 *  CONGRESSO TÉCNICO COPA SKILL.ED 2026 — Backend Apps Script
 * ============================================================================
 *
 *  Este script recebe inscrições POST do site (Vercel),
 *  grava na planilha vinculada e envia confirmação por e-mail.
 *
 *  ─── Como instalar ─────────────────────────────────────────────────────────
 *  1. Crie uma planilha nova no Google Sheets chamada
 *     "Inscrições Congresso Técnico 2026"
 *  2. No menu, vá em: Extensões > Apps Script
 *  3. Cole TODO este arquivo no editor (substituindo o conteúdo padrão)
 *  4. Ajuste as constantes abaixo (ABA, EMAIL_NOTIFICACAO, TOKEN_SEGURANCA)
 *  5. Salve (Ctrl+S) e dê um nome ao projeto (ex: "Inscrições Congresso 2026")
 *  6. Clique em "Implantar" > "Nova implantação"
 *     - Tipo: Aplicativo da Web
 *     - Executar como: Eu (seu email)
 *     - Quem pode acessar: Qualquer pessoa
 *  7. Copie a URL gerada (termina em /exec) e cole na variável de ambiente
 *     APPS_SCRIPT_WEBHOOK_URL no Vercel.
 *
 *  ─── IMPORTANTE: SEGURANÇA ──────────────────────────────────────────────────
 *  Como o endpoint precisa ser "Qualquer pessoa", há proteção por TOKEN
 *  no payload (segredo compartilhado entre Vercel e Apps Script).
 *  Defina TOKEN_SEGURANCA abaixo E também envie esse mesmo valor do Next.js.
 *
 *  Se você não usar token, qualquer um que descobrir a URL pode poluir
 *  sua planilha. RECOMENDADO usar token.
 * ============================================================================
 */

const ABA = 'Inscrições';
const EMAIL_NOTIFICACAO = 'allan.ronzio@gmail.com';
const NOME_REMETENTE = 'Copa Skill.Ed';
const TOKEN_SEGURANCA = 'TROQUE_ESTE_TOKEN_POR_UM_VALOR_ALEATORIO_LONGO';

const COLUNAS = [
  'Recebido em (UTC)',
  'Recebido em (BRT)',
  'Nome',
  'CPF',
  'E-mail',
  'WhatsApp',
  'Escola',
  'Cargo',
  'Modalidades',
  'Aceite LGPD',
  'IP'
];

/**
 * Endpoint POST chamado pela API route do Next.js.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Sem corpo' }, 400);
    }

    const payload = JSON.parse(e.postData.contents);

    // Verificação de token (proteção contra spam de quem descobrir a URL)
    if (TOKEN_SEGURANCA && payload.token !== TOKEN_SEGURANCA) {
      Logger.log('Token inválido. Rejeitado.');
      return jsonResponse({ ok: false, error: 'Não autorizado' }, 401);
    }

    const sheet = obterOuCriarAba();

    // Verificação de duplicidade por CPF (evita reinscrição acidental)
    if (cpfJaInscrito(sheet, payload.cpf)) {
      // Não retorna erro — sucesso silencioso para não confundir o usuário,
      // mas notifica o organizador para ciência.
      MailApp.sendEmail({
        to: EMAIL_NOTIFICACAO,
        subject: '[Copa Skill.Ed] Tentativa de reinscrição — ' + payload.nome,
        body: 'O CPF ' + formatarCpf(payload.cpf) + ' já está inscrito.\n\n' +
              'Tentativa de: ' + payload.nome + ' (' + payload.email + ')\n' +
              'Recebido em: ' + new Date().toLocaleString('pt-BR'),
      });
      return jsonResponse({ ok: true, duplicate: true });
    }

    // Gravar linha
    const agora = new Date();
    const tzBR = Utilities.formatDate(agora, 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');
    const tzUTC = Utilities.formatDate(agora, 'UTC', 'yyyy-MM-dd HH:mm:ss');

    sheet.appendRow([
      tzUTC,
      tzBR,
      payload.nome,
      formatarCpf(payload.cpf),
      payload.email,
      formatarTelefone(payload.whatsapp),
      payload.escola,
      payload.cargo,
      (payload.modalidades || []).join(', '),
      payload.consentimentoLgpd ? 'Sim' : 'Não',
      payload.ip || ''
    ]);

    // Enviar e-mails (em paralelo seria melhor, mas Apps Script é síncrono)
    enviarConfirmacaoParticipante(payload);
    enviarNotificacaoOrganizador(payload, tzBR);

    return jsonResponse({ ok: true });
  } catch (err) {
    Logger.log('ERRO doPost: ' + err);
    // Notifica organizador sobre falha
    try {
      MailApp.sendEmail({
        to: EMAIL_NOTIFICACAO,
        subject: '[Copa Skill.Ed] ERRO no Apps Script',
        body: 'Erro: ' + err.toString() + '\n\nPayload: ' + (e && e.postData ? e.postData.contents : 'N/A')
      });
    } catch (_) {}
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

/**
 * GET — útil para teste manual no navegador.
 */
function doGet() {
  return jsonResponse({
    ok: true,
    service: 'Inscrições Congresso Técnico Copa Skill.Ed 2026',
    method: 'POST com JSON'
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function obterOuCriarAba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(ABA);
  if (!sheet) {
    sheet = ss.insertSheet(ABA);
  }
  // Cabeçalho
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUNAS);
    const headerRange = sheet.getRange(1, 1, 1, COLUNAS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0A0A0A');
    headerRange.setFontColor('#D4A24E');
    sheet.setFrozenRows(1);
    // Larguras
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(4, 130);
    sheet.setColumnWidth(5, 220);
    sheet.setColumnWidth(6, 140);
    sheet.setColumnWidth(7, 220);
    sheet.setColumnWidth(8, 180);
    sheet.setColumnWidth(9, 180);
    sheet.setColumnWidth(10, 80);
    sheet.setColumnWidth(11, 130);
  }
  return sheet;
}

function cpfJaInscrito(sheet, cpfRaw) {
  const cpfFormatado = formatarCpf(cpfRaw);
  if (sheet.getLastRow() < 2) return false;
  const cpfs = sheet.getRange(2, 4, sheet.getLastRow() - 1, 1).getValues();
  return cpfs.some(function (linha) {
    return String(linha[0]).trim() === cpfFormatado;
  });
}

function formatarCpf(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  if (d.length !== 11) return raw;
  return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9);
}

function formatarTelefone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  if (d.length === 11) {
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  if (d.length === 10) {
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  }
  return raw;
}

function enviarConfirmacaoParticipante(payload) {
  const subject = 'Inscrição confirmada — Congresso Técnico Copa Skill.Ed 2026';
  const html =
    '<div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #F5F5F5; padding: 32px;">' +
      '<h1 style="font-family: Impact, sans-serif; font-size: 36px; letter-spacing: -1px; color: #F5F5F5; margin: 0 0 8px;">CONGRESSO TÉCNICO</h1>' +
      '<p style="color: #D4A24E; font-weight: bold; letter-spacing: 4px; font-size: 12px; margin: 0 0 32px;">COPA SKILL.ED · 2026</p>' +
      '<p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Olá <strong>' + escapeHtml(payload.nome) + '</strong>,</p>' +
      '<p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px;">Sua inscrição no Congresso Técnico da Copa Skill.Ed 2026 foi confirmada.</p>' +
      '<div style="border: 1px solid #262626; padding: 20px; margin: 24px 0; background: #141414;">' +
        '<p style="margin: 0 0 4px; color: #8A8A8A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Quando</p>' +
        '<p style="margin: 0 0 16px; font-size: 16px; font-weight: bold;">18 de maio de 2026 · Segunda-feira · 19h45 às 21h30</p>' +
        '<p style="margin: 0 0 4px; color: #8A8A8A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Onde</p>' +
        '<p style="margin: 0; font-size: 16px; font-weight: bold;">USCS Campus Itapetininga</p>' +
        '<p style="margin: 4px 0 0; font-size: 14px; color: #B5B5B5;">Av. Dr. Ciro Albuquerque, 4.750 — Taboãozinho — Itapetininga/SP</p>' +
      '</div>' +
      '<p style="font-size: 14px; line-height: 1.6; color: #B5B5B5; margin: 24px 0;">Recomendamos chegar com 15 minutos de antecedência. Em caso de impossibilidade de comparecimento, comunique a organização até 24h antes.</p>' +
      '<p style="font-size: 14px; line-height: 1.6; margin: 24px 0;">Qualquer dúvida, responda este e-mail ou fale conosco no WhatsApp <a href="https://wa.me/5515997441170" style="color: #D4A24E; text-decoration: none;">(15) 99744-1170</a>.</p>' +
      '<p style="font-size: 14px; margin: 32px 0 0;">Nos vemos lá.</p>' +
      '<p style="font-size: 14px; margin: 4px 0 0; color: #8A8A8A;">— Equipe Copa Skill.Ed</p>' +
      '<hr style="border: none; border-top: 1px solid #262626; margin: 32px 0 16px;">' +
      '<p style="font-size: 11px; color: #666; margin: 0;">AR9 Eventos Esportivos LTDA — CNPJ 61.000.035/0001-15</p>' +
    '</div>';

  MailApp.sendEmail({
    to: payload.email,
    subject: subject,
    htmlBody: html,
    name: NOME_REMETENTE,
    replyTo: EMAIL_NOTIFICACAO
  });
}

function enviarNotificacaoOrganizador(payload, dataHora) {
  const subject = '[Copa Skill.Ed] Nova inscrição — ' + payload.nome;
  const body =
    'Nova inscrição registrada no Congresso Técnico 2026.\n\n' +
    '─────────────────────────────────────\n' +
    'Recebido em: ' + dataHora + '\n' +
    'Nome: ' + payload.nome + '\n' +
    'CPF: ' + formatarCpf(payload.cpf) + '\n' +
    'E-mail: ' + payload.email + '\n' +
    'WhatsApp: ' + formatarTelefone(payload.whatsapp) + '\n' +
    'Escola: ' + payload.escola + '\n' +
    'Cargo: ' + payload.cargo + '\n' +
    'Modalidades: ' + (payload.modalidades || []).join(', ') + '\n' +
    'Aceite LGPD: ' + (payload.consentimentoLgpd ? 'Sim' : 'Não') + '\n' +
    'IP: ' + (payload.ip || 'N/A') + '\n' +
    '─────────────────────────────────────';

  MailApp.sendEmail({
    to: EMAIL_NOTIFICACAO,
    subject: subject,
    body: body
  });
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse(obj, status) {
  // Apps Script ContentService não permite definir status code,
  // então o handshake é via { ok: true|false } no body.
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
