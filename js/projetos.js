/* =========================================================
   ROMEU DANIEL — PROJETOS.JS
   Sistema de projetos
   Compatível com projetos.html e projeto.html
========================================================= */


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const PROJETOS_JSON = "../data/projetos.json";


/* =========================================================
   ESTADO
========================================================= */

let projetos = [];

let projetosFiltrados = [];


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    carregarProjetos();

});


/* =========================================================
   CARREGAR PROJETOS
========================================================= */

async function carregarProjetos() {

    try {

        const resposta =
            await fetch(PROJETOS_JSON);

        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }

        const dados =
            await resposta.json();

        projetos =
            Array.isArray(dados.projetos)
                ? dados.projetos
                : [];

        projetosFiltrados =
            [...projetos];


        /*
         * Verifica em que página estamos.
         *
         * projetos.html:
         * renderiza a lista.
         *
         * projeto.html:
         * carrega os detalhes de um projeto.
         */

        if (
            document.getElementById(
                "projects-container"
            )
        ) {

            inicializarPaginaProjetos();

        }


        if (
            document.getElementById(
                "project-title"
            )
        ) {

            inicializarPaginaProjeto();

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar projetos:",
            erro
        );

        mostrarErroProjetos();

    }

}


/* =========================================================
   PÁGINA — PROJETOS.HTML
========================================================= */

function inicializarPaginaProjetos() {

    const container =
        document.getElementById(
            "projects-container"
        );


    if (container) {

        renderizarProjetos(
            projetosFiltrados
        );

    }


    inicializarCategorias();

}


/* =========================================================
   RENDERIZAR LISTA DE PROJETOS
========================================================= */

function renderizarProjetos(lista) {

    const container =
        document.getElementById(
            "projects-container"
        );


    const emptyMessage =
        document.getElementById(
            "projects-empty"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!lista.length) {

        if (emptyMessage) {

            emptyMessage.hidden = false;

        }

        return;

    }


    if (emptyMessage) {

        emptyMessage.hidden = true;

    }


    lista.forEach(projeto => {

        const card =
            criarCardProjeto(projeto);

        container.appendChild(card);

    });

}


/* =========================================================
   CRIAR CARD
========================================================= */

function criarCardProjeto(projeto) {

    const article =
        document.createElement("article");

    article.className =
        "content-card project-card";


    /* =====================================================
       IMAGEM
    ====================================================== */

    const imageContainer =
        document.createElement("div");

    imageContainer.className =
        "card-image";


    const image =
        document.createElement("img");


    image.src =
        projeto.imagemPrincipal ||
        "../images/projetos/placeholder.webp";


    image.alt =
        projeto.titulo ||
        "Projeto";


    image.loading =
        "lazy";


    imageContainer.appendChild(image);


    /* =====================================================
       CONTEÚDO
    ====================================================== */

    const content =
        document.createElement("div");

    content.className =
        "card-content";


    /* =====================================================
       CATEGORIA
    ====================================================== */

    if (projeto.categoria) {

        const category =
            document.createElement("span");

        category.className =
            "card-category";

        category.textContent =
            projeto.categoria;

        content.appendChild(category);

    }


    /* =====================================================
       TÍTULO
    ====================================================== */

    const title =
        document.createElement("h3");

    title.textContent =
        projeto.titulo ||
        "Projeto sem título";


    content.appendChild(title);


    /* =====================================================
       DESCRIÇÃO
    ====================================================== */

    if (projeto.descricao) {

        const description =
            document.createElement("p");

        description.textContent =
            projeto.descricao;

        content.appendChild(description);

    }


    /* =====================================================
       TAGS
    ====================================================== */

    const technologies =
        document.createElement("div");

    technologies.className =
        "project-technologies";


    if (
        Array.isArray(projeto.tags) &&
        projeto.tags.length
    ) {

        projeto.tags.forEach(tagTexto => {

            const tag =
                document.createElement("span");

            tag.className =
                "technology-tag";

            tag.textContent =
                tagTexto;

            technologies.appendChild(tag);

        });

    }


    if (technologies.children.length) {

        content.appendChild(
            technologies
        );

    }


    /* =====================================================
       META
    ====================================================== */

    const meta =
        document.createElement("div");

    meta.className =
        "card-meta";


    if (projeto.data) {

        const date =
            document.createElement("span");

        date.textContent =
            formatarDataProjeto(
                projeto.data
            );

        meta.appendChild(date);

    }


    if (projeto.estado) {

        const status =
            document.createElement("span");

        status.textContent =
            projeto.estado;

        meta.appendChild(status);

    }


    if (meta.children.length) {

        content.appendChild(meta);

    }


    /* =====================================================
       LINK
    ====================================================== */

    const link =
        document.createElement("a");

    link.className =
        "text-link";


    link.href =
        projeto.url ||
        `projeto.html?id=${projeto.id}`;


    link.textContent =
        "Ver projeto →";


    content.appendChild(link);


    /* =====================================================
       MONTAGEM
    ====================================================== */

    article.appendChild(
        imageContainer
    );

    article.appendChild(
        content
    );


    return article;

}


