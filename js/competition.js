import { getSheet } from "./global.js";

export async function loadComp() {
    const compSection = document.getElementById("compSection");
    const noComp = document.getElementById("noComp");

    if (!compSection || !noComp) {
        return;
    }

    try {
        const rows = await getSheet("htmwInfo");

        // Remove the header row
        const competitions = rows.slice(1)
            .map(row => ({
                compName: row.c?.[0]?.v ?? "",
                compStart: row.c?.[1]?.v ?? "",
                compEnd: row.c?.[2]?.v ?? "",
                compPassword: row.c?.[3]?.v ?? "",
                compLink: row.c?.[4]?.v ?? ""
            }))
            // Ignore completely empty rows
            .filter(comp =>
                comp.compName ||
                comp.compStart ||
                comp.compEnd ||
                comp.compPassword ||
                comp.compLink
            );
        
        // Clear old competition cards
        compSection.innerHTML = "";

        // No competitions
        if (competitions.length === 0) {
            noComp.style.display = "block";
            compSection.appendChild(noComp);
            return;
        }

        // We have competitions
        noComp.style.display = "none";

        competitions.forEach(comp => {
            const compCard = document.createElement("div");

            compCard.className = "compCard";

            compCard.innerHTML = `
                <div class="compCard">
                    <div class="compCardHeader">
                        <h1>${comp.compName}</h1>

                        <p class="compPassword">
                            Password: <span class="textUnderline">${comp.compPassword}</span>
                        </p>
                    </div>

                    <p class="compDates">
                        Competition Dates: <span class="textUnderline">${comp.compStart}</span> through <span class="textUnderline">${comp.compEnd}</span>
                    </p>

                    <a href="${comp.compLink}" class="btn secondary viewCompButton" target="_blank" rel="noopener noreferrer">
                        View Competition
                    </a>
                </div>
            `;

            compSection.appendChild(compCard);
        });

    } catch (err) {
        console.error("COMPETITION ERROR:", err);

        // If something goes wrong, show the no competition message
        noComp.style.display = "block";

        // Make sure the section itself is visible
        compSection.style.display = "block";

        // Put the message back into the section
        compSection.appendChild(noComp);
    }
}

loadComp();