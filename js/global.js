const text = document.getElementById("bounceTxt");

if (text) {
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

        setTimeout(() => text.classList.remove("play"), totalDuration);
        setTimeout(() => canBounce = true, totalDuration);
    });
}

const configPromise = fetch("data/data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load site configuration: ${response.status}`);
        }
        return response.json();
    });

export async function getSheet(name) {
    const config = await configPromise;
    const url = config.googleSheets?.[name];

    if (!url) {
        throw new Error(`No Google Sheet configured for: ${name}`);
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load Google Sheet "${name}": ${response.status}`);
    }

    const text = await response.text();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
        throw new Error(`Invalid Google Sheets response for: ${name}`);
    }

    const json = JSON.parse(text.slice(start, end + 1));
    return json.table?.rows ?? [];
}

async function updateSocialLinks() {
    try {
        const rows = await getSheet("socials");
        const socialsRow = rows[0];

        if (!socialsRow) return;

        const links = {
            instagramLink: socialsRow.c?.[0]?.v ?? "",
            githubLink: socialsRow.c?.[1]?.v ?? "",
            remindLink: socialsRow.c?.[2]?.v ?? "",
            emailLink: socialsRow.c?.[3]?.v ?? ""
        };

        Object.entries(links).forEach(([id, url]) => {
            const element = document.getElementById(id);

            if (!element || !url.trim()) return;

            if (id === "emailLink") {
                element.href = `mailto:${url.trim()}`;
                element.removeAttribute("target");
                element.removeAttribute("rel");
            } else {
                element.href = url.trim();
                element.target = "_blank";
                element.rel = "noopener noreferrer";
            }
        });
    } catch (err) {
        console.error("Failed to update social links:", err);
    }
}

updateSocialLinks();
