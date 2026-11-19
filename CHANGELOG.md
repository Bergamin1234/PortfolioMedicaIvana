# Changelog — Portfólio Médico Dra. Ivana Bergamin

Todas as mudanças notáveis deste projeto são documentadas neste arquivo seguindo o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Versionamento Semântico (SemVer)](https://semver.org/lang/pt-BR/).

---

## [1.1.0] - 2026-11-19

### Adicionado
- **Módulo Oficial "Consulte o CRM e CRB" (`#registros`):**
  - **CRM (Conselho Regional de Medicina):** Card oficial de transparência com CRM/AC 3484, qualificação em Medicina de Família e Comunidade (MFC - COREME/FUNDHACRE), status ativo e regular, botão de direcionamento para o portal do CFM e botão de cópia de dados cadastrais em 1 clique.
  - **CRB / CRBM (Conselho Regional de Biomedicina):** Card oficial com titulação biomédica pela UniSL, habilitações em Patologia Clínica, Hematologia e Micologia Médica, jurisdição do CRBM 4ª Região / CFBM, botão de consulta ao conselho e cópia rápida de dados.
  - **Credenciais Complementares:** Caixas de verificação do CNES DataSUS (USF Luana Freitas - 7565534) e Currículo Lattes CNPq Oficial (ID K8648499E5).
  - **Atalhos Globais:** Inclusão de atalho "🛡️ Consulte CRM & CRB" na topbar superior, novo link na navbar, botão de destaque no Hero e links no rodapé.
- **Painel de Projetos e Feitos da Dra. Ivana Bergamin (`#projetos`):**
  - Showcase com 10 projetos e realizações categorizados:
    1. *Comparativo das Abordagens Cirúrgicas de Histerectomia Total* (BJHR 2025, DOI: 10.34119/bjhrv8n1-472).
    2. *Pesquisa, Isolamento e Identificação de Fungos Anemófilos em UTI* (Hospital de Trauma João Paulo II / IX Congresso de Micologia).
    3. *Vice-Presidência da LIMAGO & Rastreamento do Câncer Feminino* (Uninorte / Rio Branco).
    4. *Manejo do Transtorno Bipolar na Atenção Básica* (Revista DêCiência em Foco, 2024).
    5. *Inovação e Ensino Remoto em Saúde na Pandemia COVID-19* (Revista DêCiência em Foco, 2021).
    6. *Monitoria Acadêmica e Atuação na LABMIA* (UniSL - Hematologia e Micologia).
    7. *Mutirões de Coleta Laboratorial e Cuidado Geriátrico* (Lar Espírita André Luiz).
    8. *Programa de Residência Médica em Medicina de Família e Comunidade* (COREME/FUNDHACRE 2025).
    9. *Cuidado Médico Longitudinal na USF Luana Freitas* (ESF II - Atenção Primária).
    10. *Coordenação do Biomedicina Day e Workshops de Citopatologia* (UniSL).
  - Barra interativa de filtros dinâmicos por categoria (*Pesquisas Científicas*, *Hospitalar & Biossegurança*, *Saúde da Mulher & LIMAGO*, *Ações Comunitárias*, *Atenção Primária & SUS*).
- **Melhorias em JavaScript & CSS (`js/main.js` e `css/components.css`):**
  - Implementação da função `copyRegistryData(type)` com toast notification instantâneo.
  - Sistema reativo de filtragem `initProjectsFilter()`.
  - Estilização médica de luxo para cards de conselhos regionais e projetos.
- **Validação e Testes:**
  - Atualização dos testes automatizados em `tests/test_integrity.py` para garantir a integridade dos dados e links do CRM e CRB.

## [1.0.0] - 2026-11-18

### Adicionado
- **Portfólio Médico Completo (`index.html`):**
  - Hero moderno com avatar 2D vetorial SVG de alta definição (`assets/img/avatar-doctor.svg`) e cards flutuantes posicionados nas extremidades externas.
  - Cabeçalho responsivo com navegação sem quebra de linha e menu gaveta adaptativo.
  - Seção *Sobre* com linha do tempo interativa (Biomedicina UniSL, Medicina Uninorte/LIMAGO e Residência MFC COREME/FUNDHACRE 2025) e Showcase Clínico inline com monitor ECG animado.
  - **Produção Científica (`js/publications.js`):** busca em tempo real, filtros e gerador de citações (ABNT NBR 6023, APA 7ª ed. e Vancouver), incluindo artigo BJHR 2025 (`DOI: 10.34119/bjhrv8n1-472`).
  - **Calculadoras Clínicas (`js/calculators.js`):** IMC, Idade Gestacional/DPP (Regra de Naegele), Risco de Diabetes (FINDRISC) e TFG (CKD-EPI).
  - **Agendamento Online (`js/scheduling.js`):** fluxo em etapas, geração de evento `.ics`, sincronização local com o painel administrativo e disparo direto para o WhatsApp oficial (`+55 69 9383-7333`).
  - **Pré-Triagem de Pacientes (`js/triage-intake.js`):** detecção de sinais de alerta (Red Flags) com acionamento SAMU 192.
  - **Guia de Preparo de Exames (`js/exams-guide.js`)** e canal educacional integrado ao Instagram `@ivanaabergamin`.
  - Conformidade ético-legal com a **Resolução CFM nº 2.336/2023** (CRM/AC 3484).
- **Sistema de Login Administrativo (`login.html` e `js/auth.js`):**
  - Controle de sessão com guarda de rotas em `admin.html`, proteção contra excesso de tentativas, alternador de visibilidade de senha e modo demonstração.
- **Painel Administrativo Clínico (`admin.html`, `css/admin.css`, `js/admin.js`):**
  - **Central de Mensagem Rápida (WhatsApp Express):** 5 modos em 1 clique (*Retorno*, *Dia Marcado*, *Mensagem Livre*, *Exames* e *Remarcar*), atalhos de data (`Amanhã`, `+7d`, `+15d`, `+30d`), chips de horário, prévia ao vivo estilo WhatsApp, opção *"Enviar + Salvar na Agenda"* e histórico de envios.
  - **Agenda & Retornos em cards:** filtros por status, busca rápida, criação de novos horários/retornos e ações rápidas em 1 clique.
  - **Prontuário Eletrônico (SOAP) e Receituário Timbrado para impressão.**
- **Infraestrutura & Produção:**
  - `vercel.json` com cabeçalhos de segurança e cache otimizado para `/assets/`.
  - Deploy contínuo em produção na Vercel (`https://portfolio-medica-ivana.vercel.app/`).
  - Integração do **Vercel Web Analytics** (`/_vercel/insights/script.js`) em todas as páginas HTML.
  - Vinculação ao painel central **Bergamin Hub** (`https://bergamin-hub.vercel.app/`).
  - Suíte automatizada de testes de integridade (`tests/test_integrity.py`).