/* =========================================================
   FILTRO POR CATEGORIA
========================================================= */

function inicializarCategorias() {

    const buttons =
        document.querySelectorAll(
            ".project-category-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                const categoria =
                    button.dataset.category;


                if (
                    !categoria ||
                    categoria === "todos"
                ) {

                    projetosFiltrados =
                        [...projetos];

                } else {

                    projetosFiltrados =
                        projetos.filter(
                            projeto =>
                                projeto.categoria ===
                                categoria
                        );

                }


                renderizarProjetos(
                    projetosFiltrados
                );

            }
        );

    });

}


/* =========================================================
   PÁGINA — PROJETO.HTML
========================================================= */

function inicializarPaginaProjeto() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get("id");


    if (!id) {

        mostrarErroProjeto(
            "Projeto não especificado."
        );

        return;

    }


    const projeto =
        projetos.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!projeto) {

        mostrarErroProjeto(
            "Projeto não encontrado."
        );

        return;

    }


    renderizarDetalhesProjeto(
        projeto
    );


    renderizarProjetosRelacionados(
        projeto
    );


    renderizarNavegacaoProjetos(
        projeto
    );

}


/* =========================================================
   RENDERIZAR DETALHES
========================================================= */

function renderizarDetalhesProjeto(
    projeto
) {

    /* =====================================================
       CABEÇALHO
    ====================================================== */

    definirTexto(
        "project-category",
        projeto.categoria
    );


    definirTexto(
        "project-title",
        projeto.titulo
    );


    definirTexto(
        "project-intro",
        projeto.descricao
    );


    definirTexto(
        "project-date",
        formatarDataProjeto(
            projeto.data
        )
    );


    definirTexto(
        "project-duration",
        obterDuracao(projeto)
    );


    definirTexto(
        "project-status",
        projeto.estado
    );


    /* =====================================================
       IMAGEM PRINCIPAL
    ====================================================== */

    const imagem =
        document.getElementById(
            "project-featured-image"
        );


    if (imagem) {

        imagem.src =
            projeto.imagemPrincipal ||
            "../images/projetos/placeholder.webp";


        imagem.alt =
            projeto.titulo ||
            "Imagem do projeto";

    }


    /* =====================================================
       INFORMAÇÕES LATERAIS
    ====================================================== */

    definirTexto(
        "project-area",
        projeto.categoria || "—"
    );


    definirTexto(
        "project-technologies",
        Array.isArray(projeto.tags) &&
        projeto.tags.length
            ? projeto.tags.join(", ")
            : "—"
    );


    definirTexto(
        "project-information-status",
        projeto.estado || "—"
    );


    /* =====================================================
       OBJETIVO
    ====================================================== */

    renderizarObjetivo(
        projeto.objetivo
    );


    /* =====================================================
       DESCRIÇÃO
    ====================================================== */

    renderizarDescricao(
        projeto.descricaoCompleta
    );


    /* =====================================================
       COMPONENTES
    ====================================================== */

    renderizarComponentes(
        projeto.componentes
    );


    /* =====================================================
       FUNCIONAMENTO
    ====================================================== */

    renderizarFuncionamento(
        projeto.funcionamento
    );


    /* =====================================================
       ESQUEMA
    ====================================================== */

    renderizarEsquema(
        projeto.esquema
    );


    /* =====================================================
       CÓDIGO
    ====================================================== */

    renderizarCodigo(
        projeto.codigo
    );


    /* =====================================================
       TESTES
    ====================================================== */

    renderizarTestes(
        projeto.testes
    );


    /* =====================================================
       RESULTADOS
    ====================================================== */

    renderizarResultados(
        projeto.resultados
    );


    /* =====================================================
       MELHORIAS FUTURAS
    ====================================================== */

    renderizarListaSecao(
        "project-future-section",
        "project-future-improvements",
        projeto.melhoriasFuturas
    );


    /* =====================================================
       APLICAÇÕES
    ====================================================== */

    renderizarListaSecao(
        "project-applications-section",
        "project-applications",
        projeto.aplicacoes
    );


    /* =====================================================
       CÁLCULOS
    ====================================================== */

    renderizarCalculos(
        projeto.calculos
    );


    /* =====================================================
       CRONOGRAMA
    ====================================================== */

    renderizarCronograma(
        projeto.cronograma
    );


    /* =====================================================
       EQUIPA
    ====================================================== */

    renderizarEquipa(
        projeto.equipa,
        projeto.orientador
    );

}


