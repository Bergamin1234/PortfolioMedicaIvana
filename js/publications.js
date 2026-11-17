/**
 * Dra. Ivana Caroline Silva Bergamin - Biblioteca Científica & Produções
 * Busca em tempo real, filtros por tag e gerador de citações acadêmicas (ABNT, APA, Vancouver)
 */

let publicationsData = [
  {
    id: "bjhr-2025",
    type: "artigo",
    title: "Comparativo das abordagens cirúrgicas de histerectomia total: abdominal, vaginal, laparoscópica e robótica",
    journal: "Brazilian Journal of Health Review (BJHR)",
    year: 2025,
    volume: "8",
    issue: "1",
    pages: "e77895",
    doi: "10.34119/bjhrv8n1-472",
    link: "https://ojs.brazilianjournals.com.br/ojs/index.php/BJHR/article/view/77895/54020",
    authors: "Luize, L. M.; Neves, M. C. M.; Lima, A. J. A.; Oliveira, J. C.; Koshiyama Júnior, J. S.; Carlos, B. M. F.; Coutinho, G. H. C.; Zanoni, I. C. M.; Vicente, K. C. O. C.; Xavier, J. T.; Gouveia, G. K. T.; Bergamin, I. C. S.; Gadelha, A. F.; França, L. E. O.; Brauns, G. T.; Jardim, M. C. J.",
    tags: ["Ginecologia", "Cirurgia", "Histerectomia", "Saúde da Mulher"],
    summary: "Estudo comparativo integrativo sobre as diferentes vias cirúrgicas da histerectomia total, analisando indicações, segurança clínica, recuperação pós-operatória e tendências na prática cirúrgica contemporânea."
  },
  {
    id: "deciencia-2024",
    type: "artigo",
    title: "Transtorno Bipolar: Uma Avaliação das Terapêuticas Empregadas",
    journal: "DêCiência em Foco",
    year: 2024,
    volume: "7",
    issue: "1",
    pages: "116-128",
    doi: "",
    link: "https://www.escavador.com/sobre/378656505/ivana-caroline-silva-bergamin",
    authors: "Bergamin, I. C. S.",
    tags: ["Saúde Mental", "Psiquiatria", "Atenção Primária", "Farmacoterapia"],
    summary: "Análise crítica das abordagens farmacológicas e psicossociais empregadas no manejo do transtorno afetivo bipolar, destacando a importância do diagnóstico precoce e da adesão ao plano terapêutico."
  },
  {
    id: "deciencia-2021",
    type: "artigo",
    title: "Desafios Contemporâneos no Processo de Ensino e Aprendizagem Remota em Tempos de COVID-19: Relato de Experiência",
    journal: "DêCiência em Foco",
    year: 2021,
    volume: "5",
    issue: "2",
    pages: "177-192",
    doi: "",
    link: "https://www.escavador.com/sobre/378656505/ivana-caroline-silva-bergamin",
    authors: "Franco, L. M. V. A.; Bergamin, I. C. S.; Cadorin, E. S.",
    tags: ["Educação Médica", "COVID-19", "Metodologias Ativas"],
    summary: "Relato de experiência analisando as adaptações pedagógicas, ferramentas digitais e os impactos na formação de estudantes da área da saúde durante o período de distanciamento social."
  },
  {
    id: "micologia-kerion-2019",
    "type": "congresso",
    title: "Kérion Celsi: Manifestação Clínica de Tinea Capitis",
    journal: "IX Congresso Brasileiro de Micologia (Manaus)",
    year: 2019,
    volume: "",
    issue: "",
    pages: "Anais do Evento",
    doi: "",
    link: "https://www.escavador.com/sobre/378656505/ivana-caroline-silva-bergamin",
    authors: "Souza, G. C.; Souza, C. M.; Bergamin, I. C. S.; Amaral, E. B.",
    tags: ["Micologia", "Dermatologia", "Diagnóstico Laboratorial"],
    summary: "Apresentação e discussão clínica sobre as manifestações inflamatórias de tinea capitis (Kérion Celsi), com ênfase na correlação diagnóstica laboratorial e resposta clínica."
  },
  {
    id: "micologia-anemofilos-2019",
    type: "congresso",
    title: "Pesquisa, Isolamento e Identificação de Fungos Anemófilos na Unidade de Terapia Intensiva (UTI) do Hospital João Paulo II",
    journal: "IX Congresso Brasileiro de Micologia (Manaus) / TCC Biomedicina",
    year: 2019,
    volume: "",
    issue: "",
    pages: "Anais do Evento",
    doi: "",
    link: "https://www.escavador.com/sobre/378656505/ivana-caroline-silva-bergamin",
    authors: "Bergamin, I. C. S.; Amaral, E. B.",
    tags: ["Microbiologia", "Controle de Infecção", "Ambiente Hospitalar", "UTI"],
    summary: "Investigação experimental de microrganismos dispersos no ar em setor de terapia intensiva, contribuindo para protocolos de biossegurança e prevenção de infecções hospitalares."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initPublications();
});

function initPublications() {
  const container = document.getElementById('publicationsGrid');
  if (!container) return;

  renderPublications(publicationsData);
  initSearchAndFilter();
}

