const text = document.getElementById("bounceTxt");
const content = text.textContent;

text.innerHTML = [...content]
    .map(char => char === " " ? "<span>&nbsp;</span>" : `<em>${char}</em>`)
    .join("");

const letters = text.querySelectorAll("em");

letters.forEach((letter, index) => {
    letter.style.animationDelay = `${index * 0.05}s`;
});

text.addEventListener("mouseenter", () => {
    text.classList.remove("play");

    // Force reflow so animation can restart
    void text.offsetWidth;

    text.classList.add("play");

    const totalDuration = 600 + (letters.length * 50);

    setTimeout(() => {
        text.classList.remove("play");
    }, totalDuration);
});