/* =========================================================
   OBJETIVO
========================================================= */

function renderizarObjetivo(
    objetivo
) {

    const section =
        document.getElementById(
            "project-objective-section"
        );


    if (
        !objetivo ||
        (
            !objetivo.geral &&
            !Array.isArray(objetivo.especificos)
        )
    ) {

        ocultar(section);

        return;

    }


    const geral =
        document.getElementById(
            "project-objective-general"
        );


    if (geral) {

        geral.textContent =
            objetivo.geral || "";

    }


    const lista =
        document.getElementById(
            "project-objective-specific"
        );


    if (lista) {

        lista.innerHTML = "";


        if (
            Array.isArray(
                objetivo.especificos
            )
        ) {

            objetivo.especificos.forEach(
                item => {

                    if (!item) {
                        return;
                    }


                    const li =
                        document.createElement(
                            "li"
                        );

                    li.textContent =
                        item;

                    lista.appendChild(li);

                }
            );

        }

    }


    mostrar(section);

}


/* =========================================================
   DESCRIÇÃO
========================================================= */

function renderizarDescricao(
    descricao
) {

    const section =
        document.getElementById(
            "project-description-section"
        );


    const container =
        document.getElementById(
            "project-description"
        );


    if (!descricao) {

        ocultar(section);

        return;

    }


    if (container) {

        container.innerHTML = "";


        const p =
            document.createElement("p");

        p.textContent =
            descricao;

        container.appendChild(p);

    }


    mostrar(section);

}


/* =========================================================
   COMPONENTES
========================================================= */

function renderizarComponentes(
    componentes
) {

    const section =
        document.getElementById(
            "project-components-section"
        );


    const container =
        document.getElementById(
            "project-components"
        );


    if (
        !Array.isArray(componentes) ||
        !componentes.length
    ) {

        ocultar(section);

        return;

    }


    if (!container) {
        return;
    }


    container.innerHTML = "";


    componentes.forEach(
        componente => {

            if (!componente) {
                return;
            }


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "project-component";


            const nome =
                document.createElement(
                    "h3"
                );

            nome.textContent =
                componente.nome ||
                "Componente";


            item.appendChild(nome);


            if (componente.quantidade !== null &&
                componente.quantidade !== undefined) {

                const quantidade =
                    document.createElement(
                        "p"
                    );

                quantidade.textContent =
                    `Quantidade: ${componente.quantidade}`;

                item.appendChild(
                    quantidade
                );

            }


            if (componente.funcao) {

                const funcao =
                    document.createElement(
                        "p"
                    );

                funcao.textContent =
                    componente.funcao;

                item.appendChild(
                    funcao
                );

            }


            container.appendChild(
                item
            );

        }
    );


    mostrar(section);

}


