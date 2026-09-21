/* =========================================================
   ROMEU DANIEL — PROJETOS.JS
   Sistema de projetos
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
            dados.projetos || [];

        projetosFiltrados =
            [...projetos];

        inicializarSistemaProjetos();

    } catch (erro) {

        console.error(
            "Erro ao carregar projetos:",
            erro
        );

        mostrarErroProjetos();

    }

}


/* =========================================================
   INICIALIZAR SISTEMA
========================================================= */

function inicializarSistemaProjetos() {

    const container =
        document.getElementById("projects-container");

    if (container) {

        renderizarProjetos(
            projetosFiltrados
        );

    }


    inicializarCategorias();

}


/* =========================================================
   RENDERIZAR PROJETOS
========================================================= */

function renderizarProjetos(lista) {

    const container =
        document.getElementById("projects-container");


    const emptyMessage =
        document.getElementById("projects-empty");


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
        projeto.imagem;

    image.alt =
        projeto.nome;

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


    /* Categoria */

    const category =
        document.createElement("span");

    category.className =
        "card-category";

    category.textContent =
        projeto.categoria;


    /* Nome */

    const title =
        document.createElement("h3");

    title.textContent =
        projeto.nome;


    /* Descrição */

    const description =
        document.createElement("p");

    description.textContent =
        projeto.descricao;


    /* =====================================================
       TECNOLOGIAS
    ====================================================== */

    const technologies =
        document.createElement("div");

    technologies.className =
        "project-technologies";


    if (
        projeto.tecnologias &&
        projeto.tecnologias.length
    ) {

        projeto.tecnologias
            .forEach(tecnologia => {

                const tag =
                    document.createElement("span");

                tag.className =
                    "technology-tag";

                tag.textContent =
                    tecnologia;

                technologies.appendChild(tag);

            });

    }


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
        formatarDataProjeto(
            projeto.data
        );


    meta.appendChild(date);


    /* =====================================================
       LINK
    ====================================================== */

    const link =
        document.createElement("a");

    link.className =
        "text-link";

    link.href =
        projeto.url;

    link.textContent =
        "Ver projeto →";


    /* =====================================================
       MONTAGEM
    ====================================================== */

    content.appendChild(category);

    content.appendChild(title);

    content.appendChild(description);

    content.appendChild(technologies);

    content.appendChild(meta);

    content.appendChild(link);


    article.appendChild(imageContainer);

    article.appendChild(content);


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
                                projeto.categoria === categoria
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
   FORMATAR DATA
========================================================= */

function formatarDataProjeto(data) {

    if (!data) {
        return "";
    }


    const dataObj =
        new Date(data + "T00:00:00");


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
   ERRO
========================================================= */

function mostrarErroProjetos() {

    const container =
        document.getElementById(
            "projects-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="projects-error">
            <h3>Não foi possível carregar os projetos.</h3>
            <p>
                Tente novamente mais tarde.
            </p>
        </div>
    `;

}