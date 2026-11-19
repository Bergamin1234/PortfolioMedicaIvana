"""
Teste de Integridade e Validação do Portfólio Médico
Verifica a presença e consistência de todos os assets, páginas e datasets.
"""

import os
import re
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_files_exist():
    required_files = [
        'index.html',
        'admin.html',
        'login.html',
        'README.md',
        'LICENSE',
        'robots.txt',
        'sitemap.xml',
        'manifest.json',
        'css/styles.css',
        'css/components.css',
        'css/responsive.css',
        'css/admin.css',
        'js/main.js',
        'js/admin.js',
        'js/auth.js',
        'js/scheduling.js',
        'js/calculators.js',
        'js/publications.js',
        'js/instagram-feed.js',
        'js/triage-intake.js',
        'js/exams-guide.js',
        'assets/img/avatar-doctor-exact.png',
        'assets/img/avatar-doctor.svg',
        'assets/img/logo-crest.svg',
        'assets/img/crm-badge.svg',
        'assets/img/medical-hero.svg',
        'assets/img/favicon.svg',
        'assets/data/publications.json',
        'docs/TRAJETORIA_E_PERFIL.md',
        'docs/RESOLUCAO_CFM_2336.md'
    ]

    missing = []
    for rel_path in required_files:
        full_path = os.path.join(BASE_DIR, rel_path)
        if not os.path.isfile(full_path):
            missing.append(rel_path)

    assert not missing, f"Arquivos ausentes: {missing}"
    print(f"✓ Todos os {len(required_files)} arquivos essenciais existem.")

def test_json_validity():
    json_path = os.path.join(BASE_DIR, 'assets', 'data', 'publications.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    assert isinstance(data, list) and len(data) >= 4
    for item in data:
        assert 'title' in item and 'year' in item and 'tags' in item
    print(f"✓ Dataset de publicações contém {len(data)} entradas válidas.")

def test_html_references():
    html_path = os.path.join(BASE_DIR, 'index.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Checar se CRM/AC 3484 está presente
    assert "3484" in html
    assert "Ivana Caroline Silva Bergamin" in html
    assert "COREME" in html
    assert "FUNDHACRE" in html
    assert "USF Luana Freitas" in html
    assert "@ivanaabergamin" in html
    assert "Conselho Regional de Medicina" in html
    assert "Conselho Regional de Biomedicina" in html
    assert "Consulte o CRM e CRB" in html
    assert "Projetos e Feitos da Dra. Ivana Bergamin" in html
    assert "https://portal.cfm.org.br/busca-medicos/" in html
    assert "https://crbm4.gov.br/" in html
    assert "copyRegistryData" in html
    print("✓ Conteúdo HTML validado com dados institucionais, CRM, CRB e Projetos da Dra. Ivana.")

if __name__ == '__main__':
    print("Iniciando testes de integridade...")
    test_files_exist()
    test_json_validity()
    test_html_references()
    print("Todos os testes passaram com sucesso! 🚀")
