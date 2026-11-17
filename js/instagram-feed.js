/**
 * Dra. Ivana Caroline Silva Bergamin - Feed Educativo do Instagram
 * Perfil Oficial: @ivanaabergamin (Consentimento Concedido)
 * Conteúdo educativo em Atenção Primária, Saúde da Mulher, Medicina Preventiva e Diagnóstico Laboratorial
 */

const instagramPosts = [
  {
    id: "ig-1",
    date: "Há 2 dias",
    title: "O que o seu Hemograma realmente diz? 🩸",
    caption: "Minha formação inicial em Biomedicina me ensinou a amar a hematologia de perto. Mas na prática médica, um exame nunca é apenas um número: é a história clínica do paciente, seus sintomas e seu estilo de vida! Você costuma fazer check-up regular?",
    category: "Diagnóstico & Laboratório",
    likes: 342,
    comments: 28,
    badgeColor: "#0284c7",
    icon: "🔬"
  },
  {
    id: "ig-2",
    date: "Há 5 dias",
    title: "Por que ter uma Médica de Família? 🩺🏡",
    caption: "A Medicina de Família e Comunidade (MFC) acompanha você e sua família em todas as fases da vida. Não cuidamos apenas da doença quando ela surge, mas prevenimos agravos e construímos um vínculo de confiança duradouro.",
    category: "Medicina de Família (MFC)",
    likes: 418,
    comments: 42,
    badgeColor: "#0f766e",
    icon: "🌱"
  },
  {
    id: "ig-3",
    date: "Há 1 semana",
    title: "Saúde da Mulher: Não adie seu Preventivo! 🌸",
    caption: "O rastreamento do câncer do colo do útero e os exames de rotina ginecológica salvam vidas quando feitos no tempo certo. Na USF e no consultório, nosso acolhimento é humanizado e sem tabus. Tire suas dúvidas na consulta!",
    category: "Saúde da Mulher",
    likes: 526,
    comments: 39,
    badgeColor: "#be185d",
    icon: "💗"
  },
  {
    id: "ig-4",
    date: "Há 2 semanas",
    title: "Hipertensão: A vilã silenciosa do dia a dia 🫀",
    caption: "Muitas vezes a pressão alta não dá sintomas aparentes até causar complicações no coração ou nos rins. O controle regular da pressão arterial e o estilo de vida saudável são os maiores aliados da sua longevidade.",
    category: "Prevenção Cardiovascular",
    likes: 289,
    comments: 19,
    badgeColor: "#e11d48",
    icon: "❤️"
  },
  {
    id: "ig-5",
    date: "Há 3 semanas",
    title: "Saúde Mental no Cuidado Primário: Falar é o 1º passo 🧠",
    caption: "Ansiedade, alterações de humor e esgotamento emocional merecem atenção médica qualificada. Cuidar da mente é parte inseparável da saúde integral. Se você precisa de apoio, não hesite em buscar acolhimento.",
    category: "Saúde Mental",
    likes: 384,
    comments: 31,
    badgeColor: "#7c3aed",
    icon: "🌿"
  },
  {
    id: "ig-6",
    date: "Há 1 mês",
    title: "Mitos e Verdades: Preparo para Exames Laboratoriais 🧪",
    caption: "Você sabia que jejum prolongado demais pode alterar resultados de glicose e triglicerídeos? Saber o tempo exato e beber água com moderação faz toda a diferença para um laudo fidedigno!",
    category: "Educação em Saúde",
    likes: 462,
    comments: 45,
    badgeColor: "#d97706",
    icon: "📋"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initInstagramFeed();
});

function initInstagramFeed() {
  const container = document.getElementById('instagramFeedGrid');
  if (!container) return;

  container.innerHTML = instagramPosts.map(post => `
    <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem; border-top: 4px solid ${post.badgeColor};">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.9rem;">
              📸
            </div>
            <div>
              <strong style="font-size: 0.85rem; color: var(--text-main); display: block; line-height: 1.1;">@ivanaabergamin</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${post.date}</span>
            </div>
          </div>
          <span style="font-size: 0.75rem; padding: 0.2rem 0.55rem; background-color: var(--bg-surface-subtle); border-radius: 9999px; font-weight: 700; color: var(--text-secondary);">
            ${post.category}
          </span>
        </div>

        <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: 2rem 1.5rem; text-align: center; margin-bottom: 1rem; border: 1px dashed var(--border-subtle);">
          <div style="font-size: 2.75rem; margin-bottom: 0.5rem;">${post.icon}</div>
          <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); line-height: 1.3;">
            ${post.title}
          </h4>
        </div>

        <p style="font-size: 0.885rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 1.25rem;">
          ${post.caption}
        </p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; color: var(--text-muted);">
          <span style="cursor: pointer;" onclick="likePost('${post.id}', this)">
            ❤️ <span class="like-count">${post.likes}</span>
          </span>
          <span>💬 ${post.comments}</span>
        </div>
        <a href="https://www.instagram.com/ivanaabergamin/" target="_blank" rel="noopener noreferrer" style="font-size: 0.8rem; font-weight: 700; color: var(--primary-600);">
          Ver no Instagram →
        </a>
      </div>
    </div>
  `).join('');
}

window.likePost = function(id, el) {
  const countEl = el.querySelector('.like-count');
  if (countEl) {
    let count = parseInt(countEl.textContent, 10);
    count++;
    countEl.textContent = count;
    el.style.transform = 'scale(1.2)';
    setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
    showToast('Obrigado por curtir o conteúdo educativo da Dra. Ivana!', 'success');
  }
};