/* =========================================================
   FUNCIONAMENTO
========================================================= */

function renderizarFuncionamento(
    funcionamento
) {

    const section =
        document.getElementById(
            "project-function-section"
        );


    if (!funcionamento) {

        ocultar(section);

        return;

    }


    renderizarBlocoFuncionamento(
        funcionamento.irrigacao,
        "project-irrigation"
    );


    renderizarBlocoFuncionamento(
        funcionamento.iluminacao,
        "project-lighting"
    );


    renderizarBlocoFuncionamento(
        funcionamento.protecaoBomba,
        "project-pump-protection"
    );


    const algumBloco =
        funcionamento.irrigacao ||
        funcionamento.iluminacao ||
        funcionamento.protecaoBomba;


    if (!algumBloco) {

        ocultar(section);

    } else {

        mostrar(section);

    }

}


/* =========================================================
   BLOCO DE FUNCIONAMENTO
========================================================= */

function renderizarBlocoFuncionamento(
    dados,
    idBloco
) {

    const bloco =
        document.getElementById(
            idBloco
        );


    if (!bloco) {
        return;
    }


    if (!dados) {

        ocultar(bloco);

        return;

    }


    mostrar(bloco);


    const titulo =
        bloco.querySelector("h3");


    const descricao =
        bloco.querySelector("p");


    const fluxo =
        bloco.querySelector(
            ".project-flow"
        );


    if (titulo) {

        titulo.textContent =
            dados.titulo ||
            "";

    }


    if (descricao) {

        descricao.textContent =
            dados.descricao ||
            "";

    }


    if (fluxo) {

        fluxo.innerHTML = "";


        if (
            Array.isArray(
                dados.fluxo
            ) &&
            dados.fluxo.length
        ) {

            dados.fluxo.forEach(
                (etapa, indice) => {

                    const span =
                        document.createElement(
                            "span"
                        );

                    span.textContent =
                        etapa;

                    fluxo.appendChild(
                        span
                    );


                    if (
                        indice <
                        dados.fluxo.length - 1
                    ) {

                        const seta =
                            document.createElement(
                                "span"
                            );

                        seta.textContent =
                            " → ";

                        fluxo.appendChild(
                            seta
                        );

                    }

                }
            );

        }

    }

}


/* =========================================================
   ESQUEMA
========================================================= */

function renderizarEsquema(
    esquema
) {

    const section =
        document.getElementById(
            "project-scheme-section"
        );


    if (!esquema) {

        ocultar(section);

        return;

    }


    const descricao =
        document.getElementById(
            "project-scheme-description"
        );


    if (descricao) {

        descricao.textContent =
            esquema.descricao ||
            "";

    }


    const modules =
        document.getElementById(
            "project-scheme-modules"
        );


    if (modules) {

        modules.innerHTML = "";


        if (
            Array.isArray(
                esquema.modulos
            )
        ) {

            esquema.modulos.forEach(
                modulo => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "project-scheme-module";


                    const titulo =
                        document.createElement(
                            "h3"
                        );

                    titulo.textContent =
                        modulo.nome ||
                        "Módulo";


                    const fluxo =
                        document.createElement(
                            "p"
                        );

                    fluxo.textContent =
                        modulo.fluxo ||
                        "";


                    item.appendChild(
                        titulo
                    );

                    item.appendChild(
                        fluxo
                    );


                    modules.appendChild(
                        item
                    );

                }
            );

        }

    }


    const imagemContainer =
        document.getElementById(
            "project-scheme-image-container"
        );


    const imagem =
        document.getElementById(
            "project-scheme-image"
        );


    if (
        esquema.imagem &&
        imagem
    ) {

        imagem.src =
            esquema.imagem;

        imagem.alt =
            "Esquema do projeto";


        if (imagemContainer) {
            mostrar(imagemContainer);
        }

    } else if (imagemContainer) {

        ocultar(imagemContainer);

    }


    mostrar(section);

}


