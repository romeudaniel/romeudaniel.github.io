/* =========================================================
   ROMEU DANIEL — ARTIGOS.JS
   Sistema completo de artigos

   Responsabilidades:
   - Carregar artigos.json
   - Criar cards
   - Pesquisa
   - Filtro por categoria
   - Abrir artigo individual
   - Renderizar conteúdo
   - Renderizar imagens
   - Renderizar tags
   - Artigos relacionados
   - Artigo anterior / próximo
========================================================= */


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const ARTIGOS_JSON = "../data/artigos.json";


/* =========================================================
   ESTADO GLOBAL
========================================================= */

let artigos = [];

let artigosFiltrados = [];


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    carregarArtigos();

});


/* =========================================================
   CARREGAR JSON
========================================================= */

async function carregarArtigos() {

    try {

        const resposta =
            await fetch(ARTIGOS_JSON);


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        /*
         * Aceita tanto:
         *
         * {
         *   "artigos": [...]
         * }
         *
         * como:
         *
         * [...]
         */

        if (Array.isArray(dados)) {

            artigos = dados;

        } else {

            artigos =
                dados.artigos || [];

        }


        artigosFiltrados =
            [...artigos];


        /*
         * Decide automaticamente
         * qual página está aberta.
         */

        if (
            document.getElementById(
                "articles-container"
            )
        ) {

            inicializarPaginaArtigos();

        }


        if (
            document.getElementById(
                "article-title"
            )
        ) {

            inicializarArtigoIndividual();

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar artigos:",
            erro
        );


        mostrarErroArtigos();

    }

}


/* =========================================================
   PÁGINA DE LISTAGEM DE ARTIGOS
========================================================= */

function inicializarPaginaArtigos() {

    renderizarArtigos(
        artigosFiltrados
    );


    inicializarPesquisa();


    inicializarCategorias();

}


/* =========================================================
   RENDERIZAR CARDS
========================================================= */

