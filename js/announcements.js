import { getSheet } from "./global.js";

let announcements = [];

function formatAnnouncementDate(dateString) {

    const match = dateString.match(
        /Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/
    );

    if (!match) return dateString;

    const [
        ,
        year,
        month,
        day,
        hour,
        minute,
        second
    ] = match;

    let hour12 = Number(hour);
    const ampm = hour12 >= 12 ? "PM" : "AM";

    hour12 = hour12 % 12;
    if (hour12 === 0) hour12 = 12;

    return `${Number(month) + 1}/${day}/${String(year).slice(-2)} at ${hour12}:${String(minute).padStart(2, "0")} ${ampm}`;
}

async function loadAnnouncements() {

    try {

        const rows = await getSheet("announcements");

        announcements = rows.map(row => ({
            date: row.c[0]?.v ?? "",
            title: row.c[1]?.v ?? "",
            content: row.c[2]?.v ?? "",
            author: row.c[3]?.v ?? "",
            priority: row.c[4]?.v ?? ""
        }));

        console.log(rows);

        displayAnnouncements(3);

    }

    catch(err) {
        console.error(err);
    }
}

function displayAnnouncements(amount) {

    const container = document.getElementById("newsContainer");

    if (!container) return;

    container.innerHTML = "";

    const shownAnnouncements = announcements.slice(0, amount);

    shownAnnouncements.forEach(news => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <div class="announcementTitleHolder">
                <h3 class="announcementTitle">${news.title}</h3>
                <p class="announcementUrgency ${news.priority.toLowerCase()}">
                    ${news.priority}
                </p>
            </div>

            <p class="announcementContent">
                ${news.content}
            </p>

            <div class="announcementFooter">
                <small>Posted by ${news.author}</small>
                <small>${formatAnnouncementDate(news.date)}</small>
            </div>
        `;

        container.appendChild(card);
    });


    // Add "All caught up!" card if there are fewer than requested
    if (shownAnnouncements.length < amount) {

        const caughtUpCard = document.createElement("div");

        caughtUpCard.className = "card caughtUpCard";

        caughtUpCard.innerHTML = `
            <h2>All caught up!</h2>
            <p>Im sure there will be more soon...</p>
        `;

        container.appendChild(caughtUpCard);
    }
}

loadAnnouncements();