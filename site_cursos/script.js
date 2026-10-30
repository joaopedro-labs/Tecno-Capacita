// Configurações de Contato da TecnoCapacita Cursos
const CONFIG_CONTATO = {
    // Coloque aqui o número oficial com DDI (55) + DDD + Número (apenas dígitos)
    whatsappNumero: "5564992550010",
    
    // E-mail oficial de atendimento
    emailDestino: "contato@tecnocapacita.com.br",
    
    // Endpoint de API de E-mail (FormSubmit Ajax API - funciona direto no Front-End)
    // Para ativar no seu e-mail real, basta trocar o e-mail acima; no primeiro envio você receberá um link de confirmação.
    get emailApiUrl() {
        return `https://formsubmit.co/ajax/${this.emailDestino}`;
    }
};

/**
 * Monta e abre a URL da API oficial Click-to-Chat do WhatsApp (api.whatsapp.com/send)
 */
function enviarParaWhatsApp({ nome = "", curso = "", mensagem = "" } = {}) {
    let texto = "Olá! Vim pelo site da *TecnoCapacita Cursos*.";

    if (nome) {
        texto += `\n\n*Nome:* ${nome}`;
    }
    if (curso) {
        texto += `\n*Curso de Interesse:* ${curso}`;
    }
    if (mensagem) {
        texto += `\n*Mensagem:* ${mensagem}`;
    } else if (!nome && !curso) {
        texto += " Gostaria de mais informações sobre as próximas turmas.";
    }

    const parametros = new URLSearchParams({
        phone: CONFIG_CONTATO.whatsappNumero,
        text: texto
    });

    const urlApiWhatsApp = `https://api.whatsapp.com/send?${parametros.toString()}`;
    window.open(urlApiWhatsApp, "_blank", "noopener,noreferrer");
}

/**
 * Envia os dados por E-mail consumindo API REST via fetch() (com fallback para mailto)
 */
async function enviarPorEmail({ nome, email, telefone, curso, mensagem }) {
    const feedbackEl = document.getElementById("contato-feedback");
    const btnEmail = document.getElementById("btn-enviar-email");

    if (!nome || !email || !mensagem) {
        mostrarFeedback("Por favor, preencha seu nome, e-mail e mensagem para enviar um e-mail.", "erro");
        return;
    }

    try {
        btnEmail.disabled = true;
        btnEmail.textContent = "Enviando e-mail...";
        mostrarFeedback("Conectando à API de e-mail...", "info");

        const resposta = await fetch(CONFIG_CONTATO.emailApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                _subject: `[TecnoCapacita] Interesse no curso: ${curso || "Geral"}`,
                Nome: nome,
                Email: email,
                Telefone: telefone || "Não informado",
                Curso: curso || "Não especificado",
                Mensagem: mensagem
            })
        });

        const dados = await resposta.json();

        if (resposta.ok && (dados.success === "true" || dados.success === true)) {
            mostrarFeedback("E-mail enviado com sucesso! Em breve nossa equipe entrará em contato.", "sucesso");
            document.getElementById("form-contato")?.reset();
        } else {
            // Caso o e-mail ainda não tenha sido ativado no FormSubmit, abrimos o cliente de e-mail já preenchido
            abrirClienteDeEmailFallback({ nome, email, telefone, curso, mensagem });
            mostrarFeedback("Abrimos seu aplicativo de e-mail com a mensagem pronta para envio!", "sucesso");
        }
    } catch (erro) {
        console.warn("Usando fallback mailto devido a restrição de rede/API:", erro);
        abrirClienteDeEmailFallback({ nome, email, telefone, curso, mensagem });
        mostrarFeedback("Abrimos seu aplicativo de e-mail com todos os dados preenchidos!", "sucesso");
    } finally {
        if (btnEmail) {
            btnEmail.disabled = false;
            btnEmail.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                Enviar por E-mail
            `;
        }
    }
}

/**
 * Fallback que abre o cliente de e-mail padrão com assunto e corpo codificados
 */
function abrirClienteDeEmailFallback({ nome, email, telefone, curso, mensagem }) {
    const assunto = encodeURIComponent(`[TecnoCapacita Cursos] Interesse: ${curso || "Informações"}`);
    const corpo = encodeURIComponent(
        `Olá, equipe TecnoCapacita Cursos!\n\n` +
        `Nome: ${nome}\n` +
        `E-mail: ${email}\n` +
        `Telefone/WhatsApp: ${telefone || "Não informado"}\n` +
        `Curso de Interesse: ${curso || "Geral"}\n\n` +
        `Mensagem:\n${mensagem}`
    );
    window.location.href = `mailto:${CONFIG_CONTATO.emailDestino}?subject=${assunto}&body=${corpo}`;
}

/**
 * Exibe alertas visuais de status no formulário
 */
function mostrarFeedback(texto, tipo) {
    const feedbackEl = document.getElementById("contato-feedback");
    if (!feedbackEl) return;

    feedbackEl.textContent = texto;
    feedbackEl.className = `contato-feedback visivel ${tipo}`;
}

/**
 * ============================================================================
 * ARQUITETURA MODULAR DA SEÇÃO DE CONTATO (3 FRENTES)
 * ============================================================================
 */

/**
 * 1. Módulo de Máscaras em Tempo Real (Input Masking)
 * Formata automaticamente para (99) 99999-9999 impedindo letras e símbolos inválidos
 */
const MascaraTelefoneModulo = {
    formatar(valorBruto) {
        const apenasDigitos = valorBruto.replace(/\D/g, "").slice(0, 11);

        if (apenasDigitos.length === 0) return "";
        if (apenasDigitos.length <= 2) {
            return `(${apenasDigitos}`;
        }
        if (apenasDigitos.length <= 6) {
            return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`;
        }
        if (apenasDigitos.length <= 10) {
            return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 6)}-${apenasDigitos.slice(6)}`;
        }
        return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7, 11)}`;
    },

    inicializar(seletorInput = "#contato-telefone") {
        const inputTelefone = document.querySelector(seletorInput);
        if (!inputTelefone) return;

        inputTelefone.addEventListener("input", (evento) => {
            evento.target.value = this.formatar(evento.target.value);
        });
    }
};

