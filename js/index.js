const eventsToShow = 3;

fetch("data/calendar.json")

.then(res => {
    //if the path is wrong or the file is missing, this will catch it and throw an error
    if (!res.ok) {
        throw new Error(`HTTP Error Status: ${res.status} - File not found!`);
    }
    return res.json();
})

.then(events => {

    const eventsContainer = document.getElementById("eventsContainer");
    eventsContainer.innerHTML = "";

    // limit the numbers of events to show based on the input value, if the input value is greater than the number of events, it will show all events
    const limitedEvents = events.slice(0, eventsToShow);

    limitedEvents.forEach(event => {
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
    // this will pop up if the JSON format is broken or the file is missing
    console.error(err);
});