/**
 * Dra. Ivana Caroline Silva Bergamin - Calculadoras de Saúde e Ferramentas Clínicas
 * Ferramentas interativas com fundamentação em medicina baseada em evidências
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculatorsTabs();
});

function initCalculatorsTabs() {
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const panels = document.querySelectorAll('.calc-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(target);
      if (activePanel) activePanel.classList.add('active');
    });
  });
}

/* ==========================================================================
   1. CALCULADORA DE IMC & RISCO METABÓLICO
   ========================================================================== */
window.calculateIMC = function() {
  const weight = parseFloat(document.getElementById('imcWeight')?.value);
  const heightCm = parseFloat(document.getElementById('imcHeight')?.value);
  const resultBox = document.getElementById('imcResult');

  if (!weight || !heightCm || heightCm <= 0 || weight <= 0) {
    showToast('Informe seu peso (kg) e altura (cm) válidos.', 'warning');
    return;
  }

  const heightM = heightCm / 100;
  const imc = weight / (heightM * heightM);
  let classification = '';
  let color = '';
  let advice = '';

  if (imc < 18.5) {
    classification = 'Abaixo do peso ideal';
    color = 'var(--warning)';
    advice = 'Pode estar associado a deficiências nutricionais. Recomenda-se avaliação alimentar e metabólica.';
  } else if (imc < 25.0) {
    classification = 'Peso saudável (Eutrofia)';
    color = 'var(--success)';
    advice = 'Excelente! Mantenha uma alimentação equilibrada e a prática regular de atividades físicas.';
  } else if (imc < 30.0) {
    classification = 'Sobrepeso (Pré-obesidade)';
    color = 'var(--warning)';
    advice = 'Sinal de alerta para risco cardiovascular. Ajustes no estilo de vida ajudam a prevenir diabetes e hipertensão.';
  } else if (imc < 35.0) {
    classification = 'Obesidade Grau I';
    color = 'var(--danger)';
    advice = 'Acompanhamento médico e nutricional prioritário para controle de fatores de risco cardiovascular.';
  } else if (imc < 40.0) {
    classification = 'Obesidade Grau II';
    color = 'var(--danger)';
    advice = 'Necessária avaliação clínica detalhada com rastreamento de comorbidades metabólicas.';
  } else {
    classification = 'Obesidade Grau III (Grave)';
    color = 'var(--danger)';
    advice = 'Indicação formal de acompanhamento multidisciplinar contínuo na Atenção Primária.';
  }

  // Faixa de peso ideal (IMC 18.5 a 24.9)
  const idealMin = (18.5 * heightM * heightM).toFixed(1);
  const idealMax = (24.9 * heightM * heightM).toFixed(1);

  if (resultBox) {
    resultBox.innerHTML = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Seu Resultado</span>
        <div style="font-size: 2.75rem; font-weight: 900; color: ${color}; line-height: 1.1; margin: 0.25rem 0;">
          ${imc.toFixed(1)} <span style="font-size: 1.1rem; font-weight: 600;">kg/m²</span>
        </div>
        <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
          ${classification}
        </div>
      </div>
      <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 0.75rem; text-align: center;">
        ${advice}
      </p>
      <div style="background-color: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-muted); text-align: center; border: 1px solid var(--border-subtle);">
        Faixa de peso sugerida para sua altura: <strong>${idealMin} kg a ${idealMax} kg</strong>
      </div>
    `;
    resultBox.classList.add('visible');
  }
};

/* ==========================================================================
   2. CALCULADORA GESTACIONAL (REGRA DE NAEGELE & IDADE GESTACIONAL)
   ========================================================================== */
window.calculateGestationalAge = function() {
  const dumVal = document.getElementById('gestDum')?.value;
  const resultBox = document.getElementById('gestResult');

  if (!dumVal) {
    showToast('Informe a data do primeiro dia da última menstruação (DUM).', 'warning');
    return;
  }

  const dumDate = new Date(dumVal + 'T00:00:00');
  const today = new Date();

  if (dumDate > today) {
    showToast('A DUM não pode ser uma data futura.', 'danger');
    return;
  }

  // Idade Gestacional em Dias e Semanas
  const diffTime = today - dumDate;
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;

  // Data Provável do Parto (Regra de Naegele: DUM + 7 dias - 3 meses + 1 ano)
  const dpp = new Date(dumDate);
  dpp.setDate(dpp.getDate() + 7);
  dpp.setMonth(dpp.getMonth() - 3);
  dpp.setFullYear(dpp.getFullYear() + 1);

  const dppFormatted = dpp.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  let trimester = '';
  if (weeks < 14) trimester = '1º Trimestre (Fase embrionária e organogênese)';
  else if (weeks < 28) trimester = '2º Trimestre (Crescimento fetal e ultrassom morfológico)';
  else trimester = '3º Trimestre (Maturação pulmonar e preparação para o parto)';

  if (resultBox) {
    resultBox.innerHTML = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Idade Gestacional Atual</span>
        <div style="font-size: 2.25rem; font-weight: 900; color: var(--primary-600); margin: 0.25rem 0;">
          ${weeks} semanas e ${days} dias
        </div>
        <div style="display: inline-block; padding: 0.25rem 0.75rem; background-color: var(--teal-100); color: var(--teal-800); border-radius: 9999px; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.75rem;">
          ${trimester}
        </div>
      </div>
      <div style="background-color: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: left;">
        <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">
          <strong>Data Provável do Parto (DPP):</strong> <span style="color: var(--primary-600); font-weight: 700;">${dppFormatted}</span> (40 semanas completas)
        </p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          * Cálculo baseado na Regra de Naegele padrão. Em consultas de pré-natal com a Dra. Ivana Bergamin, a idade gestacional é correlacionada com a primeira ultrassonografia precoce.
        </p>
      </div>
    `;
    resultBox.classList.add('visible');
  }
};