/**
 * 2. Módulo de Validação Client-Side Rigorosa
 * Valida e-mail via Regex e quantidade exata de dígitos do telefone, injetando alertas em vermelho
 */
const ValidacaoFormularioModulo = {
    regexEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    limparErroCampo(campo) {
        if (!campo) return;
        campo.classList.remove("input-invalido");
        const containerGrupo = campo.closest(".form-group");
        const alertaExistente = containerGrupo?.querySelector(".campo-erro-msg");
        if (alertaExistente) {
            alertaExistente.remove();
        }
    },

    injetarErroCampo(campo, mensagemErro) {
        if (!campo) return;
        this.limparErroCampo(campo);
        campo.classList.add("input-invalido");

        const containerGrupo = campo.closest(".form-group");
        if (!containerGrupo) return;

        const spanErro = document.createElement("span");
        spanErro.className = "campo-erro-msg";
        spanErro.setAttribute("role", "alert");
        spanErro.textContent = `⚠ ${mensagemErro}`;
        containerGrupo.appendChild(spanErro);
    },

    validarFormulario() {
        const campoNome = document.getElementById("contato-nome");
        const campoTelefone = document.getElementById("contato-telefone");
        const campoEmail = document.getElementById("contato-email");
        const campoMensagem = document.getElementById("contato-mensagem");

        [campoNome, campoTelefone, campoEmail, campoMensagem].forEach((c) => this.limparErroCampo(c));

        let formularioValido = true;
        let primeiroCampoComErro = null;

        // Validação do Nome
        const nomeValor = campoNome?.value.trim() || "";
        if (nomeValor.length < 3) {
            this.injetarErroCampo(campoNome, "Informe seu nome completo (mínimo de 3 caracteres).");
            formularioValido = false;
            primeiroCampoComErro = primeiroCampoComErro || campoNome;
        }

        // Validação do Telefone (quantidade correta de dígitos: 10 ou 11 dígitos)
        const telefoneValor = campoTelefone?.value.trim() || "";
        const digitosTelefone = telefoneValor.replace(/\D/g, "");
        if (digitosTelefone.length < 10 || digitosTelefone.length > 11) {
            this.injetarErroCampo(campoTelefone, "Informe um telefone válido com DDD no formato (99) 99999-9999.");
            formularioValido = false;
            primeiroCampoComErro = primeiroCampoComErro || campoTelefone;
        }

        // Validação do E-mail com Expressão Regular (Regex)
        const emailValor = campoEmail?.value.trim() || "";
        if (!this.regexEmail.test(emailValor)) {
            this.injetarErroCampo(campoEmail, "Digite um endereço de e-mail válido (ex: nome@dominio.com).");
            formularioValido = false;
            primeiroCampoComErro = primeiroCampoComErro || campoEmail;
        }

        // Validação da Mensagem
        const mensagemValor = campoMensagem?.value.trim() || "";
        if (mensagemValor.length < 5) {
            this.injetarErroCampo(campoMensagem, "Escreva sua dúvida ou mensagem antes de enviar.");
            formularioValido = false;
            primeiroCampoComErro = primeiroCampoComErro || campoMensagem;
        }

        if (!formularioValido && primeiroCampoComErro) {
            primeiroCampoComErro.focus();
        }

        return formularioValido;
    },

    inicializarListenersLimpeza() {
        const campos = ["contato-nome", "contato-telefone", "contato-email", "contato-mensagem"];
        campos.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener("input", () => this.limparErroCampo(el));
            }
        });
    }
};

