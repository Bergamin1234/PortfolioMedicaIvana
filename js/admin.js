/**
 * Dra. Ivana Caroline Silva Bergamin - Painel Administrativo Clínico
 * Prontuário SOAP, Gestão de Agenda, Faturamento SUS e Emissão de Receitas Timbradas
 */

// Dados iniciais de demonstração para a prática clínica da Dra. Ivana
const DEFAULT_APPOINTMENTS = [
  {
    id: "MED-908231",
    patientName: "Maria Raimunda de Souza",
    patientPhone: "(68) 99234-8877",
    patientCpf: "123.456.789-00",
    date: "18/11/2026",
    time: "08:30",
    modality: "USF Luana Freitas (SUS)",
    reason: "Acompanhamento de Hipertensão e Diabetes",
    status: "Confirmada",
    notes: "Paciente em uso de Losartana 50mg e Metformina 850mg. Trazer exames recentes de creatinina e microalbuminúria."
  },
  {
    id: "MED-908232",
    patientName: "Sebastião Ferreira da Silva",
    patientPhone: "(68) 99876-1122",
    patientCpf: "234.567.890-11",
    date: "18/11/2026",
    time: "09:15",
    modality: "USF Luana Freitas (SUS)",
    reason: "Avaliação de Exames Laboratoriais",
    status: "Pendente",
    notes: "Colheu hemograma completo e perfil lipídico na semana passada."
  },
  {
    id: "MED-908233",
    patientName: "Francisca das Chagas Lima",
    patientPhone: "(68) 98412-3344",
    patientCpf: "345.678.901-22",
    date: "18/11/2026",
    time: "10:00",
    modality: "Consultório Clínico / Check-up",
    reason: "Saúde da Mulher / Preventivo Ginecológico",
    status: "Confirmada",
    notes: "Coleta de preventivo (Papanicolau) de rotina e solicitação de mamografia bilateral."
  },
  {
    id: "MED-908234",
    patientName: "Antônio Carlos Albuquerque",
    patientPhone: "(68) 99112-9988",
    patientCpf: "456.789.012-33",
    date: "19/11/2026",
    time: "14:00",
    modality: "Telemedicina",
    reason: "Acolhimento em Saúde Mental / Ansiedade",
    status: "Confirmada",
    notes: "Quadro de insônia e ansiedade generalizada após sobrecarga de trabalho. Reavaliação clínica."
  },
  {
    id: "MED-908235",
    patientName: "Raimundo Nonato Pereira",
    patientPhone: "(68) 99901-4455",
    patientCpf: "567.890.123-44",
    date: "19/11/2026",
    time: "15:30",
    modality: "Visita Domiciliar",
    reason: "Acompanhamento do Idoso Acamado",
    status: "Confirmada",
    notes: "Sequela de AVC, paciente acamado em cuidados pela família na área da USF Luana Freitas."
  }
];

let appointmentsList = [];
let medicalRecords = [];

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

function initAdminDashboard() {
  loadData();
  initTabNavigation();
  renderAppointmentsTable(appointmentsList);
  updateKpis();
  initSoapCalculators();
}

function loadData() {
  const storedAppts = localStorage.getItem('dra_ivana_appointments');
  if (storedAppts) {
    try {
      appointmentsList = JSON.parse(storedAppts);
    } catch(e) {
      appointmentsList = [...DEFAULT_APPOINTMENTS];
    }
  } else {
    appointmentsList = [...DEFAULT_APPOINTMENTS];
    saveData();
  }

  const storedRecords = localStorage.getItem('dra_ivana_records');
  if (storedRecords) {
    try {
      medicalRecords = JSON.parse(storedRecords);
    } catch(e) {
      medicalRecords = [];
    }
  }
}

function saveData() {
  localStorage.setItem('dra_ivana_appointments', JSON.stringify(appointmentsList));
  localStorage.setItem('dra_ivana_records', JSON.stringify(medicalRecords));
}

/* ==========================================================================
   NAVEGAÇÃO POR ABAS DO PAINEL
   ========================================================================== */
function initTabNavigation() {
  const navBtns = document.querySelectorAll('.admin-nav-item button');
  const tabs = document.querySelectorAll('.admin-view-tab');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      navBtns.forEach(b => b.parentElement.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));

      btn.parentElement.classList.add('active');
      const activeTab = document.getElementById(target);
      if (activeTab) activeTab.classList.add('active');

      if (target === 'tab-agenda') renderAppointmentsTable(appointmentsList);
      if (target === 'tab-prontuarios') renderMedicalRecordsList();
    });
  });
}

window.switchAdminTab = function(tabId) {
  const targetBtn = document.querySelector(`.admin-nav-item button[data-tab="${tabId}"]`);
  if (targetBtn) targetBtn.click();
};

