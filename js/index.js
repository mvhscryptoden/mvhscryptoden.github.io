fetch("data/calendar.json")
    .then(res => res.json())
    .then(events => {

        const list = document.getElementById("eventsContainer");

        let count = 0;
        let eventsToShow = 4; //change count based on input on website

        events.forEach(event => {
            if (count >= eventsToShow) return;

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

            list.appendChild(card);

            count++;
        });
    });