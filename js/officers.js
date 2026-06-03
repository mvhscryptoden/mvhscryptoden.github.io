fetch("data/officers.json")
    .then(res => res.json())
    .then(officers => {

        const row1 = document.getElementById("row1Cards");
        const row2 = document.getElementById("row2Cards");

        officers.forEach(officer => {

            const card = document.createElement("div");
            card.classList.add("officerSpot");

            // featured roles
            if (officer.position === "President" || officer.position === "Vice President") {
                card.classList.add("featured");
            }

            card.innerHTML = `
                <img class="officerPhoto" src="${officer.image}" alt="${officer.name}">
                
                <h2 class="officerName">${officer.name}</h2>
                <h3 class="officerPosition">${officer.position}</h3>
                <p class="officerBio">${officer.bio}</p>
            `;

            if (officer.position === "President" || officer.position === "Vice President") {
                row1.appendChild(card);
            } else {
                row2.appendChild(card);
            }
        });
    });
