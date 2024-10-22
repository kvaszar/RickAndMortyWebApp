document.querySelectorAll(".toggle").forEach((toggle) => {
    const inputs = toggle.querySelectorAll("input");
    inputs.forEach((input) => {
        if (input.type === "radio") {
            const radioGroup = toggle.querySelectorAll(`[name=${input.name}]`);
            input.addEventListener("input", () => {
                toggle.dataset.value = input.value;
                radioGroup.forEach((radio) => {
                    const label = radio.parentElement;
                    if (radio.checked) label.classList.add("active");
                    else label.classList.remove("active");
                });
            });
        } else {
            input.addEventListener("input", () => {
                const label = input.parentElement;
                if (input.checked) label.classList.add("active");
                else label.classList.remove("active");
            });
        }
    });
});

document.querySelectorAll(".select").forEach((select) => {
    const text = select.querySelector("span");
    const toggle = select.querySelector(".toggle input");
    const dropdown = select.querySelector(".dropdown");
    toggle.addEventListener("input", () => {
        if (toggle.checked) {
            dropdown.classList.remove("hidden");
        } else {
            dropdown.classList.add("hidden");
        }
    });
    dropdown.querySelectorAll("div").forEach((item) => {
        item.addEventListener("click", (e) => {
            text.innerHTML = e.currentTarget.querySelector("span").innerHTML;
            select.dataset.value = e.currentTarget.dataset.value;
            select.style.color = "black";
        });
    });
});
