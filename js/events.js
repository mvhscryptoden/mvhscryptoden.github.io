import { getSheet } from "./global.js";

let allEvents = [];

async function loadEvents() {
    try {
        const rows = await getSheet("events");

        allEvents = rows
            .map(row => ({
                id: row.c?.[0]?.v ?? "",
                host: row.c?.[1]?.v ?? "",
                day: row.c?.[2]?.v ?? "",
                monthYear: row.c?.[3]?.v ?? "",
                time: row.c?.[4]?.v ?? "",
                location: row.c?.[5]?.v ?? "",
                details: row.c?.[6]?.v ?? "",
                title: row.c?.[7]?.v ?? "",
                hidden: String(row.c?.[8]?.v ?? "").toUpperCase() === "TRUE"
            }))
            .filter(event =>
                !event.hidden &&
                (event.title || event.details || event.day)
            );

        displayEvents(1, "highlightedEventContainer", 0);
        displayEvents(3, "eventsContainer", 1);
        displayEvents(3, "upcomingEventsContainer", 0);
    } catch (error) {
        console.error("Failed to load events:", error);
    }
}

function displayEvents(amount, containerId, start = 0) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.replaceChildren();

    const events = allEvents.slice(start, start + amount);

    if (events.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "pageDescription";
        emptyMessage.textContent = "No upcoming events are currently scheduled.";
        container.appendChild(emptyMessage);
        return;
    }

    events.forEach(event => {
        const card = document.createElement("article");
        card.className = "eventItem";

        card.innerHTML = `
            <div class="eventDate">
                <h1 class="eventDay">${event.day}</h1>
                <p class="eventMonthYear">${event.monthYear}</p>
            </div>

            <div class="eventInfo">
                <div class="eventTitleHolder">
                    <h3 class="eventTitle">${event.title}</h3>
                    ${event.id ? `<p class="eventID">${event.id}</p>` : ""}
                </div>

                ${event.details ? `<p class="eventDetails"><strong>Details:</strong> ${event.details}</p>` : ""}
                ${event.host ? `<p class="eventHost"><strong>Host:</strong> ${event.host}</p>` : ""}

                <div class="eventInfoSpecial">
                    ${event.time ? `<div class="eventTime"><p><i class="fa-regular fa-clock eventInfoIcon" aria-hidden="true"></i>${event.time}</p></div>` : ""}
                    ${event.location ? `<div class="eventLocation"><p><i class="fa-solid fa-location-dot eventInfoIcon" aria-hidden="true"></i>${event.location}</p></div>` : ""}
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

loadEvents();