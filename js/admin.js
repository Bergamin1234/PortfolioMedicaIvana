/**
 * Dra. Ivana Caroline Silva Bergamin - Painel Médico Administrativo
 * Central de Mensagem Rápida (WhatsApp), Retornos, Dia Marcado, Agenda & Prontuário SOAP
 */

const DEFAULT_DOCTOR_CONFIG = {
  phone: '+55 69 9383-7333',
  signature: 'Dra. Ivana Bergamin • Médica (CRM/AC 3484)',
  hoursMorning: '07:30 às 12:00 (Seg a Sex)',
  hoursAfternoon: '14:00 às 18:00 (Seg a Sex)'
};

function getFutureISODate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

function isoToBRDate(iso) {
  if (!iso) return '';
  if (iso.includes('/')) return iso;
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function brToISODate(br) {
  if (!br) return getFutureISODate(1);
  if (br.includes('-')) return br;
  const parts = br.split('/');
  if (parts.length !== 3) return getFutureISODate(1);
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function normalizeWhatsAppDigits(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('55') && digits.length >= 12) return digits;
  return '55' + digits;
}

const DEFAULT_APPOINTMENTS = [
  {
    id: 'MED-908231',
    patientName: 'Maria Raimunda de Souza',
    patientPhone: '(69) 9383-7333',
    date: isoToBRDate(getFutureISODate(1)),
    time: '08:30',
    modality: 'USF Luana Freitas (ESF II)',
    reason: 'Retorno para acompanhamento de Hipertensão e exames laboratoriais.',
    status: 'Retorno Marcado',
    notes: 'Trazer exames recentes de creatinina, glicemia e lista de medicações.'
  },
  {
    id: 'MED-908232',
    patientName: 'Sebastião Ferreira da Silva',
    patientPhone: '(68) 99876-1122',
    date: isoToBRDate(getFutureISODate(1)),
    time: '09:30',
    modality: 'USF Luana Freitas (ESF II)',
    reason: 'Avaliação de Hemograma e Perfil Lipídico.',
    status: 'Pendente',
    notes: 'Confirmar se já buscou o resultado dos exames no laboratório.'
  },
  {
    id: 'MED-908233',
    patientName: 'Francisca das Chagas Lima',
    patientPhone: '(68) 98412-3344',
    date: isoToBRDate(getFutureISODate(2)),
    time: '10:00',
    modality: 'Consultório Clínico',
    reason: 'Saúde da Mulher / Preventivo e check-up anual.',
    status: 'Confirmada',
    notes: 'Trazer ultrassonografia e mamografia anterior.'
  },
  {
    id: 'MED-908234',
    patientName: 'Antônio Carlos Albuquerque',
    patientPhone: '(68) 99112-9988',
    date: isoToBRDate(getFutureISODate(3)),
    time: '14:30',
    modality: 'Telemedicina (Online)',
    reason: 'Retorno — Acompanhamento em Saúde Mental e ajuste de receita.',
    status: 'Retorno Marcado',
    notes: 'Enviar link da teleconsulta 15 minutos antes.'
  }
];

const DEFAULT_SOAP_RECORDS = [
  {
    id: 'SOAP-001',
    patientName: 'Maria Raimunda de Souza',
    date: isoToBRDate(getFutureISODate(-14)),
    s: 'Paciente refere cefaleia leve matinal ocasional. Relata uso regular de Losartana 50mg.',
    o: 'PA: 132/82 mmHg | FC: 74 bpm | SatO2: 98% | Ausculta cardiopulmonar sem alterações.',
    a: 'Hipertensão Arterial Sistêmica controlada em acompanhamento ambulatorial.',
    p: 'Mantida Losartana 50mg 1x/dia. Solicitados exames de rotina. Retorno agendado em 15 dias.'
  }
];

let appointments = [];
let soapRecords = [];
let sentHistory = [];
let doctorConfig = { ...DEFAULT_DOCTOR_CONFIG };
let activeTemplate = 'retorno';
let activeAgendaFilter = 'all';

function safeToast(msg, type = 'info') {
  if (typeof window.showToast === 'function') {
    window.showToast(msg, type);
  } else {
    alert(msg);
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadState() {
  const storedAppts = localStorage.getItem('dra_ivana_appointments');
  appointments = storedAppts ? JSON.parse(storedAppts) : [...DEFAULT_APPOINTMENTS];
  if (!storedAppts) localStorage.setItem('dra_ivana_appointments', JSON.stringify(appointments));

  const storedSoaps = localStorage.getItem('dra_ivana_soap_records');
  soapRecords = storedSoaps ? JSON.parse(storedSoaps) : [...DEFAULT_SOAP_RECORDS];
  if (!storedSoaps) localStorage.setItem('dra_ivana_soap_records', JSON.stringify(soapRecords));

  const storedSent = localStorage.getItem('dra_ivana_sent_messages');
  sentHistory = storedSent ? JSON.parse(storedSent) : [];

  const storedCfg = localStorage.getItem('dra_ivana_doctor_config');
  doctorConfig = storedCfg ? { ...DEFAULT_DOCTOR_CONFIG, ...JSON.parse(storedCfg) } : { ...DEFAULT_DOCTOR_CONFIG };
}

function persistAppointments() {
  localStorage.setItem('dra_ivana_appointments', JSON.stringify(appointments));
}

function persistSentHistory() {
  localStorage.setItem('dra_ivana_sent_messages', JSON.stringify(sentHistory));
}

function persistSoapRecords() {
  localStorage.setItem('dra_ivana_soap_records', JSON.stringify(soapRecords));
}

/* ==========================================================================
   NAVEGAÇÃO ENTRE ABAS & MOBILE MENU
   ========================================================================== */
function switchTab(tabId) {
  document.querySelectorAll('.admin-nav-item').forEach((li) => li.classList.remove('active'));
  document.querySelectorAll('.admin-view-tab').forEach((sec) => sec.classList.remove('active'));

  const btn = document.querySelector(`.admin-nav-item button[data-tab="${tabId}"]`);
  if (btn && btn.parentElement) btn.parentElement.classList.add('active');

  const section = document.getElementById(tabId);
  if (section) section.classList.add('active');

  const sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.remove('open');
}

function initNavigation() {
  document.querySelectorAll('.admin-nav-item button').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  const mobileBtn = document.getElementById('adminMobileMenuBtn');
  const sidebar = document.getElementById('adminSidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}

/* ==========================================================================
   KPIS & CONFIGURAÇÕES
   ========================================================================== */
function renderKPIs() {
  const total = appointments.length;
  const returnsCount = appointments.filter((a) => a.status === 'Retorno Marcado').length;
  const pendingCount = appointments.filter((a) => a.status === 'Pendente').length;

  const elTotal = document.getElementById('kpiTotalAppts');
  const elRet = document.getElementById('kpiReturns');
  const elPend = document.getElementById('kpiPending');
  const elSent = document.getElementById('kpiSentToday');
  const navBadge = document.getElementById('navAgendaBadge');

  if (elTotal) elTotal.textContent = total;
  if (elRet) elRet.textContent = returnsCount;
  if (elPend) elPend.textContent = pendingCount;
  if (elSent) elSent.textContent = sentHistory.length;
  if (navBadge) navBadge.textContent = total;
}

function hydrateConfigUI() {
  const sidebarPhone = document.getElementById('sidebarDoctorPhone');
  if (sidebarPhone) sidebarPhone.textContent = doctorConfig.phone;

  const cfgPhone = document.getElementById('cfgDoctorPhone');
  const cfgSig = document.getElementById('cfgDoctorSignature');
  const cfgMorn = document.getElementById('cfgHoursMorning');
  const cfgAft = document.getElementById('cfgHoursAfternoon');

  if (cfgPhone) cfgPhone.value = doctorConfig.phone;
  if (cfgSig) cfgSig.value = doctorConfig.signature;
  if (cfgMorn) cfgMorn.value = doctorConfig.hoursMorning;
  if (cfgAft) cfgAft.value = doctorConfig.hoursAfternoon;
}

window.saveDoctorConfig = function() {
  doctorConfig = {
    phone: document.getElementById('cfgDoctorPhone').value.trim() || DEFAULT_DOCTOR_CONFIG.phone,
    signature: document.getElementById('cfgDoctorSignature').value.trim() || DEFAULT_DOCTOR_CONFIG.signature,
    hoursMorning: document.getElementById('cfgHoursMorning').value.trim(),
    hoursAfternoon: document.getElementById('cfgHoursAfternoon').value.trim()
  };
  localStorage.setItem('dra_ivana_doctor_config', JSON.stringify(doctorConfig));
  hydrateConfigUI();
  updateQuickMessagePreview();
  safeToast('Configurações de contato e assinatura salvas!', 'success');
};

/* ==========================================================================
   CENTRAL DE MENSAGEM RÁPIDA (RETORNO / DIA MARCADO / MENSAGEM / EXAMES)
   ========================================================================== */
function renderQuickPatientChips() {
  const container = document.getElementById('quickPatientChips');
  if (!container) return;

  const chips = appointments.slice(0, 8).map((item) => `
    <button type="button" class="quick-chip" onclick="selectQuickPatient('${item.id}')">
      👤 ${escapeHtml(item.patientName.split(' ').slice(0, 2).join(' '))}
    </button>
  `).join('');

  container.innerHTML = chips + `
    <button type="button" class="quick-chip" onclick="clearQuickPatient()">
      ✨ Novo Paciente
    </button>
  `;
}

window.selectQuickPatient = function(id) {
  const item = appointments.find((a) => a.id === id);
  if (!item) return;

  document.getElementById('qmPatientName').value = item.patientName;
  document.getElementById('qmPatientPhone').value = item.patientPhone;
  document.getElementById('qmDate').value = brToISODate(item.date);
  document.getElementById('qmTime').value = item.time || '09:00';
  const loc = document.getElementById('qmLocation');
  if (loc && Array.from(loc.options).some((o) => o.value === item.modality)) {
    loc.value = item.modality;
  }
  document.getElementById('qmExtraNote').value = item.notes || item.reason || '';
  highlightActiveTimeChip(item.time || '09:00');
  updateQuickMessagePreview();
};

window.clearQuickPatient = function() {
  document.getElementById('qmPatientName').value = '';
  document.getElementById('qmPatientPhone').value = '';
  document.getElementById('qmExtraNote').value = '';
  document.getElementById('qmPatientName').focus();
  updateQuickMessagePreview();
};

window.setQuickDateOffset = function(days) {
  const dateInput = document.getElementById('qmDate');
  if (dateInput) {
    dateInput.value = getFutureISODate(days);
    updateQuickMessagePreview();
  }
};

function highlightActiveTimeChip(timeVal) {
  document.querySelectorAll('#quickTimeChips .quick-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.time === timeVal);
  });
}

function buildQuickMessageText() {
  const name = (document.getElementById('qmPatientName')?.value || '').trim() || 'Paciente';
  const firstName = name.split(' ')[0];
  const dateBR = isoToBRDate(document.getElementById('qmDate')?.value || getFutureISODate(1));
  const time = document.getElementById('qmTime')?.value || '09:00';
  const loc = document.getElementById('qmLocation')?.value || 'USF Luana Freitas (ESF II)';
  const note = (document.getElementById('qmExtraNote')?.value || '').trim();
  const sig = doctorConfig.signature || DEFAULT_DOCTOR_CONFIG.signature;

  const extraBlock = note ? `\n\n📝 *Orientações:* ${note}` : '';

  switch (activeTemplate) {
    case 'retorno':
      return `Olá, *${firstName}*! Tudo bem? 😊\n\nPassando para confirmar o seu *retorno médico*:\n📅 *Data:* ${dateBR}\n⏰ *Horário:* ${time}\n🏥 *Local:* ${loc}${extraBlock}\n\nPor favor, responda com *"OK"* para confirmar sua presença.\n\nAtenciosamente,\n*${sig}*`;

    case 'dia_marcado':
      return `Olá, *${firstName}*! Tudo bem? 🩺\n\nLembrando que a sua *consulta está marcada*:\n📅 *Dia:* ${dateBR}\n⏰ *Horário:* ${time}\n📍 *Local:* ${loc}${extraBlock}\n\nVocê confirma a sua presença nesse horário?\n\nUm abraço,\n*${sig}*`;

    case 'exames':
      return `Olá, *${firstName}*! 🔬\n\nLembrete importante para a nossa consulta no dia *${dateBR}* às *${time}* (${loc}):\nPor favor, lembre-se de levar os *resultados dos seus exames laboratoriais* e a receita/lista das medicações que você está utilizando.${extraBlock}\n\nQualquer dúvida, estou à disposição.\n*${sig}*`;

    case 'remarcar':
      return `Olá, *${firstName}*! Tudo bem?\n\nPrecisamos ajustar o horário do seu atendimento. Conseguimos reservar uma nova opção para você:\n📅 *Nova Data:* ${dateBR}\n⏰ *Novo Horário:* ${time}\n📍 *Local:* ${loc}${extraBlock}\n\nEsse novo dia fica bom para você? Se preferir outro horário, pode me avisar por aqui.\n\n*${sig}*`;

    case 'mensagem':
    default:
      return `Olá, *${firstName}*! Tudo bem? 😊\n\n${note || 'Passando para saber como você está se sentindo após o nosso atendimento e se ficou alguma dúvida sobre as orientações.'}\n\nQualquer necessidade, pode me chamar por aqui.\n*${sig}*`;
  }
}

function formatWhatsAppPreviewHtml(text) {
  const safe = escapeHtml(text);
  return safe.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
}

function updateQuickMessagePreview() {
  const msg = buildQuickMessageText();
  const name = (document.getElementById('qmPatientName')?.value || '').trim() || 'Paciente';
  const phone = (document.getElementById('qmPatientPhone')?.value || '').trim() || 'Digite o WhatsApp';

  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'PA';
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  document.getElementById('waPreviewInitials').textContent = initials;
  document.getElementById('waPreviewName').textContent = name;
  document.getElementById('waPreviewPhone').textContent = phone;
  document.getElementById('waPreviewCharCount').textContent = `${msg.length} caracteres`;
  document.getElementById('waPreviewBubble').innerHTML = `${formatWhatsAppPreviewHtml(msg)}<div class="wa-bubble-meta"><span>${timeStr}</span><span class="wa-checks">✓✓</span></div>`;

  // Ajusta label de observação no modo Mensagem Livre
  const noteLabel = document.getElementById('qmExtraNoteLabel');
  const scheduleBox = document.getElementById('qmScheduleFields');
  if (noteLabel && scheduleBox) {
    if (activeTemplate === 'mensagem') {
      noteLabel.textContent = 'Escreva sua mensagem personalizada para o paciente';
      scheduleBox.style.opacity = '0.55';
    } else {
      noteLabel.textContent = 'Orientações adicionais (ex: exames, jejum, receita)';
      scheduleBox.style.opacity = '1';
    }
  }
}

function getTemplateLabel(key) {
  const map = {
    retorno: '🔄 Retorno',
    dia_marcado: '📅 Dia Marcado',
    mensagem: '💬 Mensagem',
    exames: '🧪 Exames',
    remarcar: '⏰ Remarcar'
  };
  return map[key] || '💬 Mensagem';
}

window.dispatchQuickWhatsApp = function(saveToAgenda) {
  const name = (document.getElementById('qmPatientName').value || '').trim();
  const rawPhone = (document.getElementById('qmPatientPhone').value || '').trim();
  const dateBR = isoToBRDate(document.getElementById('qmDate').value || getFutureISODate(1));
  const time = document.getElementById('qmTime').value || '09:00';
  const loc = document.getElementById('qmLocation').value;
  const note = (document.getElementById('qmExtraNote').value || '').trim();

  if (!name) {
    safeToast('Informe o nome do paciente antes de enviar.', 'warning');
    document.getElementById('qmPatientName').focus();
    return;
  }

  const phoneDigits = normalizeWhatsAppDigits(rawPhone || doctorConfig.phone);
  const text = buildQuickMessageText();

  if (saveToAgenda) {
    const newStatus = activeTemplate === 'retorno' ? 'Retorno Marcado' : 'Confirmada';
    const existing = appointments.find((a) => a.patientName.toLowerCase() === name.toLowerCase() && a.date === dateBR);
    if (existing) {
      existing.time = time;
      existing.modality = loc;
      existing.status = newStatus;
      if (note) existing.notes = note;
    } else {
      appointments.unshift({
        id: 'MED-' + Math.floor(100000 + Math.random() * 900000),
        patientName: name,
        patientPhone: rawPhone || doctorConfig.phone,
        date: dateBR,
        time: time,
        modality: loc,
        reason: activeTemplate === 'retorno' ? 'Retorno médico agendado via WhatsApp' : 'Consulta marcada pelo painel',
        status: newStatus,
        notes: note
      });
    }
    persistAppointments();
    renderAgendaCards();
    renderQuickPatientChips();
    safeToast(`Salvo na agenda (${dateBR} às ${time}) e abrindo WhatsApp!`, 'success');
  } else {
    safeToast(`Abrindo WhatsApp para ${name}...`, 'success');
  }

  // Salva no histórico de envios
  sentHistory.unshift({
    id: 'MSG-' + Date.now(),
    patientName: name,
    patientPhone: rawPhone || doctorConfig.phone,
    type: getTemplateLabel(activeTemplate),
    dateBR,
    time,
    text,
    sentAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  });
  if (sentHistory.length > 20) sentHistory.pop();
  persistSentHistory();
  renderSentHistory();
  renderKPIs();

  window.open(`https://api.whatsapp.com/send?phone=${phoneDigits}&text=${encodeURIComponent(text)}`, '_blank');
};

window.sendTestToDoctorPhone = function() {
  const digits = normalizeWhatsAppDigits(doctorConfig.phone);
  const text = buildQuickMessageText();
  window.open(`https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`, '_blank');
  safeToast(`Enviando prévia para o WhatsApp oficial (${doctorConfig.phone})!`, 'info');
};

window.copyQuickMessage = function() {
  const text = buildQuickMessageText();
  navigator.clipboard.writeText(text).then(() => {
    safeToast('Mensagem copiada! Só colar no WhatsApp.', 'success');
  }).catch(() => {
    safeToast('Não foi possível copiar automaticamente.', 'warning');
  });
};

function renderSentHistory() {
  const container = document.getElementById('sentHistoryList');
  if (!container) return;

  if (!sentHistory.length) {
    container.innerHTML = `<p style="font-size: 0.78rem; color: var(--admin-text-muted); text-align: center; margin: 0.75rem 0;">Nenhuma mensagem enviada ainda hoje.</p>`;
    return;
  }

  container.innerHTML = sentHistory.slice(0, 6).map((h) => `
    <div class="sent-history-item">
      <div>
        <div class="sent-history-name">${escapeHtml(h.patientName)}</div>
        <div class="sent-history-meta">${escapeHtml(h.type)} • ${h.dateBR} ${h.time} • Enviado às ${h.sentAt}</div>
      </div>
      <button type="button" class="btn-mini btn-mini-wa" onclick="resendHistoryMsg('${h.id}')">Reenviar</button>
    </div>
  `).join('');
}

window.resendHistoryMsg = function(id) {
  const item = sentHistory.find((h) => h.id === id);
  if (!item) return;
  const digits = normalizeWhatsAppDigits(item.patientPhone);
  window.open(`https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(item.text)}`, '_blank');
};

window.clearSentHistory = function() {
  sentHistory = [];
  persistSentHistory();
  renderSentHistory();
  renderKPIs();
};

function initQuickMessageComposer() {
  // Data padrão: amanhã
  const dateInput = document.getElementById('qmDate');
  if (dateInput && !dateInput.value) dateInput.value = getFutureISODate(1);

  // Template picker
  document.querySelectorAll('#templatePicker .template-card-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#templatePicker .template-card-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeTemplate = btn.dataset.template;
      updateQuickMessagePreview();
    });
  });

  // Time chips
  document.querySelectorAll('#quickTimeChips .quick-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.getElementById('qmTime').value = chip.dataset.time;
      highlightActiveTimeChip(chip.dataset.time);
      updateQuickMessagePreview();
    });
  });

  // Live listeners
  ['qmPatientName', 'qmPatientPhone', 'qmDate', 'qmTime', 'qmLocation', 'qmExtraNote'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateQuickMessagePreview);
    if (el) el.addEventListener('change', updateQuickMessagePreview);
  });

  // Pré-seleciona o primeiro paciente para já mostrar uma prévia linda
  if (appointments.length > 0) {
    selectQuickPatient(appointments[0].id);
  } else {
    updateQuickMessagePreview();
  }
}

