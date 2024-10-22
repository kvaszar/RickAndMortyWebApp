document.querySelectorAll(".form-wrapper").forEach((wrapper) => {
    wrapper.addEventListener("click", () => {
        wrapper.classList.add("hidden");
    });
    wrapper.querySelector("form").addEventListener("click", (e) => {
        e.stopPropagation();
    });
});

document.querySelectorAll(".show-password").forEach((toggle) => {
    const wrapper = toggle.parentElement;
    const password = wrapper.querySelector("input");
    const label = toggle.querySelector("label");
    label.querySelector("input").addEventListener("input", () => {
        password.type = password.type === "password" ? "text" : "password";
    });
});

const accountHTML = document.querySelector(".account-wrapper");
const loginHTML = document.querySelector(".login-wrapper");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");

function Login(name, surname) {
    loginForm.parentElement.classList.add("hidden");
    registerForm.parentElement.classList.add("hidden");
    loginHTML.classList.add("hidden");
    accountHTML.classList.remove("hidden");
    accountHTML.querySelector("[name=account-name]").innerHTML =
        `${name} ${surname[0]}.`;
}
accountHTML.querySelector("[name=exit]").addEventListener("click", () => {
    accountHTML.classList.add("hidden");
    loginHTML.classList.remove("hidden");
    window.localStorage.removeItem("currentAccount");
});
loginHTML.querySelector("[name=register]").addEventListener("click", () => {
    registerForm.parentElement.classList.remove("hidden");
});
loginHTML.querySelector("[name=login]").addEventListener("click", () => {
    loginForm.parentElement.classList.remove("hidden");
});

window.addEventListener("load", () => {
    const login = window.localStorage.getItem("currentAccount");
    if (login === null) return;
    Login(
        JSON.parse(window.localStorage.getItem(login)).name,
        JSON.parse(window.localStorage.getItem(login)).surname,
    );
});

registerForm.addEventListener("submit", (e) => {
    console.log("hi");
    e.preventDefault();
    const email = registerForm.querySelector("[name=email]").value;
    const login = registerForm.querySelector("[name=login]").value;
    const info = {
        name: registerForm.querySelector("[name=name]").value,
        surname: registerForm.querySelector("[name=surname]").value,
        password: registerForm.querySelector("[name=password]").value,
        repeatPassword: registerForm.querySelector("[name=repeat-password]")
            .value,
    };
    if (info.password !== info.repeatPassword) return; //TODO: oshibka
    window.localStorage.setItem(email, JSON.stringify(info));
    window.localStorage.setItem(login, JSON.stringify(info));
    Login(info.name, info.surname);
});
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const login = loginForm.querySelector("[name=login-or-email]").value;
    if (window.localStorage.getItem(login) === null) return;
    if (
        JSON.parse(window.localStorage.getItem(login)).password !==
        loginForm.querySelector("[name=password]").value
    )
        return;
    Login(
        JSON.parse(window.localStorage.getItem(login)).name,
        JSON.parse(window.localStorage.getItem(login)).surname,
    );
    if (loginForm.querySelector("[name=remember]").checked) {
        window.localStorage.setItem("currentAccount", login);
    }
});
