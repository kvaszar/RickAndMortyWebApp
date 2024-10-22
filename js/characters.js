let currentPage = 1;
let maxPage = 1;
fetch(`https://rickandmortyapi.com/api/character`)
    .then((resp) => resp.json())
    .then((json) => (maxPage = json.info.pages));
const container = document.querySelector("#characters");
const nameInp = document.querySelector("#name");
const raceInp = document.querySelector("#race");
const statusSel = document.querySelector("#status");
LoadPage(currentPage);
let currentView = "list";
const viewToggle = document.querySelector("#view");
viewToggle.querySelectorAll("input").forEach((input) =>
    input.addEventListener("input", () => {
        LoadPage(currentPage);
    }),
);
const pages = document.querySelector("#pages");
const pagesNumbers = pages.querySelector("div");
pagesNumbers.firstElementChild.classList.add("active");
pagesNumbers.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.nodeName !== "BUTTON") return;
    currentPage = Number(e.target.innerHTML);
    LoadPage(currentPage);
    ChangePageNumbers(currentPage, maxPage, pagesNumbers);
});
const prev = pages.querySelectorAll(".arrow")[0];
const next = pages.querySelectorAll(".arrow")[1];
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

nameInp.addEventListener("change", () => LoadPage(currentPage));
raceInp.addEventListener("change", () => LoadPage(currentPage));
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
            LoadPage(currentPage);
        }
    });
});

observer.observe(statusSel, {
    attributes: true, //configure it to listen to attribute changes
});

async function LoadPage(page) {
    const name = nameInp.value;
    const race = raceInp.value;
    const status = statusSel.dataset.value;
    const chars = await GetCharacters(page, name, race, status);
    currentView = viewToggle.dataset.value;
    const htmls = GenerateHTML(chars, currentView);
    ClearHTML(container);
    for (let html of htmls) RenderHTML(html, container, currentView);
}
function ClearHTML(container) {
    container.innerHTML = "";
}
function RenderHTML(html, container, view) {
    container.style.gridTemplateColumns = view === "list" ? "1fr" : "1fr 1fr";
    container.insertAdjacentHTML("beforeend", html);
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

async function GetCharacters(page, name, race, status) {
    return await fetch(
        `https://rickandmortyapi.com/api/character/?page=${page}
${name === "" ? "" : "&name=" + name}
${race === "" ? "" : "&species=" + race}
${status === "" ? "" : "&status=" + status}
`,
    )
        .catch((err) => {
            console.log(err);
        })
        .then((resp) => resp.json())
        .then((json) => json.results);
}

function GenerateHTML(chars, view) {
    let res = [];
    for (let char of chars) {
        const statusHTML =
            `<div class="horizontal align-center" style="justify-self: flex-end; gap: 6px">` +
            `<img src="../assets/ico/${char.status === "Alive" ? "green" : char.status === "Dead" ? "red" : "yellow"}-dot.svg" />` +
            `<span>${char.status === "Alive" ? "Живой" : char.status === "Dead" ? "Мёртв" : "Неизвестно"}</span>` +
            `</div>`;
        const html = `<div class="character-card${view === "list" ? "" : " small"}">
                 <img src=${char.image} alt="image" />
                 <h4 class="bold">${char.name}</h4>
                ${statusHTML}
                 <span class="caption">Раса:</span>
                 <span>${char.species}</span>
                 ${view === "list" ? "<span class='caption'>Пол:</span><span>" + char.gender + "</span>" : ""}
                 <span class="caption">Место происхождения:</span>
                 <span>${char.origin.name}</span>
                 ${view === "list" ? "<span class='caption'>Эпизоды:</span><span>" + char.episode.length + "</span>" : ""}
                 <span class="caption">Последняя локация:</span>
                 <span>${char.location.name}</span>
                 <!-- filler -->
                 <div></div>
                 <!-- filler -->
${view === "list" ? '<div class="horizontal hidden" style="align-self: flex-end"><img src="../assets/ico/check.svg" /><span>В избранном</span></div><button class="blue" style="align-self: flex-end;justify-self: flex-end;margin-bottom: 0.938rem;"><img src="../assets/ico/plus.svg" alt="plus" />Добавить в избранное</button></div>' : ""}`;
        res.push(html);
    }
    return res;
}
