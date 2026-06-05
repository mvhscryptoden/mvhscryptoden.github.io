const text = document.getElementById("bounceTxt");
const content = text.textContent;

text.innerHTML = [...content]
    .map(char => char === " " ? "<span>&nbsp;</span>" : `<em>${char}</em>`)
    .join("");

const letters = text.querySelectorAll("em");

letters.forEach((letter, index) => {
    letter.style.animationDelay = `${index * 0.05}s`;
});

let canBounce = true;
const totalDuration = 600 + (letters.length * 50);

text.addEventListener("mouseenter", () => {
    if (!canBounce) return;

    canBounce = false;

    text.classList.remove("play");

    void text.offsetWidth;

    text.classList.add("play");

    setTimeout(() => {
        text.classList.remove("play");
    }, totalDuration);

    setTimeout(() => {
        canBounce = true;
    }, totalDuration); //use the duration as the cooldown
});