/* =========================================================
   CÓDIGO
========================================================= */

function renderizarCodigo(
    codigo
) {

    const section =
        document.getElementById(
            "project-code-section"
        );


    if (
        !codigo ||
        codigo.disponivel !== true
    ) {

        ocultar(section);

        return;

    }


    const descricao =
        document.getElementById(
            "project-code-description"
        );


    if (descricao) {

        descricao.textContent =
            codigo.descricao ||
            "";

    }


    const code =
        document.querySelector(
            "#project-code-content code"
        );


    if (code) {

        code.textContent =
            codigo.conteudo ||
            "";

    }


    mostrar(section);

}


/* =========================================================
   TESTES
========================================================= */

function renderizarTestes(
    testes
) {

    const section =
        document.getElementById(
            "project-tests-section"
        );


    if (!testes) {

        ocultar(section);

        return;

    }


    const descricao =
        document.getElementById(
            "project-tests-description"
        );


    if (descricao) {

        descricao.textContent =
            testes.descricao ||
            testes.estado ||
            "";

    }


    const lista =
        document.getElementById(
            "project-tests-list"
        );


    if (lista) {

        lista.innerHTML = "";


        if (
            Array.isArray(
                testes.testes
            ) &&
            testes.testes.length
        ) {

            testes.testes.forEach(
                teste => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "project-test";


                    if (typeof teste === "string") {

                        item.textContent =
                            teste;

                    } else {

                        const titulo =
                            document.createElement(
                                "h3"
                            );

                        titulo.textContent =
                            teste.nome ||
                            teste.titulo ||
                            "Teste";


                        item.appendChild(
                            titulo
                        );


                        if (teste.descricao) {

                            const p =
                                document.createElement(
                                    "p"
                                );

                            p.textContent =
                                teste.descricao;

                            item.appendChild(p);

                        }

                    }


                    lista.appendChild(
                        item
                    );

                }
            );

        }

    }


    /*
     * Se os testes não foram documentados,
     * ainda podemos mostrar a informação
     * existente no JSON.
     */

    mostrar(section);

}


/* =========================================================
   RESULTADOS
========================================================= */

function renderizarResultados(
    resultados
) {

    const section =
        document.getElementById(
            "project-results-section"
        );


    const lista =
        document.getElementById(
            "project-results"
        );


    if (
        !resultados ||
        !Array.isArray(
            resultados.itens
        ) ||
        !resultados.itens.length
    ) {

        ocultar(section);

        return;

    }


    const tipo =
        document.getElementById(
            "project-results-type"
        );


    if (tipo) {

        tipo.textContent =
            resultados.tipo ||
            "Resultados";

    }


    if (lista) {

        lista.innerHTML = "";


        resultados.itens.forEach(
            resultado => {

                const li =
                    document.createElement(
                        "li"
                    );

                li.textContent =
                    resultado;

                lista.appendChild(
                    li
                );

            }
        );

    }


    mostrar(section);

}


/* =========================================================
   LISTAS GENÉRICAS
========================================================= */

function renderizarListaSecao(
    idSecao,
    idLista,
    itens
) {

    const section =
        document.getElementById(
            idSecao
        );


    const lista =
        document.getElementById(
            idLista
        );


    if (
        !Array.isArray(itens) ||
        !itens.length
    ) {

        ocultar(section);

        return;

    }


    if (lista) {

        lista.innerHTML = "";


        itens.forEach(
            item => {

                const li =
                    document.createElement(
                        "li"
                    );

                li.textContent =
                    item;

                lista.appendChild(
                    li
                );

            }
        );

    }


    mostrar(section);

}


/* =========================================================
   CÁLCULOS
========================================================= */

