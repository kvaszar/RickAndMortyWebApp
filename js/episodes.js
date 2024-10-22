//Getting pages count
let currentPage = 1;
let maxPage = 1;
fetch(`https://rickandmortyapi.com/api/location`)
    .then((resp) => resp.json())
    .then((json) => (maxPage = json.info.pages));
//Getting pages count

const container = document.querySelector("#episodes");

const searchName = document.querySelector("#search_name");

const pages = document.querySelector("#pages");
const pagesNumbers = pages.querySelector("div");
const prev = pages.querySelectorAll(".arrow")[0];
const next = pages.querySelectorAll(".arrow")[1];

searchName.addEventListener("change", () => {
    LoadPage(currentPage);
});

LoadPage(currentPage);

pagesNumbers.firstElementChild.classList.add("active");
pagesNumbers.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.nodeName !== "BUTTON") return;
    currentPage = Number(e.target.innerHTML);
    LoadPage(currentPage);
    ChangePageNumbers(currentPage, maxPage, pagesNumbers);
});
prev.addEventListener("click", () => {
    currentPage = currentPage > 1 ? currentPage - 1 : maxPage;
    LoadPage(currentPage);
    ChangePageNumbers(currentPage, maxPage, pagesNumbers);
});
next.addEventListener("click", () => {
    currentPage = currentPage < maxPage ? currentPage + 1 : 1;
    LoadPage(currentPage);
    ChangePageNumbers(currentPage, maxPage, pagesNumbers);
});

async function LoadPage(page) {
    const name = searchName.value;
    const eps = await GetEpisodes(page, name);
    const htmls = await GenerateHTML(eps);
    ClearHTML(container);
    for (let html of htmls) RenderHTML(html, container);
    AddFavEvents(container);
}
function ClearHTML(container) {
    container.innerHTML = "";
}
function RenderHTML(html, container) {
    container.insertAdjacentHTML("beforeend", html);
}
function AddFavEvents(container) {
    container.querySelectorAll(".location-card").forEach((card) => {
        card.querySelector("button.blue").addEventListener("click", () => {
            card.querySelector("button.blue").classList.add("hidden");
            card.querySelector("button.green").classList.remove("hidden");
        });
    });
}
function ChangePageNumbers(page, maxPage, container) {
    const pages = container.querySelectorAll("button");
    pages.forEach((page) => page.classList.remove("active"));
    if (page === 1 || page === 2) {
        pages[page - 1].classList.add("active");
        for (let i = 0; i < 5; i++) {
            pages[i].innerHTML = i + 1;
        }
    } else if (page === maxPage) {
        pages[4].classList.add("active");
        for (let i = 0; i < 5; i++) {
            pages[i].innerHTML = maxPage - 5 + i + 1;
        }
    } else if (page === maxPage - 1) {
        pages[3].classList.add("active");
        for (let i = 0; i < 5; i++) {
            pages[i].innerHTML = maxPage - 5 + i + 1;
        }
    } else {
        pages[2].classList.add("active");
        pages[0].innerHTML = page - 2;
        pages[1].innerHTML = page - 1;
        pages[2].innerHTML = page;
        pages[3].innerHTML = page + 1;
        pages[4].innerHTML = page + 2;
    }
}

async function GetEpisodes(page, name) {
    return await fetch(
        `https://rickandmortyapi.com/api/episode/?page=${page}
${name === "" ? "" : "&name=" + name}`,
    )
        .catch((err) => {
            console.log(err);
        })
        .then((resp) => resp.json())
        .then((json) => json.results);
}

async function GenerateHTML(eps) {
    let res = [];
    for (let ep of eps) {
        const ids = ep.characters.map((url) =>
            url.substring(url.lastIndexOf("/") + 1),
        );
        const url = `https://rickandmortyapi.com/api/character/${ids.join(",")}`;
        const chars = await fetch(url)
            .then((resp) => resp.json())
            .then((json) => json.map((char) => " " + char.name));
        const html = `<div class="episode-card">
                        <h2 class="bold" style="grid-column: span 2">${ep.name}</h2>
                        <button class="blue">
                            <img src="../assets/ico/plus.svg" />
                            Добавить в избранное
                        </button>
                        <label class="caption small-text">Эпизод:</label>
                        <label
                            class="caption small-text"
                            style="grid-column: span 2"
                        >
                            Персонажи, учавствующие в эпизоде:
                        </label>
                        <span class="medium small-text">${ep.episode}</span>
                        <span
                            class="medium small-text"
                            style="grid-column: span 2; grid-row: span 3"
                        >
                        ${chars}
                        </span>
                        <label class="caption small-text">Дата выхода:</label>
                        <span class="medium small-text">${ep.air_date}</span>
                      </div>`;
        res.push(html);
    }
    return res;
}
