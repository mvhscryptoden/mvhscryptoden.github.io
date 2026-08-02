//IMPORTS and whatnot
import { getSheet } from "./global.js";

//START DISPLAY EVENTS

let allEvents = [];

async function loadEvents() {
    try {
        const rows = await getSheet("events");

        allEvents = rows.map(row => ({
            id: row.c[0]?.v ?? "",
            host: row.c[1]?.v ?? "",
            day: row.c[2]?.v ?? "",
            monthYear: row.c[3]?.v ?? "",
            time: row.c[4]?.v ?? "",
            location: row.c[5]?.v ?? "",
            details: row.c[6]?.v ?? "",
            title: row.c[7]?.v ?? ""
        }));

        //add events here
        displayEvents(1, "highlightedEventContainer", 0);
        displayEvents(3, "eventsContainer", 1);
        displayEvents(3, "upcomingEventsContainer", 0);
    }
    catch (err) {
        console.error(err);
    }
}

function displayEvents(amount, containerId, start = 0) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    const limitedEvents = allEvents.slice(start, start + amount)

    limitedEvents.forEach(event => {

        const card = document.createElement("div");
        card.className = "eventItem";

        card.innerHTML = `
            <div class="eventDate">
                <h1 class="eventDay">${event.day}</h1>
                <p class="eventMonthYear">${event.monthYear}</p>
            </div>

            <div class="eventInfo">
                <div class="eventTitleHolder">
                    <h3 class="eventTitle">${event.title}</h3>
                    <p class="eventID">${event.id}</p>
                </div>

                <p class="eventDetails">
                    <strong>Details:</strong> ${event.details}
                </p>

                <p class="eventHost">
                    <strong>Host:</strong> ${event.host}
                </p>

                <div class="eventInfoSpecial">
                    <div class="eventTime">
                        <p>
                            <i class="fa-regular fa-clock eventInfoIcon"></i>
                            ${event.time}
                        </p>
                    </div>

                    <div class="eventLocation">
                        <p>
                            <i class="fa-solid fa-location-dot eventInfoIcon"></i>
                            ${event.location}
                        </p>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

loadEvents();

//END DISPLAY EVENTS