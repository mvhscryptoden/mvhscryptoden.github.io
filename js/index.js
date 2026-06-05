const searchBtn = document.getElementById("searchEvents");
const sectionCountInput = document.getElementById("sectionCount");
let eventsToShow = 4; //change count based on input on website

searchBtn.addEventListener("click", () => {
    const count = sectionCountInput.valueAsNumber;

    if (isNaN(count) || count < 1) {
        alert("Please enter a valid number greater than 0.");
        return;
    } else {
        eventsToShow = count;

        alert("count: " + eventsToShow);
        
    
        loadEvents();
    };
});

function loadEvents() {
    fetch("data/calendar.json") // Added ./ here
    .then(res => {
        // If the path is wrong, this block captures it!
        if (!res.ok) {
            throw new Error(`HTTP Error Status: ${res.status} - File not found!`);
        }
        return res.json();
    })
    .then(events => {
        alert("fetched successfully!");

        const eventsContainer = document.getElementById("eventsContainer");
        eventsContainer.innerHTML = "";

        // Slicing is cleaner and faster than a standard loop breaker
        const limitedEvents = events.slice(0, eventsToShow);

        limitedEvents.forEach(event => {
            alert("created event");

            const card = document.createElement("div");
            card.className = "eventItem";
            card.innerHTML = `
            <div class="eventDate">
                <h1 class="eventDay">${event.day}</h1>
                <p class="eventMonthYear">${event.monthYear}</p>
            </div>
            <div class="eventInfo">
                <h3 class="eventTitle">${event.title}</h3>
                <p class="eventDetails"><strong>Details:</strong> ${event.details}</p>
                <p class="eventLocation"><strong>Location:</strong> ${event.location}</p>
                <p class="eventHost"><strong>Host:</strong> ${event.host}</p>
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
            eventsContainer.appendChild(card);
        });
    })
    .catch(err => {
        // This will pop up if the JSON format is broken or the file is missing
        alert("Fetch Failed: " + err.message);
        console.error(err);
    });
}