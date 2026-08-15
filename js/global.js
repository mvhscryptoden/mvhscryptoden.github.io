//START BOUNCE ANIM

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

//END BOUNCE ANIM

//START GET SHEET FUNC

// Load config once
const config = await fetch("data/data.json").then(r => r.json());

export async function getSheet(name) {
    const url = config.googleSheets[name];

    const response = await fetch(url);
    const text = await response.text();

    const json = JSON.parse(
        text.substring(47).slice(0, -2)
    );

    return json.table.rows;
}

//END GET SHEET FUNC

// START SOCIAL LINKS FUNC

function updateSocialLinks() {
    const links = getSheet("socials").then(rows => {
        const socialsRow = rows[0]; // Assuming the first row contains the social links
        return {
            github: socialsRow.c[0]?.v ?? "",
            instagram: socialsRow.c[1]?.v ?? "",
            remind: socialsRow.c[2]?.v ?? "",
            email: socialsRow.c[3]?.v ?? ""
        };
    });

    links.then(links => {
        Object.entries(links).forEach(([id, url]) => {
            const element = document.getElementById(id);

            if (!element || !url?.trim()) return;

            if (id === "emailLink") {
                element.href = `mailto:${url.trim()}`;
                element.removeAttribute("target");
            } else {
                element.href = url.trim();
                element.target = "_blank";
            }
        });
    }).catch(err => {
        console.error("Error updating social links:", err);
    });

}

updateSocialLinks();

// END SOCIAL LINKS FUNC