/* ==========================================================================
   MÉTRICAS / KPIS
   ========================================================================== */
function updateKpis() {
  const total = appointmentsList.length;
  const confirmed = appointmentsList.filter(a => a.status === 'Confirmada').length;
  const pending = appointmentsList.filter(a => a.status === 'Pendente').length;
  const usfCount = appointmentsList.filter(a => a.modality.includes('USF')).length;

  const elTotal = document.getElementById('kpiTotalAppts');
  const elConfirmed = document.getElementById('kpiConfirmedAppts');
  const elPending = document.getElementById('kpiPendingAppts');
  const elUsf = document.getElementById('kpiUsfAppts');

  if (elTotal) elTotal.textContent = total;
  if (elConfirmed) elConfirmed.textContent = confirmed;
  if (elPending) elPending.textContent = pending;
  if (elUsf) elUsf.textContent = usfCount;

  // Atualiza badge de pendentes na sidebar
  const badge = document.getElementById('navPendingBadge');
  if (badge) {
    badge.textContent = pending;
    badge.style.display = pending > 0 ? 'inline-block' : 'none';
  }
}

/* ==========================================================================
   RENDERIZAÇÃO DA TABELA DE CONSULTAS
   ========================================================================== */
function renderAppointmentsTable(list) {
  const tbody = document.getElementById('appointmentsTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--admin-text-muted);">
          Nenhuma consulta encontrada com os filtros selecionados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(item => `
    <tr>
      <td><strong>${item.id}</strong></td>
      <td>
        <div style="font-weight: 800; color: var(--admin-text-main);">${item.patientName}</div>
        <div style="font-size: 0.8rem; color: var(--admin-text-muted);">CPF: ${item.patientCpf || 'Não informado'}</div>
      </td>
      <td>
        <div><strong>${item.date}</strong> às <strong>${item.time}</strong></div>
        <div style="font-size: 0.8rem; color: var(--admin-text-muted);">${item.modality}</div>
      </td>
      <td>
        <span style="font-size: 0.85rem; font-weight: 600;">${item.reason}</span>
      </td>
      <td>
        <span class="badge-status status-${item.status.toLowerCase()}">
          ${item.status}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <button class="btn btn-sm btn-primary" onclick="openSoapModal('${item.id}')" title="Abrir Prontuário Eletrônico">
            🩺 Atender (SOAP)
          </button>
          <button class="btn btn-sm btn-whatsapp" onclick="sendWhatsAppConfirmation('${item.id}')" title="Confirmar via WhatsApp">
            📱 WhatsApp
          </button>
          <button class="btn btn-sm btn-outline" onclick="toggleAppointmentStatus('${item.id}')" title="Alternar Status">
            ✓ Status
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ==========================================================================
   FILTROS DA AGENDA
   ========================================================================== */
window.filterAppointments = function() {
  const query = document.getElementById('searchPatientInput')?.value.toLowerCase().trim() || '';
  const status = document.getElementById('filterStatusSelect')?.value || 'todos';

  const filtered = appointmentsList.filter(item => {
    const matchesQuery = item.patientName.toLowerCase().includes(query) ||
                         item.patientCpf.includes(query) ||
                         item.id.toLowerCase().includes(query);
    const matchesStatus = (status === 'todos') || (item.status === status);
    return matchesQuery && matchesStatus;
  });

  renderAppointmentsTable(filtered);
};

window.toggleAppointmentStatus = function(id) {
  const appt = appointmentsList.find(a => a.id === id);
  if (!appt) return;

  const cycle = {
    'Pendente': 'Confirmada',
    'Confirmada': 'Concluída',
    'Concluída': 'Pendente'
  };

  appt.status = cycle[appt.status] || 'Confirmada';
  saveData();
  updateKpis();
  filterAppointments();
  showToast(`Status da consulta ${id} atualizado para ${appt.status}!`, 'info');
};

window.sendWhatsAppConfirmation = function(id) {
  const appt = appointmentsList.find(a => a.id === id);
  if (!appt) return;

  const phoneClean = appt.patientPhone.replace(/\D/g, '');
  const msg = encodeURIComponent(
    `Olá ${appt.patientName}! Aqui é do consultório da Dra. Ivana Caroline Silva Bergamin (CRM/AC 3484).\n` +
    `Confirmamos sua consulta agendada para ${appt.date} às ${appt.time} (${appt.modality}).\n` +
    `Por favor, traga seus exames recentes e documento oficial com foto. Qualquer dúvida estamos à disposição!`
  );

  window.open(`https://api.whatsapp.com/send?phone=55${phoneClean}&text=${msg}`, '_blank');
};

/* ==========================================================================
   PRONTUÁRIO CLÍNICO ELETRÔNICO (MÉTODO SOAP)
   ========================================================================== */
let activeConsultationAppt = null;

window.openSoapModal = function(id) {
  const appt = appointmentsList.find(a => a.id === id);
  if (!appt) return;

  activeConsultationAppt = appt;
  document.getElementById('soapPatientName').textContent = appt.patientName;
  document.getElementById('soapPatientMeta').textContent = `CPF: ${appt.patientCpf} • Consulta: ${appt.date} às ${appt.time} • Modalidade: ${appt.modality}`;
  
  // Limpa campos
  document.getElementById('soapSubjetivo').value = `Paciente refere queixa de ${appt.reason}. Relata evolução de...`;
  document.getElementById('soapPa').value = "120/80";
  document.getElementById('soapFc').value = "74";
  document.getElementById('soapGlicose').value = "92";
  document.getElementById('soapPeso').value = "70";
  document.getElementById('soapAltura').value = "165";
  document.getElementById('soapImc').textContent = "25.7 kg/m²";
  document.getElementById('soapAvaliacao').value = "K86 - Hipertensão Arterial Sistêmica não complicada / Check-up de rotina (CIAP-2)";
  document.getElementById('soapPlano').value = 
    "1. Manter medicação habitual.\n" +
    "2. Solicitação de exames laboratoriais complementares: Hemograma Completo, Glicemia de Jejum, Creatinina sérica, EAS.\n" +
    "3. Orientações higienodietéticas e estímulo à prática de atividade física regular.\n" +
    "4. Retorno em 90 dias com os resultados dos exames.";

  const modal = document.getElementById('soapModal');
  if (modal) modal.classList.add('open');
};

window.closeSoapModal = function() {
  const modal = document.getElementById('soapModal');
  if (modal) modal.classList.remove('open');
};

function initSoapCalculators() {
  const pesoInput = document.getElementById('soapPeso');
  const alturaInput = document.getElementById('soapAltura');
  const imcDisplay = document.getElementById('soapImc');

  function updateImc() {
    const p = parseFloat(pesoInput?.value);
    const a = parseFloat(alturaInput?.value) / 100;
    if (p > 0 && a > 0 && imcDisplay) {
      const imc = (p / (a * a)).toFixed(1);
      imcDisplay.textContent = `${imc} kg/m²`;
    }
  }

  pesoInput?.addEventListener('input', updateImc);
  alturaInput?.addEventListener('input', updateImc);
}

window.saveSoapRecord = function() {
  if (!activeConsultationAppt) return;

  const record = {
    id: "REC-" + Date.now(),
    apptId: activeConsultationAppt.id,
    patientName: activeConsultationAppt.patientName,
    date: new Date().toLocaleDateString('pt-BR'),
    subjetivo: document.getElementById('soapSubjetivo').value,
    pa: document.getElementById('soapPa').value,
    fc: document.getElementById('soapFc').value,
    glicose: document.getElementById('soapGlicose').value,
    peso: document.getElementById('soapPeso').value,
    altura: document.getElementById('soapAltura').value,
    avaliacao: document.getElementById('soapAvaliacao').value,
    plano: document.getElementById('soapPlano').value
  };

  medicalRecords.unshift(record);
  activeConsultationAppt.status = 'Concluída';
  saveData();
  updateKpis();
  filterAppointments();
  closeSoapModal();
  showToast('Prontuário SOAP salvo com sucesso no histórico da paciente!', 'success');
};

/* ==========================================================================
   HISTÓRICO DE PRONTUÁRIOS
   ========================================================================== */
function renderMedicalRecordsList() {
  const container = document.getElementById('recordsListContainer');
  if (!container) return;

  if (medicalRecords.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--admin-text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nenhum prontuário registrado ainda.</p>
        <p style="font-size: 0.9rem;">Ao atender uma consulta na Agenda através do botão <strong>"Atender (SOAP)"</strong>, o registro clínico será arquivado aqui com segurança.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = medicalRecords.map(rec => `
    <div class="card" style="margin-bottom: 1.5rem; padding: 1.75rem; border-left: 4px solid var(--admin-accent);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--admin-text-main); margin: 0;">${rec.patientName}</h4>
          <span style="font-size: 0.8rem; color: var(--admin-text-muted);">Atendimento em ${rec.date} • ID: ${rec.id}</span>
        </div>
        <button class="btn btn-sm btn-outline" onclick="printPrescription('${rec.id}')">
          🖨️ Emitir Receituário Timbrado
        </button>
      </div>

      <div class="soap-container">
        <div class="soap-box">
          <div class="soap-title soap-s"><span>S</span> Subjetivo (História & Sintomas)</div>
          <p style="font-size: 0.885rem; color: var(--admin-text-main); margin: 0; line-height: 1.5;">${rec.subjetivo}</p>
        </div>

        <div class="soap-box">
          <div class="soap-title soap-o"><span>O</span> Objetivo (Dados Vitais & Exame Físico)</div>
          <p style="font-size: 0.885rem; color: var(--admin-text-main); margin: 0; line-height: 1.5;">
            PA: <strong>${rec.pa} mmHg</strong> • FC: <strong>${rec.fc} bpm</strong> • Glicemia: <strong>${rec.glicose} mg/dL</strong> • Peso: <strong>${rec.peso} kg</strong> • Altura: <strong>${rec.altura} cm</strong>
          </p>
        </div>

        <div class="soap-box">
          <div class="soap-title soap-a"><span>A</span> Avaliação / Diagnóstico (CIAP-2 / CID-10)</div>
          <p style="font-size: 0.885rem; color: var(--admin-text-main); margin: 0; line-height: 1.5;">${rec.avaliacao}</p>
        </div>

        <div class="soap-box">
          <div class="soap-title soap-p"><span>P</span> Plano Terapêutico & Prescrição</div>
          <p style="font-size: 0.885rem; color: var(--admin-text-main); margin: 0; white-space: pre-line; line-height: 1.5;">${rec.plano}</p>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   EMISSÃO DE RECEITUÁRIO MÉDICO TIMBRADO OFICIAL
   ========================================================================== */
window.printPrescription = function(recordId) {
  const rec = medicalRecords.find(r => r.id === recordId);
  const patient = rec ? rec.patientName : "Paciente";
  const plan = rec ? rec.plano : document.getElementById('soapPlano')?.value || "Uso contínuo conforme orientação clínica.";

  const printArea = document.getElementById('printArea');
  if (!printArea) return;

  printArea.innerHTML = `
    <div class="printable-prescription" style="font-family: 'Times New Roman', serif; max-width: 750px; margin: 0 auto; color: #000; line-height: 1.6;">
      <!-- Cabeçalho Timbrado Oficial -->
      <div style="border-bottom: 2px solid #0284c7; padding-bottom: 1rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="font-size: 1.5rem; margin: 0; font-weight: bold; color: #0369a1;">DRA. IVANA CAROLINE SILVA BERGAMIN</h2>
          <p style="margin: 0.2rem 0; font-size: 1rem; font-weight: bold;">MÉDICA • CRM/AC 3484</p>
          <p style="margin: 0; font-size: 0.85rem; color: #475569;">Medicina de Família e Comunidade (COREME/FUNDHACRE) • Bacharel em Biomedicina</p>
        </div>
        <div style="text-align: right; font-size: 0.8rem; color: #64748b;">
          <div>Rio Branco – Acre</div>
          <div>USF Luana Freitas • CNES 7565534</div>
        </div>
      </div>

      <!-- Identificação do Paciente -->
      <div style="margin-bottom: 2rem; background: #f8fafc; padding: 1rem; border-radius: 6px; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 1.1rem;"><strong>PACIENTE:</strong> ${patient.toUpperCase()}</p>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; color: #475569;">Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <!-- Prescrição / Orientações -->
      <div style="min-height: 380px; margin-bottom: 3rem;">
        <h3 style="font-size: 1.15rem; text-decoration: underline; margin-bottom: 1.25rem;">PRESCRIÇÃO MÉDICA / CONDUTA CLÍNICA</h3>
        <div style="font-size: 1.05rem; white-space: pre-line; line-height: 1.8;">
          ${plan}
        </div>
      </div>

      <!-- Assinatura Médica Oficial -->
      <div style="border-top: 1px solid #000; width: 320px; margin: 3rem auto 1rem auto; text-align: center; padding-top: 0.5rem;">
        <p style="margin: 0; font-weight: bold; font-size: 1rem;">Dra. Ivana Caroline Silva Bergamin</p>
        <p style="margin: 0; font-size: 0.85rem;">Médica • CRM/AC 3484</p>
        <p style="margin: 0; font-size: 0.75rem; color: #64748b;">Assinatura Digital / Carimbo Profissional</p>
      </div>

      <!-- Rodapé Regulatório CFM -->
      <div style="font-size: 0.75rem; color: #64748b; text-align: center; margin-top: 2rem; border-top: 1px dashed #cbd5e1; padding-top: 0.5rem;">
        Documento médico emitido em conformidade com a Resolução CFM nº 2.336/2023 e as Boas Práticas da Atenção Primária à Saúde.
      </div>
    </div>
  `;

  window.print();
};