function renderizarArtigos(lista) {

    const container =
        document.getElementById(
            "articles-container"
        );


    const emptyMessage =
        document.getElementById(
            "articles-empty"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    /*
     * Nenhum resultado
     */

    if (!lista.length) {

        if (emptyMessage) {
            emptyMessage.hidden = false;
        }

        return;

    }


    if (emptyMessage) {
        emptyMessage.hidden = true;
    }


    /*
     * Criar cards
     */

    lista.forEach(artigo => {

        const card =
            criarCardArtigo(artigo);

        container.appendChild(card);

    });

}


/* =========================================================
   CRIAR CARD DE ARTIGO
========================================================= */

function criarCardArtigo(artigo) {

    const article =
        document.createElement("article");


    article.className =
        "content-card article-card";


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
        artigo.imagemPrincipal ||
        artigo.imagem ||
        "../images/artigos/placeholder.webp";


    image.alt =
        artigo.titulo || "Imagem do artigo";


    image.loading =
        "lazy";


    imageContainer.appendChild(
        image
    );


    /* =====================================================
       CONTEÚDO
    ====================================================== */

    const content =
        document.createElement("div");


    content.className =
        "card-content";


    /* Categoria */

    const category =
        document.createElement("span");


    category.className =
        "card-category";


    category.textContent =
        artigo.categoria || "";


    /* Título */

    const title =
        document.createElement("h3");


    title.textContent =
        artigo.titulo || "Sem título";


    /* Descrição */

    const description =
        document.createElement("p");


    description.textContent =
        artigo.descricao || "";


    /* =====================================================
       META
    ====================================================== */

    const meta =
        document.createElement("div");


    meta.className =
        "card-meta";


    const date =
        document.createElement("span");


    date.textContent =
        formatarData(
            artigo.data
        );


    meta.appendChild(
        date
    );


    /*
     * Tempo de leitura
     */

    if (artigo.tempoLeitura) {

        const separator =
            document.createTextNode(" • ");


        const readingTime =
            document.createElement("span");


        readingTime.textContent =
            artigo.tempoLeitura;


        meta.appendChild(
            separator
        );


        meta.appendChild(
            readingTime
        );

    }


    /* =====================================================
       LINK
    ====================================================== */

    const link =
        document.createElement("a");


    link.className =
        "text-link";


    link.href =
        criarURLArtigo(artigo);


    link.textContent =
        "Ler artigo →";


    /* =====================================================
       MONTAGEM
    ====================================================== */

    content.appendChild(
        category
    );


    content.appendChild(
        title
    );


    content.appendChild(
        description
    );


    content.appendChild(
        meta
    );


    content.appendChild(
        link
    );


    article.appendChild(
        imageContainer
    );


    article.appendChild(
        content
    );


    return article;

}


/* =========================================================
   URL DO ARTIGO
========================================================= */

function criarURLArtigo(artigo) {
    
    const estaNaPastaPages =
        window.location.pathname.includes("/pages/");
    
    const caminho =
        estaNaPastaPages ?
        "artigo.html" :
        "pages/artigo.html";
    
    return `${caminho}?id=${encodeURIComponent(artigo.id)}`;
    
}


/* =========================================================
   PESQUISA
========================================================= */

function inicializarPesquisa() {

    const input =
        document.getElementById(
            "article-search"
        );


    const button =
        document.getElementById(
            "search-button"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        executarPesquisa
    );


    if (button) {

        button.addEventListener(
            "click",
            executarPesquisa
        );

    }

}


/* =========================================================
   EXECUTAR PESQUISA
========================================================= */

function executarPesquisa() {

    const input =
        document.getElementById(
            "article-search"
        );


    if (!input) {
        return;
    }


    const termo =
        normalizarTexto(
            input.value.trim()
        );


    if (!termo) {

        artigosFiltrados =
            [...artigos];


        renderizarArtigos(
            artigosFiltrados
        );


        return;

    }


    artigosFiltrados =
        artigos.filter(artigo => {


            const textoPesquisa = [

                artigo.titulo,

                artigo.descricao,

                artigo.categoria,

                artigo.autor,

                ...(artigo.tags || [])

            ]
                .filter(Boolean)
                .join(" ");


            return normalizarTexto(
                textoPesquisa
            ).includes(termo);

        });


    renderizarArtigos(
        artigosFiltrados
    );

}


/* =========================================================
   CATEGORIAS
========================================================= */

function inicializarCategorias() {

    const buttons =
        document.querySelectorAll(
            ".category-button"
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

                    artigosFiltrados =
                        [...artigos];

                } else {

                    artigosFiltrados =
                        artigos.filter(
                            artigo =>
                                normalizarTexto(
                                    artigo.categoria || ""
                                ) ===
                                normalizarTexto(
                                    categoria
                                )
                        );

                }


                renderizarArtigos(
                    artigosFiltrados
                );

            }
        );

    });

}


/* =========================================================
   ARTIGO INDIVIDUAL
========================================================= */

function inicializarArtigoIndividual() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get("id");


    if (!id) {

        mostrarArtigoNaoEncontrado();

        return;

    }


    /*
     * Procura pelo ID.
     */

    const artigo =
        artigos.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!artigo) {

        mostrarArtigoNaoEncontrado();

        return;

    }


    /*
     * Preencher página
     */

    renderizarArtigoIndividual(
        artigo
    );


    /*
     * Artigos relacionados
     */

    renderizarArtigosRelacionados(
        artigo
    );


    /*
     * Navegação anterior / próximo
     */

    renderizarNavegacaoArtigos(
        artigo
    );

}


/* =========================================================
   RENDERIZAR ARTIGO INDIVIDUAL
========================================================= */