/* ==========================================================================
   3. CALCULADORA DE RISCO DE DIABETES (SCORE FINDRISC SIMPLIFICADO)
   ========================================================================== */
window.calculateDiabetesRisk = function() {
  const age = parseInt(document.getElementById('findAge')?.value || 0);
  const bmi = parseInt(document.getElementById('findBmi')?.value || 0);
  const waist = parseInt(document.getElementById('findWaist')?.value || 0);
  const activity = parseInt(document.getElementById('findActivity')?.value || 0);
  const family = parseInt(document.getElementById('findFamily')?.value || 0);
  const resultBox = document.getElementById('findRiskResult');

  const totalScore = age + bmi + waist + activity + family;

  let riskTier = '';
  let color = '';
  let description = '';

  if (totalScore < 7) {
    riskTier = 'Risco Baixo (1 em cada 100 desenvolverá diabetes)';
    color = 'var(--success)';
    description = 'Excelente perfil de proteção metabólica. Continue mantendo hábitos alimentares saudáveis e atividade física.';
  } else if (totalScore <= 11) {
    riskTier = 'Risco Levemente Elevado (1 em cada 25)';
    color = 'var(--primary-600)';
    description = 'Recomenda-se manter rotina de exames preventivos (glicemia de jejum e hemoglobina glicada) periodicamente.';
  } else if (totalScore <= 14) {
    riskTier = 'Risco Moderado (1 em cada 6)';
    color = 'var(--warning)';
    description = 'Atenção especial recomendada: pequenas mudanças na alimentação e perda de 5% a 7% do peso reduzem drasticamente o risco.';
  } else {
    riskTier = 'Risco Alto a Muito Alto (1 em cada 3 ou 1 em 2)';
    color = 'var(--danger)';
    description = 'Forte recomendação de avaliação médica clínica imediata com a Dra. Ivana Bergamin para rastreamento precoce e plano de intervenção.';
  }

  if (resultBox) {
    resultBox.innerHTML = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Pontuação de Risco em 10 Anos</span>
        <div style="font-size: 2.5rem; font-weight: 900; color: ${color}; margin: 0.25rem 0;">
          ${totalScore} pontos
        </div>
        <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
          ${riskTier}
        </div>
      </div>
      <p style="font-size: 0.95rem; color: var(--text-secondary); text-align: center;">
        ${description}
      </p>
    `;
    resultBox.classList.add('visible');
  }
};

/* ==========================================================================
   4. CALCULADORA DE FILTRAÇÃO GLOMERULAR ESTIMADA (eGFR / CKD-EPI)
   ========================================================================== */
window.calculateGFR = function() {
  const creat = parseFloat(document.getElementById('gfrCreat')?.value);
  const age = parseInt(document.getElementById('gfrAge')?.value);
  const sex = document.getElementById('gfrSex')?.value;
  const resultBox = document.getElementById('gfrResult');

  if (!creat || !age || creat <= 0 || age <= 0) {
    showToast('Informe os valores de creatinina sérica e idade.', 'warning');
    return;
  }

  // Equação CKD-EPI simplificada (2021 sem raça)
  const isFemale = sex === 'female';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const factor = isFemale ? 1.012 : 1.0;

  const minVal = Math.min(creat / kappa, 1);
  const maxVal = Math.max(creat / kappa, 1);

  const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.2) * Math.pow(0.9938, age) * factor;

  let stage = '';
  let color = '';

  if (egfr >= 90) {
    stage = 'Estágio 1: Função Renal Normal ou Alta (≥ 90 mL/min/1.73m²)';
    color = 'var(--success)';
  } else if (egfr >= 60) {
    stage = 'Estágio 2: Leve Redução da Função Renal (60 a 89 mL/min/1.73m²)';
    color = 'var(--primary-600)';
  } else if (egfr >= 45) {
    stage = 'Estágio 3a: Redução Leve a Moderada (45 a 59 mL/min/1.73m²)';
    color = 'var(--warning)';
  } else if (egfr >= 30) {
    stage = 'Estágio 3b: Redução Moderada a Grave (30 a 44 mL/min/1.73m²)';
    color = 'var(--danger)';
  } else if (egfr >= 15) {
    stage = 'Estágio 4: Redução Severa (15 a 29 mL/min/1.73m²)';
    color = 'var(--danger)';
  } else {
    stage = 'Estágio 5: Falência Renal (< 15 mL/min/1.73m²)';
    color = 'var(--danger)';
  }

  if (resultBox) {
    resultBox.innerHTML = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Taxa de Filtração Glomerular Estimada</span>
        <div style="font-size: 2.75rem; font-weight: 900; color: ${color}; margin: 0.25rem 0;">
          ${egfr.toFixed(1)} <span style="font-size: 1rem; font-weight: 600;">mL/min/1.73m²</span>
        </div>
        <div style="font-size: 1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
          ${stage}
        </div>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">
        * Resultado calculado pela equação CKD-EPI. Avaliação clínica e urinária integrada (como proteinúria/albuminúria) é essencial para diagnóstico definitivo.
      </p>
    `;
    resultBox.classList.add('visible');
  }
};
