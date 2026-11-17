/**
 * Dra. Ivana Caroline Silva Bergamin - Guia Interativo de Preparo para Exames Laboratoriais
 * Unindo a visão médica clínica ao conhecimento especializado em Biomedicina Laboratorial
 */

const examGuides = [
  {
    id: "hemograma",
    title: "Hemograma Completo 🩸",
    category: "Hematologia",
    fasting: "Recomenda-se jejum de 3 a 4 horas (pode beber água)",
    instructions: "Evite esforço físico vigoroso e ingestão de bebidas alcoólicas nas 24 horas que antecedem a coleta. Água pura em quantidade moderada não quebra o jejum e facilita a punção venosa.",
    clinicalTip: "Dica da Dra. Ivana: Estar bem hidratado evita a hemoconcentração e torna o exame mais confortável."
  },
  {
    id: "glicemia",
    title: "Glicemia de Jejum & Hemoglobina Glicada 🍯",
    category: "Bioquímica & Diabetes",
    fasting: "Jejum obrigatório de 8 horas (máximo 12 horas)",
    instructions: "Não exceda 14 horas de jejum, pois o jejum prolongado causa hipoglicemia reativa e elevação de corpos cetônicos. Mantenha a dieta habitual nos dias anteriores.",
    clinicalTip: "A Hemoglobina Glicada (HbA1c) reflete a média dos últimos 90 dias e não depende estritamente de jejum agudo, mas costuma ser colhida em conjunto."
  },
  {
    id: "lipidico",
    title: "Perfil Lipídico (Colesterol & Triglicerídeos) 🥑",
    category: "Cardiologia & Metabolismo",
    fasting: "Jejum flexível (conforme indicação clínica, usualmente sem jejum prolongado)",
    instructions: "Conforme o Consenso Brasileiro para a Normatização da Determinação do Perfil Lipídico, o jejum de 12 horas não é mais obrigatório para a maioria dos pacientes, exceto quando há níveis muito elevados de triglicerídeos (>440 mg/dL).",
    clinicalTip: "Evite refeições com excesso de gordura e álcool na véspera da coleta para evitar laudos com lipemia sérica."
  },
  {
    id: "urina",
    title: "EAS (Urina Tipo I) & Urocultura 🧪",
    category: "Uroanálise & Microbiologia",
    fasting: "Não requer jejum alimentar",
    instructions: "Higienize rigorosamente a região íntima com água e sabonete neutro antes da coleta. Despreze o primeiro jato no vaso sanitário e colete o jato médio diretamente no frasco estéril fornecido pelo laboratório.",
    clinicalTip: "Dica Biomédica: A entrega ao laboratório deve ocorrer preferencialmente dentro de 1 a 2 horas após a coleta, para evitar proliferação bacteriana artefatual."
  },
  {
    id: "papanicolau",
    title: "Exame Preventivo Ginecológico (Papanicolau / Citopatologia) 🌸",
    category: "Saúde da Mulher",
    fasting: "Não requer jejum alimentar",
    instructions: "Nas 48 horas anteriores à coleta: não ter relações sexuais (mesmo com preservativo), não usar duchas vaginais e não aplicar pomadas, óvulos ou cremes ginecológicos. Não estar menstruada (aguardar 5 dias após o término do fluxo).",
    clinicalTip: "Dra. Ivana destaca: O preventivo é indolor, rápido e a ferramenta mais eficaz para prevenção do câncer de colo uterino na Atenção Primária."
  },
  {
    id: "renal",
    title: "Creatinina e Ureia (Avaliação da Função Renal) 🧬",
    category: "Bioquímica & Nefrologia",
    fasting: "Jejum leve de 3 a 4 horas",
    instructions: "Evite a prática de exercícios extenuantes (como musculação pesada ou maratonas) nas 24 horas anteriores, pois a quebra muscular (rabdomiólise leve) pode elevar transitoriamente os níveis de creatinina.",
    clinicalTip: "Com experiência em suporte no Hospital do Rim e Atenção Básica, a Dra. Ivana correlaciona a creatinina à Taxa de Filtração Glomerular (eGFR) para avaliação personalizada."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initExamsGuide();
});

function initExamsGuide() {
  const container = document.getElementById('examsGuideContainer');
  if (!container) return;

  container.innerHTML = examGuides.map(item => `
    <div class="card card-hover" style="margin-bottom: 1rem; padding: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
        <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin: 0;">
          ${item.title}
        </h4>
        <span style="font-size: 0.75rem; font-weight: 700; background-color: var(--primary-100); color: var(--primary-800); padding: 0.2rem 0.6rem; border-radius: var(--radius-full);">
          ${item.category}
        </span>
      </div>

      <div style="margin-bottom: 0.75rem; font-size: 0.9rem; color: var(--primary-600); font-weight: 700;">
        ⏱️ ${item.fasting}
      </div>

      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 0.75rem;">
        ${item.instructions}
      </p>

      <div style="background-color: var(--bg-surface-subtle); border-left: 3px solid var(--teal-600); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.85rem; color: var(--text-main);">
        <strong>💡 Olhar Integrado:</strong> ${item.clinicalTip}
      </div>
    </div>
  `).join('');
}
