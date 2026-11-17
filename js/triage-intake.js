/**
 * Dra. Ivana Caroline Silva Bergamin - Portal de Pré-Consulta e Triagem Clínica
 * Formulário inteligente de anamnese prévia e estratificação de risco para a Atenção Primária
 */

document.addEventListener('DOMContentLoaded', () => {
  initTriageForm();
});

function initTriageForm() {
  const form = document.getElementById('clinicalIntakeForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    processTriageIntake();
  });
}

function processTriageIntake() {
  const name = document.getElementById('intakeName')?.value.trim();
  const age = document.getElementById('intakeAge')?.value.trim();
  const chiefComplaint = document.getElementById('intakeComplaint')?.value.trim();
  const medications = document.getElementById('intakeMeds')?.value.trim() || 'Nenhum medicamento contínuo relatado';
  const allergies = document.getElementById('intakeAllergies')?.value.trim() || 'Sem alergias conhecidas';

  // Sinais de alerta (Red flags)
  const hasChestPain = document.getElementById('rfChestPain')?.checked;
  const hasShortnessBreath = document.getElementById('rfShortnessBreath')?.checked;
  const hasFainting = document.getElementById('rfFainting')?.checked;

  const resultContainer = document.getElementById('intakeResultArea');
  if (!resultContainer) return;

  if (hasChestPain || hasShortnessBreath || hasFainting) {
    resultContainer.innerHTML = `
      <div style="background-color: var(--danger-bg); border: 2px solid var(--danger); border-radius: var(--radius-lg); padding: 1.75rem; text-align: left; margin-top: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
          <span style="font-size: 1.75rem;">🚨</span>
          <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--danger); margin: 0;">Atenção: Sinais de Urgência Identificados</h4>
        </div>
        <p style="color: var(--text-main); font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.5;">
          Você assinalou sintomas que podem exigir intervenção médica imediata (dor torácica aguda, falta de ar intensa ou desmaio). 
          <strong>Não aguarde uma consulta eletiva ou ambulatorial.</strong>
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
          <a href="tel:192" class="btn btn-primary" style="background-color: var(--danger); border-color: var(--danger);">
            📞 Ligar para o SAMU (192)
          </a>
          <span style="font-size: 0.85rem; color: var(--text-muted); align-self: center;">
            Ou procure imediatamente a UPA ou Pronto-Socorro de Rio Branco mais próximo.
          </span>
        </div>
      </div>
    `;
    resultContainer.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // Triagem ambulatorial normal
  const intakeId = 'TRI-' + Math.floor(1000 + Math.random() * 9000);
  resultContainer.innerHTML = `
    <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--primary-300); border-radius: var(--radius-lg); padding: 2rem; text-align: left; margin-top: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
        <div>
          <span style="font-size: 0.8rem; font-weight: 800; color: var(--primary-600); text-transform: uppercase;">Prontuário de Pré-Consulta</span>
          <h4 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0;">Ficha de Acolhimento Clínico</h4>
        </div>
        <span style="font-size: 0.9rem; font-weight: 700; background: var(--primary-100); color: var(--primary-800); padding: 0.25rem 0.65rem; border-radius: var(--radius-full);">
          ID: ${intakeId}
        </span>
      </div>

      <div class="grid grid-2" style="margin-bottom: 1.25rem;">
        <div><strong>Paciente:</strong> ${name} (${age} anos)</div>
        <div><strong>Alergias Relatadas:</strong> ${allergies}</div>
      </div>

      <div style="margin-bottom: 1rem;">
        <strong>Queixa Principal / Histórico de Sintomas:</strong>
        <p style="background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 0.25rem; font-size: 0.9rem;">
          ${chiefComplaint}
        </p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <strong>Medicamentos em Uso Contínuo:</strong>
        <p style="background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 0.25rem; font-size: 0.9rem;">
          ${medications}
        </p>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="window.print()">
          🖨️ Imprimir Resumo para a Consulta
        </button>
        <button class="btn btn-outline" onclick="copyIntakeSummary('${intakeId}', '${encodeURIComponent(name)}', '${encodeURIComponent(chiefComplaint)}')">
          📋 Copiar Texto do Prontuário
        </button>
      </div>
    </div>
  `;
  resultContainer.scrollIntoView({ behavior: 'smooth' });
  showToast('Ficha de pré-consulta gerada com sucesso!', 'success');
}

window.copyIntakeSummary = function(id, name, complaint) {
  const text = `RESUMO PRÉ-CONSULTA (Dra. Ivana Bergamin - CRM/AC 3484)\nID: ${id}\nPaciente: ${decodeURIComponent(name)}\nQueixa Principal: ${decodeURIComponent(complaint)}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Ficha copiada para a área de transferência!', 'success');
  });
};
