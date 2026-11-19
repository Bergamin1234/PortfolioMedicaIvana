/**
 * Dra. Ivana Caroline Silva Bergamin - Portfólio Médico Profissional
 * Script Principal: Gerenciamento de Tema, Navegação, FAQ e Utilitários de Interface
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initFaqAccordion();
  initModals();
  initProjectsFilter();
});

/* ==========================================================================
   TEMA (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('theme_preference');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme_preference', theme);
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-label', `Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`);
    themeToggleBtn.innerHTML = theme === 'dark' 
      ? '<span class="icon" aria-hidden="true">☀️</span>' 
      : '<span class="icon" aria-hidden="true">🌙</span>';
  }
}

/* ==========================================================================
   NAVEGAÇÃO E HEADER SCROLL
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header blur/shadow ao rolar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Menu mobile toggle
  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Fechar ao clicar em um link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        menuToggleBtn.innerHTML = '☰';
      });
    });
  }

  // Active link com IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Fecha outros abertos para experiência limpa
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAns = otherItem.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        }
      });
    }
  });
}

/* ==========================================================================
   MODAIS GENÉRICOS
   ========================================================================== */
function initModals() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) modal.classList.remove('open');
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('open');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
        modal.classList.remove('open');
      });
    }
  });
}

/* ==========================================================================
   NOTIFICAÇÕES TOAST
   ========================================================================== */
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 3000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colors = {
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#0284c7'
  };

  toast.style.cssText = `
    background: var(--bg-surface-elevated, #ffffff);
    color: var(--text-main, #0f172a);
    border-left: 4px solid ${colors[type] || colors.info};
    border-radius: 8px;
    padding: 14px 18px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    font-size: 0.9rem;
    font-weight: 600;
    pointer-events: auto;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    transform: translateY(20px);
    opacity: 0;
  `;
  toast.innerHTML = message;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

/* ==========================================================================
   CONSULTE O CRM E CRB | CÓPIA DE DADOS E FILTRO DE PROJETOS
   ========================================================================== */
window.copyRegistryData = function(type) {
  let text = '';
  let label = '';
  if (type === 'crm') {
    text = `Dra. Ivana Caroline Silva Bergamin\nRegistro: CRM/AC 3484\nConselho: Conselho Regional de Medicina do Estado do Acre (CRM-AC)\nÓrgão Federal: Conselho Federal de Medicina (CFM)\nQualificação: Medicina de Família e Comunidade (MFC - COREME/FUNDHACRE)\nSituação: Registro Ativo e Regular`;
    label = 'CRM/AC 3484 (Conselho Regional de Medicina)';
  } else if (type === 'crb') {
    text = `Dra. Ivana Caroline Silva Bergamin\nFormação: Bacharela em Biomedicina\nInstituição: Centro Universitário São Lucas (UniSL - Rondônia)\nConselho: Conselho Regional de Biomedicina (CRBM 4ª Região)\nÓrgão Federal: Conselho Federal de Biomedicina (CFBM)\nHabilitações: Patologia Clínica, Hematologia, Micologia & Diagnóstico Laboratorial\nSituação: Habilitação Profissional Reconhecida`;
    label = 'CRB/CRBM (Conselho Regional de Biomedicina)';
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 Dados oficiais do <strong>${label}</strong> copiados para a área de transferência!`, 'success');
    }).catch(() => {
      fallbackCopy(text, label);
    });
  } else {
    fallbackCopy(text, label);
  }
};

function fallbackCopy(text, label) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`📋 Dados oficiais do <strong>${label}</strong> copiados!`, 'success');
  } catch (err) {
    showToast(`Dados: ${label}`, 'info');
  }
  document.body.removeChild(textArea);
}

function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'todos' || category === filter || card.classList.contains(filter)) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}
