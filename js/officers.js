//IMPORTS and whatnot
import { getSheet } from "./global.js";

async function loadOfficers() {
    try {
        const rows = await getSheet("officers");

        const officers = rows.slice(1).map(row => ({ //you have to slice off the first row here, idk why you dont have to on events.js but it works
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

            const isLeader =
                officer.position === "Treasurer" ||
                officer.position === "Secretary"; // yes guys i know this is technically backwards
                                                  // but its easier to redo the js this way than to 
                                                  // redo the sheet and the html and css

            const card = document.createElement("div");

            if (isLeader) {
                card.className = "leaderCard";

                card.innerHTML = `
                    <img src="${officer.image}" alt="${officer.name}">
                    <div>
                        <h2 class="leaderName">${officer.name}</h2>
                        <h3 class="leaderPosition">${officer.position}</h3>
                        <p class="leaderBio">${officer.bio}</p>
                    </div>
                `;

                if (isLeader && spotlight) {
                    spotlight.appendChild(card);
                }
                else if (!isLeader && grid) {
                    grid.appendChild(card);
                }
            }
            else {
                card.className = "officerCard";

                card.innerHTML = `
                    <img src="${officer.image}" alt="${officer.name}">
                    <h2 class="leaderName">${officer.name}</h2>
                    <h3 class="leaderPosition">${officer.position}</h3>
                    <p class="leaderBio">${officer.bio}</p>
                `;

                if (isLeader && spotlight) {
                    spotlight.appendChild(card);
                }
                else if (!isLeader && grid) {
                    grid.appendChild(card);
                }
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}

function displayLeadershipPreview(officers) {

    const container = document.getElementById("leadershipPreview");

    if (!container) return; // stops if this isn't the homepage

    const leaders = officers.filter(officer =>
        officer.position === "President" ||
        officer.position === "Vice President"
    );

    leaders.forEach(officer => {

        const card = document.createElement("div");
        card.className = "leadershipPreviewCard";

        card.innerHTML = `
            <img src="${officer.image}" alt="${officer.name}">

            <div>
                <h3>${officer.name}</h3>
                <p>${officer.position}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

loadOfficers();