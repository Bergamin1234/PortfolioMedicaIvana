/**
 * Dra. Ivana Caroline Silva Bergamin - Sistema Inteligente de Agendamento de Consultas
 * Fluxo Multi-etapas com Seleção de Modalidade, Calendário Dinâmico, Validação e Exportação .ICS
 */

document.addEventListener('DOMContentLoaded', () => {
  initScheduler();
});

const appointmentState = {
  currentStep: 1,
  modality: 'presencial-usf',
  modalityName: 'USF Luana Freitas (Estratégia de Saúde da Família)',
  date: '',
  time: '',
  patientName: '',
  patientPhone: '',
  patientCpf: '',
  patientReason: '',
  confirmationCode: ''
};

function initScheduler() {
  const container = document.getElementById('schedulerApp');
  if (!container) return;

  renderStep(1);
}

function renderStep(step) {
  appointmentState.currentStep = step;
  updateStepIndicators(step);

  const contentArea = document.getElementById('schedulerContent');
  if (!contentArea) return;

  if (step === 1) {
    contentArea.innerHTML = `
      <div class="scheduler-step-pane">
        <h3 class="card-title" style="margin-bottom: 0.5rem;">Passo 1: Escolha o Tipo de Atendimento</h3>
        <p class="card-description" style="margin-bottom: 1.5rem;">Selecione a modalidade e o local mais adequado para sua consulta com a Dra. Ivana Bergamin.</p>
        
        <div class="radio-cards-grid">
          <div class="radio-card ${appointmentState.modality === 'presencial-usf' ? 'selected' : ''}" onclick="selectModality('presencial-usf', 'USF Luana Freitas (Estratégia de Saúde da Família - SUS)')">
            <div style="font-size: 1.5rem;">🏥</div>
            <strong style="color: var(--text-main);">USF Luana Freitas</strong>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Atenção Primária, Saúde da Família e Comunidade (SUS). Consultas de rotina, pré-natal e hipertensão/diabetes.</span>
          </div>

          <div class="radio-card ${appointmentState.modality === 'ambulatorial' ? 'selected' : ''}" onclick="selectModality('ambulatorial', 'Atendimento Ambulatorial / Clínico Especializado')">
            <div style="font-size: 1.5rem;">🩺</div>
            <strong style="color: var(--text-main);">Clínica Geral & Check-up</strong>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Avaliação clínica integral, solicitação e interpretação detalhada de exames e saúde preventiva.</span>
          </div>

          <div class="radio-card ${appointmentState.modality === 'telemedicina' ? 'selected' : ''}" onclick="selectModality('telemedicina', 'Teleconsulta Médica (Atendimento Remoto)')">
            <div style="font-size: 1.5rem;">💻</div>
            <strong style="color: var(--text-main);">Teleconsulta</strong>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Atendimento à distância com prescrição digital e atestados válidos nacionalmente.</span>
          </div>

          <div class="radio-card ${appointmentState.modality === 'domiciliar' ? 'selected' : ''}" onclick="selectModality('domiciliar', 'Visita Domiciliar / Atenção à Saúde do Idoso')">
            <div style="font-size: 1.5rem;">🏡</div>
            <strong style="color: var(--text-main);">Visita Domiciliar</strong>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Cuidado no domicílio para pacientes acamados, idosos com limitação motora ou puerpério.</span>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 2rem;">
          <button class="btn btn-primary" onclick="goToStep(2)">
            Avançar para Data e Horário →
          </button>
        </div>
      </div>
    `;
  } else if (step === 2) {
    const dates = generateAvailableDates();
    contentArea.innerHTML = `
      <div class="scheduler-step-pane">
        <h3 class="card-title" style="margin-bottom: 0.5rem;">Passo 2: Selecione a Data e o Horário</h3>
        <p class="card-description" style="margin-bottom: 1.5rem;">Modalidade selecionada: <strong style="color: var(--primary-600);">${appointmentState.modalityName}</strong></p>

        <div class="grid grid-2" style="margin-bottom: 2rem;">
          <div class="form-group">
            <label class="form-label">Data Disponível</label>
            <select class="form-select" id="datePickerSelect" onchange="onDateSelected(this.value)">
              <option value="">-- Escolha um dia --</option>
              ${dates.map(d => `<option value="${d.iso}" ${appointmentState.date === d.iso ? 'selected' : ''}>${d.formatted}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Horário de Atendimento</label>
            <div id="timeSlotsContainer" style="display: flex; flex-wrap: wrap; gap: 0.5rem; min-height: 48px; align-items: center;">
              <span style="color: var(--text-muted); font-size: 0.85rem;">Selecione primeiro uma data acima.</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
          <button class="btn btn-outline" onclick="goToStep(1)">
            ← Voltar
          </button>
          <button class="btn btn-primary" id="btnStep2Next" onclick="validateStep2()">
            Avançar para Seus Dados →
          </button>
        </div>
      </div>
    `;

    if (appointmentState.date) {
      onDateSelected(appointmentState.date);
    }
  } else if (step === 3) {
    contentArea.innerHTML = `
      <div class="scheduler-step-pane">
        <h3 class="card-title" style="margin-bottom: 0.5rem;">Passo 3: Seus Dados e Motivo da Consulta</h3>
        <p class="card-description" style="margin-bottom: 1.5rem;">Informe seus dados para a abertura do prontuário e confirmação rápida da consulta.</p>

        <form id="patientDataForm" onsubmit="event.preventDefault(); validateStep3();">
          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label" for="ptName">Nome Completo *</label>
              <input type="text" class="form-input" id="ptName" required placeholder="Ex: Maria das Graças Silva" value="${appointmentState.patientName}">
            </div>

            <div class="form-group">
              <label class="form-label" for="ptPhone">WhatsApp / Telefone com DDD *</label>
              <input type="tel" class="form-input" id="ptPhone" required placeholder="Ex: (68) 99999-9999" value="${appointmentState.patientPhone}">
            </div>

            <div class="form-group">
              <label class="form-label" for="ptCpf">CPF do Paciente *</label>
              <input type="text" class="form-input" id="ptCpf" required placeholder="000.000.000-00" value="${appointmentState.patientCpf}">
            </div>

            <div class="form-group">
              <label class="form-label" for="ptReason">Motivo Principal / Sintomas</label>
              <select class="form-select" id="ptReason">
                <option value="Consulta de Rotina / Check-up Geral">Consulta de Rotina / Check-up Geral</option>
                <option value="Acompanhamento de Hipertensão ou Diabetes">Acompanhamento de Hipertensão ou Diabetes</option>
                <option value="Saúde da Mulher / Preventivo Ginecológico">Saúde da Mulher / Preventivo Ginecológico</option>
                <option value="Avaliação de Exames Laboratoriais">Avaliação de Exames Laboratoriais</option>
                <option value="Sintomas Infecciosos ou Dor Aguda">Sintomas Infecciosos ou Dor Aguda</option>
                <option value="Acolhimento em Saúde Mental / Ansiedade">Acolhimento em Saúde Mental / Ansiedade</option>
                <option value="Renovação de Receitas de Uso Contínuo">Renovação de Receitas de Uso Contínuo</option>
                <option value="Outro Motivo Específico">Outro Motivo Específico</option>
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
            <button type="button" class="btn btn-outline" onclick="goToStep(2)">
              ← Voltar
            </button>
            <button type="submit" class="btn btn-primary">
              Confirmar Agendamento ✓
            </button>
          </div>
        </form>
      </div>
    `;
  } else if (step === 4) {
    // Tela de confirmação e sucesso
    appointmentState.confirmationCode = 'MED-' + Math.floor(100000 + Math.random() * 900000);
    const whatsappText = encodeURIComponent(
      `Olá, gostaria de confirmar o agendamento de consulta com a Dra. Ivana Bergamin:\n` +
      `Código: ${appointmentState.confirmationCode}\n` +
      `Paciente: ${appointmentState.patientName}\n` +
      `Modalidade: ${appointmentState.modalityName}\n` +
      `Data: ${appointmentState.date}\n` +
      `Horário: ${appointmentState.time}\n` +
      `Motivo: ${appointmentState.patientReason}`
    );

    contentArea.innerHTML = `
      <div class="scheduler-step-pane" style="text-align: center; padding: 1.5rem 0;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background-color: var(--success-bg); color: var(--success); font-size: 2.5rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
          ✓
        </div>
        
        <h3 class="card-title" style="font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--text-main);">
          Pré-Agendamento Concluído com Sucesso!
        </h3>
        <p class="card-description" style="max-width: 580px; margin: 0 auto 1.75rem auto;">
          Seus dados foram registrados com segurança no sistema da Dra. Ivana Caroline Silva Bergamin.
        </p>

        <div style="background-color: var(--bg-surface-subtle); border: 1px dashed var(--primary-400); border-radius: var(--radius-lg); padding: 1.5rem; max-width: 540px; margin: 0 auto 2rem auto; text-align: left;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">CÓDIGO DA CONSULTA</span>
            <span style="font-size: 1.1rem; font-weight: 800; color: var(--primary-600);">${appointmentState.confirmationCode}</span>
          </div>
          <p style="margin-bottom: 0.4rem; font-size: 0.95rem;"><strong>Paciente:</strong> ${appointmentState.patientName}</p>
          <p style="margin-bottom: 0.4rem; font-size: 0.95rem;"><strong>Modalidade:</strong> ${appointmentState.modalityName}</p>
          <p style="margin-bottom: 0.4rem; font-size: 0.95rem;"><strong>Data & Hora:</strong> ${appointmentState.date} às ${appointmentState.time}</p>
          <p style="font-size: 0.95rem;"><strong>Motivo:</strong> ${appointmentState.patientReason}</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;">
          <a href="https://api.whatsapp.com/send?phone=5568999999999&text=${whatsappText}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
            📱 Confirmar via WhatsApp da Equipe
          </a>
          <button class="btn btn-outline btn-lg" onclick="downloadIcsFile()">
            📅 Adicionar ao Google / Apple Calendar (.ics)
          </button>
          <button class="btn btn-secondary btn-lg" onclick="resetScheduler()">
            🔄 Fazer Novo Agendamento
          </button>
        </div>
      </div>
    `;
  }
}

function updateStepIndicators(activeStep) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`wizStep${i}`);
    if (!el) continue;
    el.classList.remove('active', 'completed');
    if (i === activeStep) {
      el.classList.add('active');
    } else if (i < activeStep) {
      el.classList.add('completed');
    }
  }
}

window.selectModality = function(type, name) {
  appointmentState.modality = type;
  appointmentState.modalityName = name;
  document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
};

window.goToStep = function(step) {
  renderStep(step);
};

window.onDateSelected = function(dateIso) {
  appointmentState.date = dateIso;
  const container = document.getElementById('timeSlotsContainer');
  if (!container) return;

  if (!dateIso) {
    container.innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem;">Selecione primeiro uma data acima.</span>';
    return;
  }

  const slots = ['08:00', '08:45', '09:30', '10:15', '11:00', '14:00', '14:45', '15:30', '16:15', '17:00'];
  container.innerHTML = slots.map(time => `
    <button type="button" class="btn btn-sm ${appointmentState.time === time ? 'btn-primary' : 'btn-outline'}" onclick="selectTimeSlot('${time}')">
      ${time}
    </button>
  `).join('');
};

window.selectTimeSlot = function(time) {
  appointmentState.time = time;
  onDateSelected(appointmentState.date);
};

window.validateStep2 = function() {
  if (!appointmentState.date) {
    showToast('Por favor, selecione uma data para o atendimento.', 'warning');
    return;
  }
  if (!appointmentState.time) {
    showToast('Por favor, escolha um dos horários disponíveis.', 'warning');
    return;
  }
  goToStep(3);
};

window.validateStep3 = function() {
  const name = document.getElementById('ptName')?.value.trim();
  const phone = document.getElementById('ptPhone')?.value.trim();
  const cpf = document.getElementById('ptCpf')?.value.trim();
  const reason = document.getElementById('ptReason')?.value;

  if (!name || name.length < 3) {
    showToast('Por favor, informe seu nome completo.', 'warning');
    return;
  }
  if (!phone || phone.length < 8) {
    showToast('Por favor, informe um número de telefone/WhatsApp válido.', 'warning');
    return;
  }

  appointmentState.patientName = name;
  appointmentState.patientPhone = phone;
  appointmentState.patientCpf = cpf;
  appointmentState.patientReason = reason || 'Consulta Geral';

  goToStep(4);
};

window.resetScheduler = function() {
  appointmentState.currentStep = 1;
  appointmentState.date = '';
  appointmentState.time = '';
  renderStep(1);
};

function generateAvailableDates() {
  const list = [];
  const today = new Date();
  let count = 0;
  let dayOffset = 1;

  while (count < 10) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + dayOffset);
    dayOffset++;

    const dayOfWeek = nextDate.getDay();
    // Dias úteis: Segunda (1) a Sexta (5)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dayStr = String(nextDate.getDate()).padStart(2, '0');
      const monthStr = String(nextDate.getMonth() + 1).padStart(2, '0');
      const yearStr = nextDate.getFullYear();
      const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

      list.push({
        iso: `${dayStr}/${monthStr}/${yearStr}`,
        formatted: `${dayStr}/${monthStr} (${weekDays[dayOfWeek]})`
      });
      count++;
    }
  }
  return list;
}

window.downloadIcsFile = function() {
  const title = `Consulta Médica - Dra. Ivana Bergamin (${appointmentState.confirmationCode})`;
  const description = `Consulta de ${appointmentState.patientReason} com Dra. Ivana Caroline Silva Bergamin (CRM/AC 3484). Modalidade: ${appointmentState.modalityName}. Paciente: ${appointmentState.patientName}.`;
  const location = appointmentState.modalityName;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dra. Ivana Bergamin//Sistema de Agendamento Medico//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `consulta-dra-ivana-${appointmentState.confirmationCode}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Arquivo de calendário .ICS baixado com sucesso!', 'success');
};
