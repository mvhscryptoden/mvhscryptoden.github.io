import { getSheet } from "./global.js";

async function loadOfficers() {
    try {
        const rows = await getSheet("officers");

        const officers = rows.slice(1).map(row => ({
            name: row.c[0]?.v ?? "",
            position: row.c[1]?.v ?? "",
            bio: row.c[2]?.v ?? "",
            image: row.c[3]?.v ?? ""
        }));

        displayLeadershipPreview(officers);

        const spotlight = document.getElementById("leadershipSpotlight");
        const grid = document.getElementById("officerGrid");

        if (!spotlight && !grid) return;

        officers.forEach(officer => {
            const isLeader = ["President", "Vice President"].includes(officer.position);
            const card = document.createElement("div");

            if (isLeader) {
                card.className = "leaderCard";
                card.innerHTML = `
                    <img loading="lazy" src="${officer.image}" alt="${officer.name}">
                    <div>
                        <h2 class="leaderName">${officer.name}</h2>
                        <h3 class="leaderPosition">${officer.position}</h3>
                        <p class="leaderBio">${officer.bio}</p>
                    </div>
                `;

                if (spotlight) spotlight.appendChild(card);
            } else if (grid) {
                card.className = "officerCard";
                card.innerHTML = `
                    <img loading="lazy" src="${officer.image}" alt="${officer.name}">
                    <h2 class="leaderName">${officer.name}</h2>
                    <h3 class="leaderPosition">${officer.position}</h3>
                    <p class="leaderBio">${officer.bio}</p>
                `;

                grid.appendChild(card);
            }
        });
    } catch (err) {
        console.error("Failed to load officers:", err);
    }
}

function displayLeadershipPreview(officers) {
    const container = document.getElementById("leadershipPreview");

    if (!container) return;

    officers.forEach(officer => {
        const card = document.createElement("div");
        card.className = "leadershipPreviewCard";

        card.innerHTML = `
            <img loading="lazy" src="${officer.image}" alt="${officer.name}">
            <div>
                <h3>${officer.name}</h3>
                <p>${officer.position}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

loadOfficers();