function renderizarArtigoIndividual(
    artigo
) {


    /* =====================================================
       TÍTULO DA PÁGINA
    ====================================================== */

    const pageTitle =
        document.getElementById(
            "article-page-title"
        );


    if (pageTitle) {

        pageTitle.textContent =
            `${artigo.titulo} | Romeu Daniel`;

    }


    /* =====================================================
       META DESCRIPTION
    ====================================================== */

    const metaDescription =
        document.getElementById(
            "article-meta-description"
        );


    if (metaDescription) {

        metaDescription.setAttribute(
            "content",
            artigo.descricao || ""
        );

    }


    /* =====================================================
       CATEGORIA
    ====================================================== */

    definirTexto(
        "article-category",
        artigo.categoria
    );


    /* =====================================================
       TÍTULO
    ====================================================== */

    definirTexto(
        "article-title",
        artigo.titulo
    );


    /* =====================================================
       INTRODUÇÃO / RESUMO
    ====================================================== */

    definirTexto(
        "article-intro",
        artigo.descricao
    );


    /* =====================================================
       AUTOR
    ====================================================== */

    definirTexto(
        "article-author",
        artigo.autor || "Romeu Daniel"
    );


    /* =====================================================
       DATA
    ====================================================== */

    definirTexto(
        "article-date",
        formatarData(
            artigo.data
        )
    );


    /* =====================================================
       TEMPO DE LEITURA
    ====================================================== */

    definirTexto(
        "article-reading-time",
        artigo.tempoLeitura
            ? `${artigo.tempoLeitura} de leitura`
            : ""
    );


    /* =====================================================
       DATA DE ATUALIZAÇÃO
    ====================================================== */

    const updated =
        document.getElementById(
            "article-updated"
        );


    if (
        updated &&
        artigo.dataAtualizacao
    ) {

        updated.textContent =
            `Atualizado em ${formatarData(
                artigo.dataAtualizacao
            )}`;


        updated.hidden = false;

    }


    /* =====================================================
       IMAGEM PRINCIPAL
    ====================================================== */

    const image =
        document.getElementById(
            "article-image"
        );


    if (image) {

        image.src =
            artigo.imagemPrincipal ||
            artigo.imagem ||
            "";


        image.alt =
            artigo.titulo || "";


        image.loading =
            "eager";

    }


    /* =====================================================
       INTRODUÇÃO
    ====================================================== */

    const introduction =
        document.getElementById(
            "article-introduction"
        );


    if (introduction) {

        introduction.innerHTML = "";


        adicionarParagrafos(
            introduction,
            artigo.introducao
        );

    }


    /* =====================================================
       CONTEÚDO
    ====================================================== */

    const content =
        document.getElementById(
            "article-content"
        );


    if (content) {

        content.innerHTML = "";


        renderizarConteudo(
            content,
            artigo.conteudo
        );

    }


    /* =====================================================
       CONCLUSÃO
    ====================================================== */

    const conclusion =
        document.getElementById(
            "article-conclusion"
        );


    if (conclusion) {

        conclusion.innerHTML = "";


        adicionarParagrafos(
            conclusion,
            artigo.conclusao
        );

    }
    const finalSections =
    document.getElementById("article-final-sections");

if (finalSections) {
    finalSections.innerHTML = "";
    
    renderizarConteudo(
        finalSections,
        artigo.secoesFinais
    );
}


    /* =====================================================
       TAGS
    ====================================================== */

    renderizarTags(
        artigo.tags
    );

}


/* =========================================================
   RENDERIZAR CONTEÚDO
========================================================= */

function renderizarConteudo(
    container,
    conteudo
) {

    if (!Array.isArray(conteudo)) {
        return;
    }


    conteudo.forEach(secao => {

        /*
         * Cada objeto representa
         * uma seção do artigo.
         */

        const section =
            document.createElement(
                "section"
            );


        section.className =
            "article-section";


        /* =================================================
           SUBTÍTULO
        ================================================== */

        if (secao.titulo) {

            const heading =
                document.createElement(
                    "h2"
                );


            heading.textContent =
                secao.titulo;


            section.appendChild(
                heading
            );

        }


        /* =================================================
           PARÁGRAFOS
        ================================================== */

        if (
            Array.isArray(
                secao.paragrafos
            )
        ) {

            adicionarParagrafos(
                section,
                secao.paragrafos
            );

        }


        /* =================================================
           IMAGENS
        ================================================== */
        if (
            Array.isArray(
                secao.imagens
            )
        ) {

            secao.imagens.forEach(
                imagem => {

                    const figure =
                        criarImagemArtigo(
                            imagem
                        );


                    if (figure) {

                        section.appendChild(
                            figure
                        );

                    }

                }
            );

        }


        /* =================================================
           LISTA
        ================================================== */

        if (
            Array.isArray(
                secao.lista
            )
        ) {

            const list =
                document.createElement(
                    "ul"
                );


            secao.lista.forEach(
                item => {

                    const li =
                        document.createElement(
                            "li"
                        );


                    li.textContent =
                        item;


                    list.appendChild(
                        li
                    );

                }
            );


            section.appendChild(
                list
            );

        }


        /* =================================================
           CÓDIGO
        ================================================== */

        if (secao.codigo) {

            const pre =
                document.createElement(
                    "pre"
                );


            const code =
                document.createElement(
                    "code"
                );


            code.textContent =
                secao.codigo;


            pre.appendChild(
                code
            );


            section.appendChild(
                pre
            );

        }


        container.appendChild(
            section
        );

    });

}


