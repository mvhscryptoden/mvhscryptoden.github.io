import { getSheet } from "./global.js";

export async function loadComp() {
    const compSection = document.getElementById("compSection");
    const noComp = document.getElementById("noComp");

    if (!compSection || !noComp) return;

    try {
        const rows = await getSheet("htmwInfo");

        const competitions = rows.slice(1)
            .map(row => ({
                compName: row.c?.[0]?.v ?? "",
                compStart: row.c?.[1]?.v ?? "",
                compEnd: row.c?.[2]?.v ?? "",
                compPassword: row.c?.[3]?.v ?? "",
                compLink: row.c?.[4]?.v ?? ""
            }))
            .filter(comp => Object.values(comp).some(Boolean));

        compSection.replaceChildren();

        if (competitions.length === 0) {
            noComp.style.display = "block";
            compSection.appendChild(noComp);
            return;
        }

        noComp.style.display = "none";

        competitions.forEach(comp => {
            const card = document.createElement("div");
            card.className = "compCard";

            card.innerHTML = `
                <div class="compCardHeader">
                    <h1>${comp.compName}</h1>
                    <p class="compPassword">
                        Password: <span class="textUnderline">${comp.compPassword}</span>
                    </p>
                </div>
                <p class="compDates">
                    Competition Dates: <span class="textUnderline">${comp.compStart}</span>
                    through <span class="textUnderline">${comp.compEnd}</span>
                </p>
                <a href="${comp.compLink}" class="btn secondary viewCompButton" target="_blank" rel="noopener noreferrer">
                    View Competition
                </a>
            `;

            compSection.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load competitions:", err);
        compSection.replaceChildren(noComp);
        noComp.style.display = "block";
    }
}

loadComp();
