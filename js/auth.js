/**
 * Dra. Ivana Caroline Silva Bergamin - Sistema de Autenticação Médica Administrativa
 * Controle de Sessão, Conformidade LGPD e Proteção de Prontuário Eletrônico (PEP)
 */

const AuthService = {
  SESSION_KEY: 'dra_ivana_auth_session',
  ATTEMPTS_KEY: 'dra_ivana_login_attempts',
  
  // Credenciais autorizadas (Dra. Ivana e equipe médica)
  VALID_USERS: [
    'ivana.bergamin',
    'dra.ivana',
    '3484',
    'crm/ac 3484',
    'crm-ac 3484',
    'ivana@medicina.ac.gov.br',
    'admin'
  ],
  
  VALID_PASSWORDS: [
    'medicina2025',
    'ivana2025',
    'coreme2025',
    'admin123'
  ],

  /**
   * Obtém a sessão ativa atual (em sessionStorage ou localStorage)
   */
  getSession() {
    try {
      const session = sessionStorage.getItem(this.SESSION_KEY) || localStorage.getItem(this.SESSION_KEY);
      if (!session) return null;
      return JSON.parse(session);
    } catch (e) {
      console.error('Erro ao ler sessão:', e);
      return null;
    }
  },

  /**
   * Verifica se há um usuário autenticado
   */
  isAuthenticated() {
    const session = this.getSession();
    return !!(session && session.authenticated);
  },

  /**
   * Executa a autenticação com validação de credenciais
   */
  login(username, password, remember = false) {
    const normUser = (username || '').trim().toLowerCase();
    const normPass = (password || '').trim();

    // Verificação de bloqueio por tentativas
    let attempts = parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || '0', 10);
    if (attempts >= 5) {
      return {
        success: false,
        message: 'Acesso temporariamente bloqueado por excesso de tentativas. Tente novamente em 5 minutos.'
      };
    }

    const isUserValid = this.VALID_USERS.includes(normUser);
    const isPassValid = this.VALID_PASSWORDS.includes(normPass);

    if (isUserValid && isPassValid) {
      // Limpa tentativas falhas
      localStorage.removeItem(this.ATTEMPTS_KEY);

      const sessionData = {
        authenticated: true,
        userName: 'Dra. Ivana Caroline Silva Bergamin',
        crm: 'CRM/AC 3484',
        email: 'dra.ivana@medicina.ac.gov.br',
        role: 'Médica de Família & Comunidade • Residente COREME/FUNDHACRE',
        unit: 'USF Luana Freitas (ESF II)',
        cns: '701006862537892',
        loginTime: new Date().toISOString(),
        token: 'PEP-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase()
      };

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));

      // Se marcou lembrar, remove de sessionStorage para consistência
      if (remember) {
        sessionStorage.removeItem(this.SESSION_KEY);
      } else {
        localStorage.removeItem(this.SESSION_KEY);
      }

      return {
        success: true,
        session: sessionData
      };
    } else {
      attempts++;
      localStorage.setItem(this.ATTEMPTS_KEY, attempts.toString());
      const remaining = 5 - attempts;
      return {
        success: false,
        message: remaining > 0 
          ? `Credenciais médicas inválidas. Restam ${remaining} tentativa(s).` 
          : 'Acesso temporariamente bloqueado por excesso de tentativas.'
      };
    }
  },

  /**
   * Encerra a sessão médica atual
   */
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'login.html';
  },

  /**
   * Guarda de rota: redireciona para login se não autenticado
   */
  protectPage() {
    if (!this.isAuthenticated()) {
      const returnUrl = encodeURIComponent(window.location.pathname.split('/').pop() || 'admin.html');
      window.location.href = `login.html?returnUrl=${returnUrl}`;
    }
  },

  /**
   * Redireciona para o painel se já estiver autenticado
   */
  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl') || 'admin.html';
      window.location.href = returnUrl;
    }
  }
};

// Exporta globalmente para uso em admin.js e login.js
window.AuthService = AuthService;
