//Getting pages count
let currentPage = 1;
let maxPage = 1;
fetch(`https://rickandmortyapi.com/api/location`)
    .then((resp) => resp.json())
    .then((json) => (maxPage = json.info.pages));
//Getting pages count

const container = document.querySelector("#locations");

const searchName = document.querySelector("#search_name");
const searchType = document.querySelector("#search_type");
const searchDimension = document.querySelector("#search_dimension");

const pages = document.querySelector("#pages");
const pagesNumbers = pages.querySelector("div");
const prev = pages.querySelectorAll(".arrow")[0];
const next = pages.querySelectorAll(".arrow")[1];

searchName.addEventListener("change", () => {
    LoadPage(currentPage);
});
searchType.addEventListener("change", () => {
    LoadPage(currentPage);
});
searchDimension.addEventListener("change", () => {
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
    const type = searchType.value;
    const dimension = searchDimension.value;
    const locs = await GetLocations(page, name, type, dimension);
    const htmls = GenerateHTML(locs);
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

async function GetLocations(page, name, type, dimension) {
    return await fetch(
        `https://rickandmortyapi.com/api/location/?page=${page}
${name === "" ? "" : "&name=" + name}
${type === "" ? "" : "&type=" + type}
${dimension === "" ? "" : "&dimension=" + dimension}`,
    )
        .catch((err) => {
            console.log(err);
        })
        .then((resp) => resp.json())
        .then((json) => json.results);
}

function GenerateHTML(locs) {
    let res = [];
    for (let loc of locs) {
        const html = `<div class="location-card">
                        <h2
                            class="bold"
                            style="grid-column: span 2; text-align: center"
                        >
                            ${loc.name}
                        </h2>
                        <label class="caption small-text">Тип:</label>
                        <label
                            class="caption small-text"
                            style="grid-row: span 2"
                        >
                            Количество персонажей, которые в последний раз были
                            замечены здесь:
                        </label>
                        <span class="medium small-text">${loc.type}</span>
                        <label class="caption small-text">Измерение:</label>
                        <h2 style="grid-row: span 2">${loc.residents.length}</h2>
                        <span class="medium small-text">${loc.dimension}</span>
                        <button class="blue round">
                            <img src="../assets/ico/plus.svg" />
                        </button>
                        <button class="green round hidden">
                            <img src="../assets/ico/check-empty.svg" />
                        </button>
                      </div>`;
        res.push(html);
    }
    return res;
}