function renderizarCalculos(
    calculos
) {

    const section =
        document.getElementById(
            "project-calculations-section"
        );


    const container =
        document.getElementById(
            "project-calculations"
        );


    if (!calculos) {

        ocultar(section);

        return;

    }


    const formula =
        document.getElementById(
            "project-calculation-formula"
        );


    if (formula) {

        formula.textContent =
            calculos.formula ||
            "";

    }


    if (container) {

        container.innerHTML = "";


        if (calculos.bomba) {

            adicionarCalculo(
                container,
                "Bomba",
                [
                    `Tensão: ${calculos.bomba.tensao || "—"}`,
                    `Corrente: ${calculos.bomba.corrente || "—"}`,
                    `Potência: ${calculos.bomba.potencia || "—"}`
                ]
            );

        }


        if (calculos.iluminacao) {

            adicionarCalculo(
                container,
                "Iluminação",
                [
                    `Quantidade: ${calculos.iluminacao.quantidade || "—"}`,
                    `Potência por lâmpada: ${calculos.iluminacao.potenciaPorLampada || "—"}`,
                    `Potência total: ${calculos.iluminacao.potenciaTotal || "—"}`
                ]
            );

        }


        if (calculos.potenciaTotal) {

            adicionarCalculo(
                container,
                "Potência total",
                [
                    calculos.potenciaTotal
                ]
            );

        }

    }


    mostrar(section);

}


/* =========================================================
   ADICIONAR BLOCO DE CÁLCULO
========================================================= */

function adicionarCalculo(
    container,
    tituloTexto,
    linhas
) {

    const bloco =
        document.createElement(
            "div"
        );

    bloco.className =
        "project-calculation";


    const titulo =
        document.createElement(
            "h3"
        );

    titulo.textContent =
        tituloTexto;


    bloco.appendChild(
        titulo
    );


    linhas.forEach(
        linha => {

            const p =
                document.createElement(
                    "p"
                );

            p.textContent =
                linha;

            bloco.appendChild(
                p
            );

        }
    );


    container.appendChild(
        bloco
    );

}


/* =========================================================
   CRONOGRAMA
========================================================= */

function renderizarCronograma(
    cronograma
) {

    const section =
        document.getElementById(
            "project-schedule-section"
        );


    const container =
        document.getElementById(
            "project-schedule"
        );


    if (
        !Array.isArray(cronograma) ||
        !cronograma.length
    ) {

        ocultar(section);

        return;

    }


    if (container) {

        container.innerHTML = "";


        cronograma.forEach(
            etapa => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "project-schedule-item";


                const numero =
                    document.createElement(
                        "strong"
                    );

                numero.textContent =
                    etapa.etapa ||
                    "";


                const atividade =
                    document.createElement(
                        "span"
                    );

                atividade.textContent =
                    etapa.atividade ||
                    "";


                const duracao =
                    document.createElement(
                        "span"
                    );

                duracao.textContent =
                    etapa.duracao ||
                    "";


                item.appendChild(
                    numero
                );

                item.appendChild(
                    atividade
                );

                item.appendChild(
                    duracao
                );


                container.appendChild(
                    item
                );

            }
        );

    }


    mostrar(section);

}


/* =========================================================
   EQUIPA
========================================================= */

function renderizarEquipa(
    equipa,
    orientador
) {

    const section =
        document.getElementById(
            "project-team-section"
        );


    const lista =
        document.getElementById(
            "project-team"
        );


    const temEquipa =
        Array.isArray(equipa) &&
        equipa.length;


    const temOrientador =
        Boolean(orientador);


    if (
        !temEquipa &&
        !temOrientador
    ) {

        ocultar(section);

        return;

    }


    if (lista) {

        lista.innerHTML = "";


        if (temEquipa) {

            equipa.forEach(
                membro => {

                    const li =
                        document.createElement(
                            "li"
                        );

                    li.textContent =
                        membro;

                    lista.appendChild(
                        li
                    );

                }
            );

        }

    }


    const advisor =
        document.getElementById(
            "project-advisor"
        );


    if (advisor) {

        if (temOrientador) {

            advisor.textContent =
                `Orientador: ${orientador}`;

        } else {

            advisor.textContent =
                "";

        }

    }


    mostrar(section);

}