/* =========================================================
   CRIAR IMAGEM
========================================================= */

function criarImagemArtigo(
    imagem
) {

    if (!imagem || !imagem.src) {
        return null;
    }


    const figure =
        document.createElement(
            "figure"
        );


    figure.className =
        "article-image";


    const img =
        document.createElement(
            "img"
        );


    img.src =
        imagem.src;


    img.alt =
        imagem.alt || "";


    img.loading =
        "lazy";


    figure.appendChild(
        img
    );


    /*
     * Legenda
     */

    if (imagem.legenda) {

        const caption =
            document.createElement(
                "figcaption"
            );


        caption.textContent =
            imagem.legenda;


        figure.appendChild(
            caption
        );

    }


    return figure;

}


/* =========================================================
   PARÁGRAFOS
========================================================= */

function adicionarParagrafos(
    container,
    texto
) {

    if (!texto) {
        return;
    }


    /*
     * Se for array:
     *
     * ["Parágrafo 1", "Parágrafo 2"]
     */

    if (Array.isArray(texto)) {

        texto.forEach(
            paragrafo => {

                adicionarParagrafo(
                    container,
                    paragrafo
                );

            }
        );


        return;

    }


    /*
     * Se for texto único.
     *
     * Também permite separar
     * parágrafos através de
     * quebras de linha.
     */

    const paragrafos =
        String(texto)
            .split(/\n\s*\n/);


    paragrafos.forEach(
        paragrafo => {

            adicionarParagrafo(
                container,
                paragrafo
            );

        }
    );

}


/* =========================================================
   ADICIONAR PARÁGRAFO
========================================================= */

function adicionarParagrafo(
    container,
    texto
) {

    if (!texto) {
        return;
    }


    const paragraph =
        document.createElement(
            "p"
        );


    paragraph.textContent =
        texto;


    container.appendChild(
        paragraph
    );

}


/* =========================================================
   TAGS
========================================================= */

function renderizarTags(
    tags
) {

    const container =
        document.getElementById(
            "article-tags"
        );


    const section =
        document.getElementById(
            "article-tags-section"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(tags) ||
        !tags.length
    ) {

        if (section) {
            section.hidden = true;
        }

        return;

    }


    if (section) {
        section.hidden = false;
    }


    tags.forEach(tag => {

        const element =
            document.createElement(
                "span"
            );


        element.className =
            "article-tag";


        element.textContent =
            `#${tag}`;


        container.appendChild(
            element
        );

    });

}


/* =========================================================
   ARTIGOS RELACIONADOS
========================================================= */