/* ==========================================================================
   AGENDA & RETORNOS (CARDS INTERATIVOS)
   ========================================================================== */
function statusBadgeClass(status) {
  if (status === 'Confirmada') return 'status-confirmada';
  if (status === 'Retorno Marcado') return 'status-retorno';
  if (status === 'Pendente') return 'status-pendente';
  if (status === 'Concluída') return 'status-concluida';
  return 'status-cancelada';
}

function renderAgendaCards() {
  const container = document.getElementById('agendaCardsList');
  if (!container) return;

  const query = (document.getElementById('agendaSearchInput')?.value || '').trim().toLowerCase();
  const filtered = appointments.filter((a) => {
    const matchesStatus = activeAgendaFilter === 'all' || a.status === activeAgendaFilter;
    const matchesSearch = !query ||
      a.patientName.toLowerCase().includes(query) ||
      (a.reason || '').toLowerCase().includes(query) ||
      (a.modality || '').toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  if (!filtered.length) {
    container.innerHTML = `<div class="panel-card" style="grid-column: 1 / -1; text-align: center; color: var(--admin-text-muted);">Nenhum agendamento encontrado com esse filtro.</div>`;
    return;
  }

  container.innerHTML = filtered.map((item) => `
    <div class="agenda-card">
      <div class="agenda-card-top">
        <span class="agenda-time-pill">📅 ${escapeHtml(item.date)} • ⏰ ${escapeHtml(item.time)}</span>
        <span class="status-badge ${statusBadgeClass(item.status)}">${escapeHtml(item.status)}</span>
      </div>
      <div>
        <h4 class="agenda-patient-name">${escapeHtml(item.patientName)}</h4>
        <div class="agenda-patient-meta">📱 ${escapeHtml(item.patientPhone)} • 🏥 ${escapeHtml(item.modality)}</div>
      </div>
      <div class="agenda-reason-box">
        <strong>Motivo:</strong> ${escapeHtml(item.reason || 'Consulta de rotina')}
        ${item.notes ? `<br><strong>Obs:</strong> ${escapeHtml(item.notes)}` : ''}
      </div>
      <div class="agenda-card-actions">
        <button type="button" class="btn-mini btn-mini-wa" onclick="jumpToQuickMessage('${item.id}', 'dia_marcado')">💬 Mensagem</button>
        <button type="button" class="btn-mini btn-mini-return" onclick="jumpToQuickMessage('${item.id}', 'retorno')">🔄 Retorno</button>
        ${item.status !== 'Confirmada' ? `<button type="button" class="btn-mini" onclick="updateApptStatus('${item.id}', 'Confirmada')">✓ Confirmar</button>` : ''}
        <button type="button" class="btn-mini" onclick="openSoapModal('${item.id}')">🩺 SOAP</button>
        <button type="button" class="btn-mini" style="color: var(--admin-danger); margin-left: auto;" onclick="deleteAppointment('${item.id}')" title="Remover">🗑️</button>
      </div>
    </div>
  `).join('');
}

window.jumpToQuickMessage = function(id, templateKey) {
  activeTemplate = templateKey;
  document.querySelectorAll('#templatePicker .template-card-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.template === templateKey);
  });
  selectQuickPatient(id);
  if (templateKey === 'retorno') {
    setQuickDateOffset(15);
  }
  switchTab('tab-quickmsg');
  safeToast(templateKey === 'retorno' ? 'Modo Retorno (+15 dias) carregado!' : 'Mensagem de Dia Marcado pronta para enviar!', 'info');
};

window.updateApptStatus = function(id, status) {
  const item = appointments.find((a) => a.id === id);
  if (!item) return;
  item.status = status;
  persistAppointments();
  renderAgendaCards();
  renderKPIs();
  safeToast(`Status de ${item.patientName} atualizado para ${status}.`, 'success');
};

window.deleteAppointment = function(id) {
  appointments = appointments.filter((a) => a.id !== id);
  persistAppointments();
  renderAgendaCards();
  renderQuickPatientChips();
  renderKPIs();
  safeToast('Agendamento removido da agenda.', 'info');
};

window.openNewAppointmentModal = function() {
  document.getElementById('naDate').value = getFutureISODate(1);
  document.getElementById('newApptModal').classList.add('open');
};

window.closeNewAppointmentModal = function() {
  document.getElementById('newApptModal').classList.remove('open');
};

function initAgendaEvents() {
  document.querySelectorAll('#agendaFilterPills .quick-chip').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#agendaFilterPills .quick-chip').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeAgendaFilter = pill.dataset.filter;
      renderAgendaCards();
    });
  });

  const searchInput = document.getElementById('agendaSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderAgendaCards);

  const form = document.getElementById('newApptForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newAppt = {
        id: 'MED-' + Math.floor(100000 + Math.random() * 900000),
        patientName: document.getElementById('naName').value.trim(),
        patientPhone: document.getElementById('naPhone').value.trim(),
        date: isoToBRDate(document.getElementById('naDate').value),
        time: document.getElementById('naTime').value,
        modality: document.getElementById('naModality').value,
        reason: document.getElementById('naReason').value.trim() || 'Consulta agendada',
        status: document.getElementById('naType').value,
        notes: ''
      };
      appointments.unshift(newAppt);
      persistAppointments();
      renderAgendaCards();
      renderQuickPatientChips();
      renderKPIs();
      form.reset();
      closeNewAppointmentModal();
      safeToast(`Horário salvo para ${newAppt.patientName} em ${newAppt.date} às ${newAppt.time}!`, 'success');
    });
  }
}

