fetch("data/officers.json")
    .then(res => res.json())
    .then(officers => {

        const spotlight = document.getElementById("leadershipSpotlight");
        const grid = document.getElementById("officerGrid");

        officers.forEach(officer => {

            const isLeader =
                officer.position === "President" ||
                officer.position === "Vice President";

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
                spotlight.appendChild(card);
            } else {
                card.className = "officerCard";
                card.innerHTML = `
                    <img src="${officer.image}" alt="${officer.name}">
                    <h2>${officer.name}</h2>
                    <h3 class="leaderPosition">${officer.position}</h3>
                    <p class="leaderBio">${officer.bio}</p>
                `;
                grid.appendChild(card);
            }
        });
    });