function renderizarArtigosRelacionados(
    artigoAtual
) {

    const container =
        document.getElementById(
            "related-articles-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    let relacionados = [];


    /*
     * Primeiro tenta utilizar
     * os IDs definidos no JSON.
     */

    if (
        Array.isArray(
            artigoAtual.artigosRelacionados
        )
    ) {

        relacionados =
            artigoAtual.artigosRelacionados
                .map(id =>
                    artigos.find(
                        artigo =>
                            String(artigo.id) ===
                            String(id)
                    )
                )
                .filter(Boolean);

    }


    /*
     * Se não houver relacionados
     * definidos, procura automaticamente
     * pela mesma categoria.
     */

    if (!relacionados.length) {

        relacionados =
            artigos.filter(artigo =>

                String(artigo.id) !==
                String(artigoAtual.id)

                &&

                normalizarTexto(
                    artigo.categoria || ""
                ) ===
                normalizarTexto(
                    artigoAtual.categoria || ""
                )

            ).slice(0, 3);

    }


    /*
     * Limita a 3 artigos.
     */

    relacionados =
        relacionados.slice(0, 3);


    relacionados.forEach(
        artigo => {

            const card =
                criarCardRelacionado(
                    artigo
                );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CARD RELACIONADO
========================================================= */

function criarCardRelacionado(
    artigo
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "content-card article-card";


    /* Imagem */

    const imageContainer =
        document.createElement(
            "div"
        );


    imageContainer.className =
        "card-image";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        artigo.imagemPrincipal ||
        artigo.imagem ||
        "";


    image.alt =
        artigo.titulo || "";


    image.loading =
        "lazy";


    imageContainer.appendChild(
        image
    );


    /* Conteúdo */

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "card-content";


    const category =
        document.createElement(
            "span"
        );


    category.className =
        "card-category";


    category.textContent =
        artigo.categoria || "";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        artigo.titulo || "";


    const description =
        document.createElement(
            "p"
        );


    description.textContent =
        artigo.descricao || "";


    const link =
        document.createElement(
            "a"
        );


    link.className =
        "text-link";


    link.href =
        `artigo.html?id=${encodeURIComponent(
            artigo.id
        )}`;


    link.textContent =
        "Ler artigo →";


    content.appendChild(
        category
    );


    content.appendChild(
        title
    );


    content.appendChild(
        description
    );


    content.appendChild(
        link
    );


    article.appendChild(
        imageContainer
    );


    article.appendChild(
        content
    );


    return article;

}


/* =========================================================
   NAVEGAÇÃO ENTRE ARTIGOS
========================================================= */

function renderizarNavegacaoArtigos(
    artigoAtual
) {

    const previous =
        document.getElementById(
            "previous-article"
        );


    const next =
        document.getElementById(
            "next-article"
        );


    const previousTitle =
        document.getElementById(
            "previous-article-title"
        );


    const nextTitle =
        document.getElementById(
            "next-article-title"
        );


    const index =
        artigos.findIndex(
            artigo =>
                String(artigo.id) ===
                String(artigoAtual.id)
        );


    if (index === -1) {
        return;
    }


    /*
     * Artigo anterior
     */

    if (
        index > 0 &&
        previous
    ) {

        const artigoAnterior =
            artigos[index - 1];


        previous.href =
            criarURLArtigo(
                artigoAnterior
            );


        if (previousTitle) {

            previousTitle.textContent =
                artigoAnterior.titulo;

        }


        previous.hidden = false;

    }


    /*
     * Próximo artigo
     */

    if (
        index < artigos.length - 1 &&
        next
    ) {

        const proximoArtigo =
            artigos[index + 1];


        next.href =
            criarURLArtigo(
                proximoArtigo
            );


        if (nextTitle) {

            nextTitle.textContent =
                proximoArtigo.titulo;

        }


        next.hidden = false;

    }

}


/* =========================================================
   ARTIGO NÃO ENCONTRADO
========================================================= */

function mostrarArtigoNaoEncontrado() {

    const title =
        document.getElementById(
            "article-title"
        );


    if (title) {

        title.textContent =
            "Artigo não encontrado";

    }


    const intro =
        document.getElementById(
            "article-intro"
        );


    if (intro) {

        intro.textContent =
            "O artigo que procura não existe ou foi removido.";

    }


    const content =
        document.getElementById(
            "article-content"
        );


    if (content) {

        content.innerHTML = `
            <section class="article-section">
                <p>
                    Verifique o endereço ou volte
                    para a página de artigos.
                </p>

                <a
                    href="artigos.html"
                    class="text-link"
                >
                    ← Voltar para artigos
                </a>
            </section>
        `;

    }

}


/* =========================================================
   ERRO AO CARREGAR
========================================================= */

function mostrarErroArtigos() {

    const container =
        document.getElementById(
            "articles-container"
        );


    if (container) {

        container.innerHTML = `
            <div class="articles-error">
                <h3>
                    Não foi possível carregar os artigos.
                </h3>

                <p>
                    Tente novamente mais tarde.
                </p>
            </div>
        `;

    }


    const articleTitle =
        document.getElementById(
            "article-title"
        );


    if (articleTitle) {

        articleTitle.textContent =
            "Não foi possível carregar o artigo.";

    }

}


/* =========================================================
   TEXTO
========================================================= */

function definirTexto(
    id,
    texto
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        texto || "";

}


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(
    texto
) {

    return String(texto || "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase();

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(
    data
) {

    if (!data) {
        return "";
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
