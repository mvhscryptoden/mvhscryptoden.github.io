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

// START HTMW NAV FUNC

function updateHTMWNav() {
    const competitionLinks = document.querySelectorAll(".competitionNav");

    if (competitionLinks.length === 0) return;

    const htmwLink = config.links.htmw?.trim();

    competitionLinks.forEach(link => {
        if (htmwLink) {
            link.href = htmwLink;
            link.target = "_blank";
        } else {
            link.href = "nocompetition.html";
            link.removeAttribute("target");
        }
    });
}

updateHTMWNav();

// END HTMW NAV FUNC


// START SOCIAL LINKS FUNC

function updateSocialLinks() {
    const links = {
        instagramLink: config.links.instagram,
        githubLink: config.links.github,
        emailLink: config.links.email
    };

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
}

updateSocialLinks();

// END SOCIAL LINKS FUNC