function renderPublications(list) {
  const container = document.getElementById('publicationsGrid');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nenhum trabalho científico encontrado para esta busca.</p>
        <button class="btn btn-outline btn-sm" onclick="resetPubFilters()">Limpar Filtros</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(pub => `
    <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; gap: 0.5rem;">
          <span style="display: inline-block; padding: 0.2rem 0.65rem; background-color: var(--primary-100); color: var(--primary-800); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">
            ${pub.type === 'artigo' ? '📄 Artigo em Periódico' : '🎤 Trabalho em Congresso'}
          </span>
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">
            ${pub.year}
          </span>
        </div>

        <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); line-height: 1.35; margin-bottom: 0.6rem;">
          ${pub.title}
        </h4>

        <p style="font-size: 0.85rem; font-weight: 600; color: var(--teal-700); margin-bottom: 0.75rem;">
          ${pub.journal}
        </p>

        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
          ${pub.summary}
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.5rem;">
          ${pub.tags.map(t => `<span style="font-size: 0.75rem; padding: 0.15rem 0.5rem; background-color: var(--bg-surface-subtle); border-radius: var(--radius-sm); color: var(--text-secondary);">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
        <button class="btn btn-primary btn-sm" onclick="openCitationModal('${pub.id}')">
          📚 Citar Trabalho
        </button>
        ${pub.doi ? `
          <a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            DOI Oficial ↗
          </a>
        ` : `
          <a href="${pub.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            Ver Registro ↗
          </a>
        `}
      </div>
    </div>
  `).join('');
}

function initSearchAndFilter() {
  const searchInput = document.getElementById('pubSearchInput');
  const tagBtns = document.querySelectorAll('.pub-filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = publicationsData.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.journal.toLowerCase().includes(q)
      );
      renderPublications(filtered);
    });
  }

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.getAttribute('data-tag');

      if (!tag || tag === 'todos') {
        renderPublications(publicationsData);
      } else {
        const filtered = publicationsData.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
        renderPublications(filtered);
      }
    });
  });
}

window.resetPubFilters = function() {
  const searchInput = document.getElementById('pubSearchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.pub-filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.pub-filter-btn[data-tag="todos"]')?.classList.add('active');
  renderPublications(publicationsData);
};

window.openCitationModal = function(id) {
  const pub = publicationsData.find(p => p.id === id);
  if (!pub) return;

  const abnt = `${pub.authors.toUpperCase()}. ${pub.title}. ${pub.journal}, ${pub.volume ? 'v. ' + pub.volume + ', ' : ''}${pub.issue ? 'n. ' + pub.issue + ', ' : ''}${pub.pages ? 'p. ' + pub.pages + ', ' : ''}${pub.year}.${pub.doi ? ' DOI: ' + pub.doi + '.' : ''}`;
  const apa = `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}${pub.volume ? ', ' + pub.volume : ''}${pub.issue ? '(' + pub.issue + ')' : ''}${pub.pages ? ', ' + pub.pages : ''}.${pub.doi ? ' https://doi.org/' + pub.doi : ''}`;
  const vancouver = `${pub.authors}. ${pub.title}. ${pub.journal}. ${pub.year}${pub.volume ? ';' + pub.volume : ''}${pub.issue ? '(' + pub.issue + ')' : ''}:${pub.pages ? pub.pages : ''}.${pub.doi ? ' doi:' + pub.doi : ''}`;

  const modalHtml = `
    <div class="modal-backdrop open" id="citationModal">
      <div class="modal-content">
        <button class="modal-close-btn" onclick="document.getElementById('citationModal').remove()">×</button>
        <h3 class="card-title" style="margin-bottom: 0.5rem;">Citar Produção Científica</h3>
        <p class="card-description" style="margin-bottom: 1.5rem;">Escolha o padrão acadêmico e copie a citação formatada:</p>

        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <strong style="font-size: 0.85rem; color: var(--primary-700);">ABNT (NBR 6023)</strong>
            <button class="btn btn-outline btn-sm" onclick="copyCitationText('${encodeURIComponent(abnt)}')">Copiar ABNT</button>
          </div>
          <div style="background: var(--bg-surface-subtle); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem; border: 1px solid var(--border-subtle); font-family: monospace;">
            ${abnt}
          </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <strong style="font-size: 0.85rem; color: var(--primary-700);">APA 7ª Edição</strong>
            <button class="btn btn-outline btn-sm" onclick="copyCitationText('${encodeURIComponent(apa)}')">Copiar APA</button>
          </div>
          <div style="background: var(--bg-surface-subtle); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem; border: 1px solid var(--border-subtle); font-family: monospace;">
            ${apa}
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <strong style="font-size: 0.85rem; color: var(--primary-700);">Vancouver</strong>
            <button class="btn btn-outline btn-sm" onclick="copyCitationText('${encodeURIComponent(vancouver)}')">Copiar Vancouver</button>
          </div>
          <div style="background: var(--bg-surface-subtle); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem; border: 1px solid var(--border-subtle); font-family: monospace;">
            ${vancouver}
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.copyCitationText = function(encoded) {
  const text = decodeURIComponent(encoded);
  navigator.clipboard.writeText(text).then(() => {
    showToast('Citação copiada para a área de transferência!', 'success');
  }).catch(() => {
    showToast('Falha ao copiar citação.', 'danger');
  });
};