/* =========================================================
   PROJETOS RELACIONADOS
========================================================= */

function renderizarProjetosRelacionados(
    projetoAtual
) {

    const container =
        document.getElementById(
            "related-projects-container"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const relacionados =
        projetos
            .filter(
                projeto =>
                    String(projeto.id) !==
                    String(projetoAtual.id)
            )
            .filter(
                projeto =>
                    projeto.categoria ===
                    projetoAtual.categoria
            )
            .slice(0, 3);


    /*
     * Se não houver projetos da mesma categoria,
     * utiliza outros projetos.
     */

    const listaFinal =
        relacionados.length
            ? relacionados
            : projetos
                .filter(
                    projeto =>
                        String(projeto.id) !==
                        String(projetoAtual.id)
                )
                .slice(0, 3);


    listaFinal.forEach(
        projeto => {

            const card =
                criarCardProjeto(
                    projeto
                );

            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   NAVEGAÇÃO ENTRE PROJETOS
========================================================= */

function renderizarNavegacaoProjetos(
    projetoAtual
) {

    const indice =
        projetos.findIndex(
            projeto =>
                String(projeto.id) ===
                String(projetoAtual.id)
        );


    if (indice === -1) {

        return;

    }


    const projetoAnterior =
        indice > 0
            ? projetos[indice - 1]
            : null;


    const proximoProjeto =
        indice <
        projetos.length - 1
            ? projetos[indice + 1]
            : null;


    const previousLink =
        document.getElementById(
            "previous-project"
        );


    const previousTitle =
        document.getElementById(
            "previous-project-title"
        );


    const nextLink =
        document.getElementById(
            "next-project"
        );


    const nextTitle =
        document.getElementById(
            "next-project-title"
        );


    if (projetoAnterior) {

        if (previousLink) {

            previousLink.href =
                obterUrlProjeto(
                    projetoAnterior
                );

        }


        if (previousTitle) {

            previousTitle.textContent =
                projetoAnterior.titulo;

        }

    } else {

        ocultar(previousLink);

    }


    if (proximoProjeto) {

        if (nextLink) {

            nextLink.href =
                obterUrlProjeto(
                    proximoProjeto
                );

        }


        if (nextTitle) {

            nextTitle.textContent =
                proximoProjeto.titulo;

        }

    } else {

        ocultar(nextLink);

    }

}


/* =========================================================
   URL DO PROJETO
========================================================= */

function obterUrlProjeto(
    projeto
) {

    return projeto.url ||
        `projeto.html?id=${projeto.id}`;

}


/* =========================================================
   DURAÇÃO
========================================================= */

function obterDuracao(
    projeto
) {

    if (
        !Array.isArray(
            projeto.cronograma
        ) ||
        !projeto.cronograma.length
    ) {

        return "";

    }


    return projeto.cronograma.length === 1
        ? "1 semana"
        : `${projeto.cronograma.length} semanas`;

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarDataProjeto(
    data
) {

    if (!data) {

        return "";

    }


    /*
     * Se for apenas o ano, como "2026",
     * não tentamos transformá-lo em
     * uma data completa.
     */

    if (
        /^\d{4}$/.test(
            String(data)
        )
    ) {

        return String(data);

    }


    const dataObj =
        new Date(
            data + "T00:00:00"
        );


    if (
        Number.isNaN(
            dataObj.getTime()
        )
    ) {

        return data;

    }


    return dataObj.toLocaleDateString(
        "pt-PT",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   DEFINIR TEXTO
========================================================= */

function definirTexto(
    id,
    texto
) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        return;

    }


    elemento.textContent =
        texto || "";

}


/* =========================================================
   MOSTRAR ELEMENTO
========================================================= */

function mostrar(
    elemento
) {

    if (!elemento) {

        return;

    }


    elemento.hidden = false;

    elemento.style.display = "";

}


/* =========================================================
   OCULTAR ELEMENTO
========================================================= */

function ocultar(
    elemento
) {

    if (!elemento) {

        return;

    }


    elemento.hidden = true;

    elemento.style.display = "none";

}

