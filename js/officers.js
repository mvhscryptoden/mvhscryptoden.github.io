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

            const card = document.createElement("article");

            if (isLeader) {
                card.className = "officerCard";

                card.innerHTML = `
                    <img
                        loading="lazy"
                        src="${officer.image}"
                        alt="${officer.name}"
                    >

                    <div class="officerCardContent">
                        <h2 class="leaderName">${officer.name}</h2>
                        <h3 class="leaderPosition">${officer.position}</h3>
                        <p class="leaderBio">${officer.bio}</p>
                    </div>
                `;

                if (spotlight) {
                    spotlight.appendChild(card);
                }

                return;
            }

            if (grid) {
                card.className = "secondaryOfficerCard";

                card.innerHTML = `
                    <img
                        loading="lazy"
                        src="${officer.image}"
                        alt="${officer.name}"
                    >

                    <div class="secondaryOfficerContent">
                        <h2 class="officerName">${officer.name}</h2>
                        <h3 class="leaderPosition">${officer.position}</h3>
                        <p class="leaderBio">${officer.bio}</p>
                    </div>
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
            <img
                loading="lazy"
                src="${officer.image}"
                alt="${officer.name}"
            >

            <div>
                <h2>${officer.name}</h2>
                <p>${officer.position}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

loadOfficers();