/* ==========================================================================
   PRONTUÁRIO SOAP & RECEITUÁRIO TIMBRADO
   ========================================================================== */
function renderSoapHistory() {
  const container = document.getElementById('soapHistoryContainer');
  if (!container) return;

  if (!soapRecords.length) {
    container.innerHTML = `<p style="color: var(--admin-text-muted); text-align: center;">Nenhuma evolução clínica registrada ainda.</p>`;
    return;
  }

  container.innerHTML = soapRecords.map((rec) => `
    <div class="agenda-card">
      <div class="agenda-card-top">
        <strong>🩺 ${escapeHtml(rec.patientName)}</strong>
        <span class="agenda-time-pill">${escapeHtml(rec.date)}</span>
      </div>
      <div class="agenda-reason-box">
        <div><strong>S:</strong> ${escapeHtml(rec.s)}</div>
        <div><strong>O:</strong> ${escapeHtml(rec.o)}</div>
        <div><strong>A:</strong> ${escapeHtml(rec.a)}</div>
        <div><strong>P:</strong> ${escapeHtml(rec.p)}</div>
      </div>
    </div>
  `).join('');
}

window.openSoapModal = function(apptId) {
  const item = appointments.find((a) => a.id === apptId);
  document.getElementById('soapApptId').value = apptId || '';
  const manualGroup = document.getElementById('soapManualNameGroup');

  if (item) {
    manualGroup.style.display = 'none';
    document.getElementById('soapPatientSubtitle').textContent = `${item.patientName} • ${item.date} às ${item.time}`;
    document.getElementById('soapSubjetivo').value = item.reason || '';
    document.getElementById('soapObjetivo').value = 'PA: 120/80 mmHg | FC: 72 bpm | SatO2: 99% | BEG, LOTE.';
    document.getElementById('soapAvaliacao').value = '';
    document.getElementById('soapPlano').value = '';
  } else {
    manualGroup.style.display = 'block';
    document.getElementById('soapManualPatientName').value = '';
    document.getElementById('soapPatientSubtitle').textContent = 'Nova Evolução Avulsa / Receituário';
    document.getElementById('soapSubjetivo').value = '';
    document.getElementById('soapObjetivo').value = '';
    document.getElementById('soapAvaliacao').value = '';
    document.getElementById('soapPlano').value = '';
  }

  document.getElementById('soapModal').classList.add('open');
};