/**
 * 3. Módulo de Estatísticas de Impacto Dinâmicas (IntersectionObserver + Count-Up)
 * Anima os números de 0 até o valor final (data-alvo) quando a faixa azul entra na tela
 */
const EstatisticasCountUpModulo = {
    animarContador(elemento, valorFinal, duracaoMs = 1800) {
        let tempoInicial = null;

        const passoAnimacao = (timestamp) => {
            if (!tempoInicial) tempoInicial = timestamp;
            const progresso = Math.min((timestamp - tempoInicial) / duracaoMs, 1);
            // Curva easeOutCubic para subida fluida e desaceleração suave no final
            const progressoSuave = 1 - Math.pow(1 - progresso, 3);
            const valorAtual = Math.floor(progressoSuave * valorFinal);

            elemento.textContent = valorAtual.toLocaleString("pt-BR");

            if (progresso < 1) {
                window.requestAnimationFrame(passoAnimacao);
            } else {
                elemento.textContent = valorFinal.toLocaleString("pt-BR");
            }
        };

        window.requestAnimationFrame(passoAnimacao);
    },

    inicializar(seletorFaixa = "#faixa-estatisticas") {
        const faixa = document.querySelector(seletorFaixa);
        const contadores = document.querySelectorAll(".estatistica-numero[data-alvo]");
        if (!faixa || contadores.length === 0) return;

        let jaAnimou = false;

        const observer = new IntersectionObserver(
            (entradas, obs) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting && !jaAnimou) {
                        jaAnimou = true;
                        contadores.forEach((contador) => {
                            const valorAlvo = parseInt(contador.getAttribute("data-alvo"), 10) || 0;
                            this.animarContador(contador, valorAlvo, 1800);
                        });
                        obs.unobserve(faixa);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(faixa);
    }
};

/**
 * 4. Módulo de Visualização Ampliada (Lightbox) para as fotos de Quem Somos
 */
const GaleriaLightboxModulo = {
    inicializar() {
        const overlay = document.getElementById("lightbox-quem-somos");
        const imgAmpliada = document.getElementById("lightbox-img");
        const legendaAmpliada = document.getElementById("lightbox-legenda");
        const btnFechar = document.getElementById("btn-fechar-lightbox");

        if (!overlay || !imgAmpliada) return;

        const abrirImagem = (src, alt, legenda) => {
            imgAmpliada.src = src;
            imgAmpliada.alt = alt || "";
            if (legendaAmpliada) {
                legendaAmpliada.textContent = legenda || alt || "";
            }
            overlay.classList.add("aberto");
            overlay.setAttribute("aria-hidden", "false");
        };

        const fecharImagem = () => {
            overlay.classList.remove("aberto");
            overlay.setAttribute("aria-hidden", "true");
        };

        // Cliques nas 4 fotos do mosaico de infraestrutura
        document.querySelectorAll(".quem-somos-mosaico .mosaico-item").forEach((figure) => {
            figure.addEventListener("click", () => {
                const img = figure.querySelector("img");
                const legenda = figure.querySelector(".mosaico-legenda")?.textContent || "";
                if (img) {
                    abrirImagem(img.src, img.alt, legenda);
                }
            });
        });

        // Clique na foto do aluno formado (Histórias de Sucesso)
        const fotoAluno = document.querySelector(".historia-sucesso-foto img");
        if (fotoAluno) {
            fotoAluno.parentElement.addEventListener("click", () => {
                abrirImagem(fotoAluno.src, fotoAluno.alt, "Dénisson Kaik — Formado em Informática Básica e Avançada");
            });
        }

        btnFechar?.addEventListener("click", fecharImagem);
        overlay.addEventListener("click", (evento) => {
            if (evento.target === overlay) fecharImagem();
        });
        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape" && overlay.classList.contains("aberto")) {
                fecharImagem();
            }
        });
    }
};

