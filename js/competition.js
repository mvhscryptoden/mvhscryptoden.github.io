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
            <div class="competitionHeader">
                <span class="competitionStatus">CURRENT COMPETITION</span>
                <h1>${comp.compName}</h1>
                <p>Put your investment strategy to the test.</p>
            </div>

            <div class="competitionDetails">
                <div class="competitionDetail">
                    <span class="detailLabel">DATES</span>
                    <strong>${comp.compStart} — ${comp.compEnd}</strong>
                </div>

                <div class="competitionDetail">
                    <span class="detailLabel">ACCESS PASSWORD</span>
                    <strong class="competitionPassword">${comp.compPassword}</strong>
                </div>
            </div>

            <a
                href="${comp.compLink}"
                class="btn primary competitionButton"
                target="_blank"
                rel="noopener noreferrer"
            >
                Enter Competition
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
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