window.closeSoapModal = function() {
  document.getElementById('soapModal').classList.remove('open');
};

window.saveSoapRecord = function() {
  const apptId = document.getElementById('soapApptId').value;
  const item = appointments.find((a) => a.id === apptId);
  const patientName = item ? item.patientName : (document.getElementById('soapManualPatientName').value.trim() || 'Paciente');

  soapRecords.unshift({
    id: 'SOAP-' + Date.now(),
    patientName,
    date: new Date().toLocaleDateString('pt-BR'),
    s: document.getElementById('soapSubjetivo').value.trim() || '—',
    o: document.getElementById('soapObjetivo').value.trim() || '—',
    a: document.getElementById('soapAvaliacao').value.trim() || '—',
    p: document.getElementById('soapPlano').value.trim() || '—'
  });
  persistSoapRecords();

  if (item) {
    item.status = 'Concluída';
    persistAppointments();
    renderAgendaCards();
  }

  renderSoapHistory();
  renderKPIs();
  closeSoapModal();
  safeToast(`Prontuário SOAP salvo para ${patientName}!`, 'success');
};

window.printPrescription = function() {
  const apptId = document.getElementById('soapApptId').value;
  const item = appointments.find((a) => a.id === apptId);
  const patientName = item ? item.patientName : (document.getElementById('soapManualPatientName').value.trim() || 'Paciente');
  const plano = document.getElementById('soapPlano').value.trim() || 'Orientações clínicas conforme consulta médica.';
  const today = new Date().toLocaleDateString('pt-BR');

  const printArea = document.getElementById('printArea');
  printArea.innerHTML = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #0f172a; max-width: 720px; margin: 0 auto; border: 2px solid #0284c7; padding: 36px; border-radius: 12px;">
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
        <div>
          <h1 style="margin: 0; font-size: 20px; color: #0369a1;">Dra. Ivana Caroline Silva Bergamin</h1>
          <p style="margin: 4px 0 0; font-size: 13px; color: #475569;">Médica • Medicina de Família e Comunidade (COREME/FUNDHACRE)</p>
          <p style="margin: 2px 0 0; font-size: 12px; color: #64748b;">WhatsApp: ${escapeHtml(doctorConfig.phone)}</p>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; font-size: 14px; color: #0284c7;">CRM/AC 3484</div>
          <div style="font-size: 12px; color: #64748b;">Rio Branco – AC • ${today}</div>
        </div>
      </div>
      <div style="margin-bottom: 22px; font-size: 14px;">
        <strong>Paciente:</strong> ${escapeHtml(patientName)}
      </div>
      <div style="min-height: 280px; font-size: 15px; line-height: 1.75; white-space: pre-wrap; margin-bottom: 40px;">
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.06em; color: #0369a1; margin-bottom: 12px;">Receituário & Plano Terapêutico</h3>
        ${escapeHtml(plano)}
      </div>
      <div style="text-align: center; border-top: 1px solid #cbd5e1; padding-top: 14px; width: 320px; margin: 0 auto;">
        <strong style="font-size: 13px;">Dra. Ivana Caroline Silva Bergamin</strong><br>
        <span style="font-size: 12px; color: #64748b;">CRM/AC 3484 • Assinatura Médica</span>
      </div>
    </div>
  `;
  window.print();
};

/* ==========================================================================
   TRIAGENS RECEBIDAS DO PORTAL PÚBLICO
   ========================================================================== */
function renderTriageInbox() {
  const container = document.getElementById('triageInboxContainer');
  const badge = document.getElementById('navTriageBadge');
  if (!container) return;

  const stored = localStorage.getItem('dra_ivana_triages');
  const triages = stored ? JSON.parse(stored) : [];

  if (badge) {
    badge.textContent = triages.length;
    badge.style.display = triages.length > 0 ? 'inline-block' : 'none';
  }

  if (!triages.length) {
    container.innerHTML = `<p style="color: var(--admin-text-muted); text-align: center;">Nenhuma pré-triagem enviada pelo site público até o momento.</p>`;
    return;
  }

  container.innerHTML = triages.map((t) => `
    <div class="agenda-card">
      <div class="agenda-card-top">
        <strong>🚨 ${escapeHtml(t.name || 'Paciente')}</strong>
        <span class="agenda-time-pill">${escapeHtml(t.date || '')}</span>
      </div>
      <div class="agenda-reason-box">
        <strong>Queixa:</strong> ${escapeHtml(t.symptoms || t.complaint || 'Pré-consulta enviada')}
      </div>
      <div class="agenda-card-actions">
        <button type="button" class="btn-mini btn-mini-wa" onclick="replyTriageWhatsApp('${escapeHtml(t.name || '')}', '${escapeHtml(t.phone || '')}')">
          💬 Responder no WhatsApp
        </button>
      </div>
    </div>
  `).join('');
}

window.replyTriageWhatsApp = function(name, phone) {
  document.getElementById('qmPatientName').value = name;
  document.getElementById('qmPatientPhone').value = phone;
  activeTemplate = 'mensagem';
  document.querySelectorAll('#templatePicker .template-card-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.template === 'mensagem');
  });
  document.getElementById('qmExtraNote').value = 'Recebi a sua pré-triagem pelo site! Vamos agendar o melhor horário para avaliar com calma?';
  updateQuickMessagePreview();
  switchTab('tab-quickmsg');
};

/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initNavigation();
  hydrateConfigUI();
  renderQuickPatientChips();
  initQuickMessageComposer();
  renderSentHistory();
  initAgendaEvents();
  renderAgendaCards();
  renderSoapHistory();
  renderTriageInbox();
  renderKPIs();
});