// Inicialização dos eventos quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar os Módulos da Arquitetura de Contato e Quem Somos
    MascaraTelefoneModulo.inicializar("#contato-telefone");
    ValidacaoFormularioModulo.inicializarListenersLimpeza();
    EstatisticasCountUpModulo.inicializar("#faixa-estatisticas");
    GaleriaLightboxModulo.inicializar();

    // 1. Preencher automaticamente o curso caso o usuário venha da página catalogo.html (?curso=Nome)
    const paramsUrl = new URLSearchParams(window.location.search);
    const cursoSelecionado = paramsUrl.get("curso");
    const selectCurso = document.getElementById("contato-curso");

    if (cursoSelecionado && selectCurso) {
        for (const option of selectCurso.options) {
            if (option.value.toLowerCase() === cursoSelecionado.toLowerCase()) {
                selectCurso.value = option.value;
                break;
            }
        }
    }

    // 2. Evento do botão "Enviar pelo WhatsApp" no formulário
    const btnWhatsAppForm = document.getElementById("btn-enviar-whatsapp");
    if (btnWhatsAppForm) {
        btnWhatsAppForm.addEventListener("click", () => {
            const nome = document.getElementById("contato-nome")?.value.trim() || "";
            const curso = document.getElementById("contato-curso")?.value || "";
            const mensagem = document.getElementById("contato-mensagem")?.value.trim() || "";

            if (!nome) {
                ValidacaoFormularioModulo.injetarErroCampo(
                    document.getElementById("contato-nome"),
                    "Informe seu nome completo para iniciar o atendimento pelo WhatsApp."
                );
                document.getElementById("contato-nome")?.focus();
                return;
            }

            mostrarFeedback("Redirecionando para a API do WhatsApp...", "sucesso");
            enviarParaWhatsApp({ nome, curso, mensagem });
        });
    }

    // 3. Evento do botão "Enviar por E-mail" (submit do formulário com Validação Client-Side Rigorosa)
    const formContato = document.getElementById("form-contato");
    if (formContato) {
        formContato.addEventListener("submit", (evento) => {
            evento.preventDefault();

            // Bloqueia o envio caso existam erros de validação nos campos
            if (!ValidacaoFormularioModulo.validarFormulario()) {
                mostrarFeedback("Verifique os campos destacados em vermelho antes de enviar.", "erro");
                return;
            }

            const nome = document.getElementById("contato-nome")?.value.trim() || "";
            const email = document.getElementById("contato-email")?.value.trim() || "";
            const telefone = document.getElementById("contato-telefone")?.value.trim() || "";
            const curso = document.getElementById("contato-curso")?.value || "";
            const mensagem = document.getElementById("contato-mensagem")?.value.trim() || "";

            enviarPorEmail({ nome, email, telefone, curso, mensagem });
        });
    }

    // 4. Conectar todos os botões rápidos de WhatsApp (botão flutuante e card rápido) à API
    const botoesRapidosWhats = document.querySelectorAll("[data-whatsapp-api]");
    botoesRapidosWhats.forEach((botao) => {
        botao.addEventListener("click", (evento) => {
            evento.preventDefault();
            const cursoCard = botao.getAttribute("data-curso") || "";
            enviarParaWhatsApp({ curso: cursoCard });
        });
    });

    // 4.1 Ao clicar na logo, recarrega e reinicia a tela atual (sem aparência de botão clicável)
    const logos = document.querySelectorAll("header .logo");
    logos.forEach((logo) => {
        logo.addEventListener("click", () => {
            window.scrollTo(0, 0);
            window.location.reload();
        });
    });

    // 5. Sistema de Pesquisa (com tecla Enter) e Filtro por Categoria no Catálogo
    const inputBusca = document.getElementById("input-busca-curso");
    const botoesFiltro = document.querySelectorAll(".btn-filtro");
    const cardsCursos = document.querySelectorAll(".curso-card");
    const boxSemResultados = document.getElementById("sem-resultados");
    const spanTermoBuscado = document.getElementById("termo-buscado");
    const btnLimparBusca = document.getElementById("btn-limpar-busca");

    // Função utilitária para remover acentos e padronizar minúsculas (ex: "informatica" encontra "Informática")
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    // Mapeamento de categorias para cada card caso não tenha data-categoria explícito
    function obterCategoriaDoCard(card) {
        if (card.dataset.categoria) return card.dataset.categoria;
        const titulo = normalizarTexto(card.querySelector("h3")?.textContent || "");
        const badge = normalizarTexto(card.querySelector(".curso-badge")?.textContent || "");

        if (titulo.includes("kids") || titulo.includes("games")) return "kids";
        if (badge.includes("saude") || badge.includes("cuidado") || badge.includes("animal") || titulo.includes("otica") || titulo.includes("odontologico") || titulo.includes("farmacia")) return "saude";
        if (badge.includes("gestao") || badge.includes("atendimento") || badge.includes("comercio") || badge.includes("turismo") || badge.includes("idiomas")) return "administracao";
        return "tecnologia";
    }

    // Filtra os cursos na tela e, opcionalmente, rola até o curso encontrado
    function filtrarCursos({ termo = "", categoria = "todos", rolarParaResultado = false } = {}) {
        const termoNormalizado = normalizarTexto(termo);
        let primeiroCardVisivel = null;
        let totalVisiveis = 0;

        cardsCursos.forEach((card) => {
            const tituloCurso = normalizarTexto(card.querySelector("h3")?.textContent || "");
            const areaCurso = normalizarTexto(card.querySelector(".curso-badge")?.textContent || "");
            const categoriaCard = obterCategoriaDoCard(card);

            const bateTermo = !termoNormalizado || tituloCurso.includes(termoNormalizado) || areaCurso.includes(termoNormalizado);
            const bateCategoria = categoria === "todos" || categoriaCard === categoria;

            if (bateTermo && bateCategoria) {
                card.style.display = "flex";
                totalVisiveis++;
                if (!primeiroCardVisivel) {
                    primeiroCardVisivel = card;
                }
            } else {
                card.style.display = "none";
            }
        });

        // Exibe ou oculta aviso quando nenhum curso for encontrado
        if (boxSemResultados) {
            if (totalVisiveis === 0) {
                if (spanTermoBuscado) spanTermoBuscado.textContent = termo || categoria;
                boxSemResultados.style.display = "block";
            } else {
                boxSemResultados.style.display = "none";
            }
        }

        // Rola suavemente até o curso pesquisado ao pressionar Enter
        if (rolarParaResultado) {
            if (primeiroCardVisivel) {
                primeiroCardVisivel.scrollIntoView({ behavior: "smooth", block: "center" });
            } else if (boxSemResultados) {
                boxSemResultados.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }

    // Evento de pressionar a tecla ENTER no campo de busca
    if (inputBusca) {
        inputBusca.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                evento.preventDefault();
                const termoDigitado = inputBusca.value;

                // Ao pesquisar com Enter, seleciona a aba "Todos" para buscar em todo o catálogo
                botoesFiltro.forEach((btn) => btn.classList.remove("ativo"));
                const btnTodos = document.querySelector('.btn-filtro[data-categoria="todos"]');
                if (btnTodos) btnTodos.classList.add("ativo");

                // Filtra tirando os outros cursos da tela e rola até o curso pesquisado
                filtrarCursos({
                    termo: termoDigitado,
                    categoria: "todos",
                    rolarParaResultado: true
                });
            }
        });

        // Se o usuário clicar no "X" nativo do input search para limpar, mostra todos os cursos novamente
        inputBusca.addEventListener("search", () => {
            if (inputBusca.value.trim() === "") {
                const categoriaAtiva = document.querySelector(".btn-filtro.ativo")?.getAttribute("data-categoria") || "todos";
                filtrarCursos({ termo: "", categoria: categoriaAtiva, rolarParaResultado: false });
            }
        });
    }

    // Evento de clique nos botões de categoria (Todos, Tecnologia, Administração, Saúde, Kids)
    if (botoesFiltro.length > 0) {
        botoesFiltro.forEach((botaoClicado) => {
            botaoClicado.addEventListener("click", () => {
                botoesFiltro.forEach((btn) => btn.classList.remove("ativo"));
                botaoClicado.classList.add("ativo");

                const categoriaSelecionada = botaoClicado.getAttribute("data-categoria") || "todos";
                if (categoriaSelecionada === "todos" && inputBusca) {
                    inputBusca.value = "";
                }

                filtrarCursos({
                    termo: inputBusca ? inputBusca.value : "",
                    categoria: categoriaSelecionada,
                    rolarParaResultado: false
                });
            });
        });
    }

    // Botão "Mostrar Todos os Cursos" quando uma busca não encontra resultados
    if (btnLimparBusca) {
        btnLimparBusca.addEventListener("click", () => {
            if (inputBusca) inputBusca.value = "";
            botoesFiltro.forEach((btn) => btn.classList.remove("ativo"));
            const btnTodos = document.querySelector('.btn-filtro[data-categoria="todos"]');
            if (btnTodos) btnTodos.classList.add("ativo");

            filtrarCursos({ termo: "", categoria: "todos", rolarParaResultado: false });
        });
    }

    // 6. Modal Interativo de Detalhes do Curso ao clicar em "Ver Detalhes"
    const modalOverlay = document.getElementById("modal-detalhes-curso");
    const btnFecharModal = document.getElementById("btn-fechar-modal");
    const modalImg = document.getElementById("modal-curso-img");
    const modalBadge = document.getElementById("modal-curso-badge");
    const modalTitulo = document.getElementById("modal-curso-titulo");
    const modalDescricao = document.getElementById("modal-curso-descricao");
    const modalCarga = document.getElementById("modal-curso-carga");
    const modalListaModulos = document.getElementById("modal-curso-modulos");
    const modalBtnMatricula = document.getElementById("modal-btn-matricula");
    const modalBtnWhats = document.getElementById("modal-btn-whats");

    // Grade de módulos de cada curso (fácil de atualizar quando você enviar os módulos finais)
    const MODULOS_POR_CURSO = {
        "Informática Básica e Avançada": ["Introdução à Informática e Windows", "Digitação Profissional", "Microsoft Word Completo", "Microsoft Excel Básico e Avançado", "PowerPoint e Apresentações", "Internet, E-mail e Nuvem"],
        "Informática Básica": ["Introdução ao Computador e Windows", "Digitação e Atalhos", "Documentos no Microsoft Word", "Planilhas Básicas no Excel", "Apresentações no PowerPoint", "Navegação Segura na Internet"],
        "Informática Kids": ["Conhecendo o Computador de Forma Lúdica", "Desenho Digital e Criatividade", "Jogos Educativos e Raciocínio Lógico", "Primeiros Textos e Apresentações", "Segurança na Internet para Crianças"],
        "Web Designer": ["Fundamentos de UI/UX Design", "Estruturação com HTML5", "Estilização Moderna com CSS3", "Layouts Responsivos", "Interatividade com JavaScript", "Publicação de Sites"],
        "Designer Gráfico": ["Teoria das Cores e Tipografia", "Edição de Imagens com Photoshop", "Vetorização com Illustrator / CorelDRAW", "Criação de Logotipos e Identidade Visual", "Artes para Redes Sociais e Impressos"],
        "Criação de Games": ["Introdução ao Game Design", "Lógica de Programação para Jogos", "Modelagem de Cenários e Personagens 2D/3D", "Mecânicas, Física e Animações", "Publicação do Primeiro Jogo"],
        "Montagem e Manutenção de Computadores": ["Arquitetura de Hardware e Componentes", "Montagem Passo a Passo de PCs", "Diagnóstico e Manutenção Preventiva", "Formatação, BIOS e Sistemas Operacionais", "Redes Locais e Cabeamento"],
        "Linguagem e Programação de Computadores": ["Lógica de Programação e Algoritmos", "Estruturas de Dados e Controle", "Programação Orientada a Objetos", "Banco de Dados SQL", "Desenvolvimento de Sistemas Práticos"],
        "AutoCAD": ["Interface e Ferramentas de Precisão 2D", "Camadas (Layers), Blocos e Cotas", "Desenho de Plantas Baixas Arquitetônicas", "Modelagem Tridimensional (3D)", "Plotagem e Impressão Técnica"],
        "Logística Empresarial": ["Cadeia de Suprimentos (Supply Chain)", "Gestão e Controle de Estoque", "Recebimento, Armazenagem e Expedição", "Logística de Transporte e Distribuição", "Indicadores Operacionais"],
        "Telemarketing": ["Comunicação Assertiva ao Telefone", "Atendimento Ativo e Receptivo", "Técnicas de Abordagem e Vendas", "Contorno de Objeções e Fidelização", "Ética e Qualidade no Atendimento"],
        "Operador de Caixa": ["Abertura, Sangria e Fechamento de Caixa", "Operação de Sistemas PDV e Leitor Óptico", "Meios de Pagamento (Cartões, PIX, Espécie)", "Matemática Financeira e Troco Seguro", "Excelência no Atendimento ao Cliente"],
        "Atendente de Ótica": ["Anatomia Ocular Básica", "Leitura e Interpretação de Receitas", "Tipos de Lentes, Tratamentos e Filtros", "Visagismo e Escolha de Armações", "Técnicas de Vendas Consultivas em Ótica"],
        "Auxiliar de Consultório Odontológico": ["Anatomia Bucal e Dental", "Instrumentais e Materiais Odontológicos", "Biossegurança, Assepsia e Esterilização", "Apoio ao Cirurgião-Dentista a 4 Mãos", "Recepção e Agendamento Clínico"],
        "Auxiliar de Farmácia": ["Classificação e Formas Farmacêuticas", "Leitura de Receituários e Prescrições", "Armazenamento e Controle de Validade", "Noções de Farmacologia e Genéricos", "Atendimento Humanizado em Drogarias"],
        "Empreendedorismo": ["Mentalidade Empreendedora e Inovação", "Modelagem e Plano de Negócios (Canvas)", "Planejamento Financeiro e Precificação", "Marketing e Vendas para Pequenos Negócios", "Formalização (MEI) e Gestão Diária"],
        "Recepção Hoteleira": ["Rotinas de Check-in e Check-out", "Sistemas de Reservas e Governança", "Etiqueta Profissional e Hospitalidade", "Atendimento a Hóspedes e Eventos", "Gestão de Conflitos em Hotelaria"],
        "Cuidador de Idosos": ["Estatuto do Idoso e Ética Profissional", "Higiene, Conforto e Alimentação Assistida", "Mobilidade Segura e Prevenção de Quedas", "Administração de Rotinas e Medicação", "Primeiros Socorros e Atenção Humanizada"],
        "Auxiliar Veterinário": ["Anatomia e Fisiologia de Cães e Gatos", "Manejo, Contenção e Bem-Estar Animal", "Higiene, Calendário Vacinal e Parasitas", "Primeiros Socorros Veterinários", "Apoio em Consultórios e Pet Shops"],
        "Rotinas Administrativas": ["Organização de Escritórios e Arquivos", "Redação Empresarial e Documentos Oficiais", "Noções de Departamento Pessoal e RH", "Faturamento, Notas Fiscais e Financeiro", "Atendimento Corporativo"],
        "Gestão Empresarial": ["Administração Estratégica e Liderança", "Gestão de Pessoas e Equipes", "Gestão Financeira e Fluxo de Caixa", "Marketing Estratégico e Comercial", "Processos e Indicadores de Desempenho"],
        "Produção de Vídeos": ["Roteiro e Planejamento Audiovisual", "Enquadramento, Iluminação e Áudio", "Edição Profissional de Vídeo", "Trilha Sonora, Cortes e Efeitos Visuais", "Exportação para YouTube, Reels e TikTok"],
        "Gestão de TI": ["Governança de TI e Alinhamento Estratégico", "Gestão de Infraestrutura e Redes", "Segurança da Informação e LGPD", "Gestão de Projetos Ágeis (Scrum/Kanban)", "Suporte Técnico e Níveis de Serviço (SLA)"],
        "Inglês Interativo": ["Vocabulário Essencial do Dia a Dia", "Conversação e Pronúncia Prática", "Compreensão Auditiva (Listening)", "Leitura e Escrita Aplicada", "Inglês para Viagens e Mercado de Trabalho"]
    };

    function abrirModalDetalhes(card) {
        if (!modalOverlay) return;

        const titulo = card.querySelector("h3")?.textContent.trim() || "";
        const badge = card.querySelector(".curso-badge")?.textContent.trim() || "";
        const descricao = card.querySelector(".card-descricao")?.textContent.trim() || "";
        const imgEl = card.querySelector(".card-img-wrapper img");
        const metaCargaTexto = card.querySelector(".meta-item")?.textContent.replace("Carga Horária:", "").trim() || "A definir";

        if (modalTitulo) modalTitulo.textContent = titulo;
        if (modalBadge) modalBadge.textContent = badge;
        if (modalDescricao) modalDescricao.textContent = descricao;
        if (modalCarga) modalCarga.textContent = metaCargaTexto;

        if (modalImg && imgEl) {
            modalImg.src = imgEl.src;
            modalImg.alt = imgEl.alt;
        }

        if (modalListaModulos) {
            const lista = MODULOS_POR_CURSO[titulo] || ["Grade de módulos em atualização..."];
            modalListaModulos.innerHTML = lista.map((item) => `<li>${item}</li>`).join("");
        }

        if (modalBtnMatricula) {
            modalBtnMatricula.href = `contato.html?curso=${encodeURIComponent(titulo)}`;
        }

        if (modalBtnWhats) {
            modalBtnWhats.onclick = () => {
                enviarParaWhatsApp({
                    curso: titulo,
                    mensagem: `Olá! Vi os detalhes do curso presencial de *${titulo}* no site e gostaria de saber mais sobre turmas e valores.`
                });
            };
        }

        modalOverlay.classList.add("aberto");
        modalOverlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function fecharModalDetalhes() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove("aberto");
        modalOverlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Intercepta o clique nos botões "Ver Detalhes" dentro dos cards do catálogo
    const botoesVerDetalhes = document.querySelectorAll(".curso-card .btn-card-detalhes");
    botoesVerDetalhes.forEach((botao) => {
        botao.addEventListener("click", (evento) => {
            evento.preventDefault();
            const card = botao.closest(".curso-card");
            if (card) {
                abrirModalDetalhes(card);
            }
        });
    });

    if (btnFecharModal) {
        btnFecharModal.addEventListener("click", fecharModalDetalhes);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (evento) => {
            if (evento.target === modalOverlay) {
                fecharModalDetalhes();
            }
        });
    }

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && modalOverlay?.classList.contains("aberto")) {
            fecharModalDetalhes();
        }
    });
});
