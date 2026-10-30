# 🎓 TecnoCapacita Cursos — Plataforma Institucional e Catálogo de Cursos

Site institucional e catálogo interativo desenvolvido para a **TecnoCapacita Cursos** (*Inovação em Aprendizagem*), instituição dedicada à capacitação e ao desenvolvimento profissional presencial em **Caldas Novas - GO** (Polo Universidade Cruzeiro do Sul).

---

## ✨ Funcionalidades Principais

- **🏠 Página Inicial (`index.html`):**
  - Cabeçalho fixo com navegação rápida e botões de ação (*Área do Aluno* e *Fale Conosco*).
  - **Hero Section** em duas colunas com destaque visual e chamadas para ação (CTAs).
  - **Seção Quem Somos** dividida em 3 partes:
    1. **Apresentação e Infraestrutura:** Texto institucional acompanhado de mosaico interativo 2x2 com fotos reais dos laboratórios e da recepção (com efeito **Lightbox** ao clicar nas imagens).
    2. **Estatísticas de Impacto Dinâmicas:** Faixa em azul-marinho com animação *count-up* acionada por rolagem via `IntersectionObserver` (`+500 Alunos Capacitados`, `24 Cursos Disponíveis`, `+15 Anos de Experiência`).
    3. **Histórias de Sucesso (Prova Social):** Card de destaque apresentando aluno formado e certificado.

- **📚 Catálogo de Cursos (`catalogo.html`):**
  - Banner com gradiente moderno do azul-marinho ao azul royal e grafismos geométricos sutis.
  - **Barra de Busca e Filtros Flutuante:** Pesquisa por nome do curso acionada pela tecla `Enter` (ocultando os demais cursos e rolando automaticamente até o curso pesquisado) e filtros rápidos por categoria (*Todos*, *Tecnologia*, *Administração*, *Saúde* e *Kids*).
  - **Cards de Cursos Responsivos (24 cursos 100% presenciais):** Imagem de capa, etiqueta (badge) de categoria, título, resumo com `line-clamp`, metadados em SVG (carga horária e modalidade presencial) e botão **"Ver Detalhes"**.
  - **Modal de Detalhes do Curso:** Exibe a descrição completa, carga horária, modalidade, grade de módulos programáticos e botões diretos para matrícula via **WhatsApp** ou **E-mail**.

- **📬 Página de Contato (`contato.html`):**
  - Layout responsivo em duas colunas sobre fundo claro.
  - **Formulário Inteligente:**
    - **Máscara em Tempo Real (`MascaraTelefoneModulo`):** Formata automaticamente o telefone para `(99) 99999-9999` bloqueando caracteres não numéricos.
    - **Validação Client-Side Rigorosa (`ValidacaoFormularioModulo`):** Valida nome, telefone (10 ou 11 dígitos), e-mail via Expressão Regular (Regex) e mensagem, injetando alertas dinâmicos em vermelho abaixo dos campos inválidos.
    - **Integração com APIs:** Envio direto por e-mail via `fetch` (FormSubmit REST API com fallback automático para `mailto:`) e redirecionamento formatado para a API oficial Click-to-Chat do WhatsApp.
    - **Preenchimento Automático via URL:** Seleciona automaticamente o curso no formulário quando o usuário vem do catálogo (`contato.html?curso=...`).
  - **Card de Atendimento Direto:** Links rápidos para WhatsApp, e-mail oficial e endereço físico interativo integrado ao **Google Maps**.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico** (`header`, `nav`, `section`, `aside`, `figure`, `footer`, atributos ARIA de acessibilidade)
- **CSS3 Puro** (CSS Grid, Flexbox, Custom Animations, Gradientes, `line-clamp`, `backdrop-filter`, Media Queries para responsividade mobile/desktop)
- **JavaScript Vanilla (ES6+)** (Arquitetura modular, `IntersectionObserver`, `fetch` API, `URLSearchParams`, manipulação de DOM e eventos)

---

## 📂 Estrutura de Arquivos

```text
site_cursos/
├── index.html                   # Página inicial (Hero + Quem Somos + Estatísticas + Histórias de Sucesso)
├── catalogo.html                # Catálogo completo com busca, filtros por categoria e modal de módulos
├── contato.html                 # Página de contato com máscara, validação Regex e canais de atendimento
├── styles.css                   # Folha de estilos global e responsiva
├── script.js                    # Módulos JavaScript (Busca, Modal, Count-up, Lightbox, Máscara, Validação e APIs)
├── favicon.svg                  # Ícone vetorial da aba do navegador (TC)
├── hero-estudantes.jpg          # Imagem de destaque da seção Hero
├── recepcao-polo.jpg            # Foto real da recepção do polo
├── lab-alunos.jpg               # Foto real dos alunos em aula prática no laboratório
├── lab-estrutura.jpg            # Foto real da estrutura de computadores do laboratório
├── pratica-digitacao.jpg        # Foto real de aula prática de digitação
├── aluno-formado-denisson.jpg   # Foto real de formatura e certificação de aluno
└── README.md                    # Documentação do projeto
```

---

## 📋 Cursos Disponíveis no Catálogo (Presenciais)

1. Informática Básica e Avançada
2. Informática Básica
3. Informática Kids
4. Web Designer
5. Designer Gráfico
6. Criação de Games
7. Montagem e Manutenção de Computadores
8. Linguagem e Programação de Computadores
9. AutoCAD
10. Logística Empresarial
11. Telemarketing
12. Operador de Caixa
13. Atendente de Ótica
14. Auxiliar de Consultório Odontológico
15. Auxiliar de Farmácia
16. Empreendedorismo
17. Recepção Hoteleira
18. Cuidador de Idosos
19. Auxiliar Veterinário
20. Rotinas Administrativas
21. Gestão Empresarial
22. Produção de Vídeos
23. Gestão de TI
24. Inglês Interativo

---

## 🚀 Como Executar o Projeto Localmente

Como o projeto foi construído com tecnologias nativas (**HTML5, CSS3 e JavaScript puro**), não é necessário instalar dependências (`npm`, `node_modules`, etc.):

1. Clone este repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd site_cursos
   ```
3. Abra o arquivo `index.html` diretamente no navegador ou utilize a extensão **Live Server** no VS Code.

---

## 🏢 Informações Institucionais

- **Instituição:** TecnoCapacita Cursos — *Inovação em Aprendizagem*
- **CNPJ:** 52.920.891/0001-06
- **Unidade Presencial:** Universidade Cruzeiro do Sul - Polo Caldas Novas (Caldas Novas - GO)
- **CEP:** 75681-773
- **Telefone / WhatsApp:** (64) 99255-0010
- **E-mail:** contato@tecnocapacita.com.br
