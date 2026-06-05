fetch("data/calendar.json")
    .then(res => res.json())
    .then(events => {

        const list = document.getElementById("nextMeetingCard");

        let count = 0;
        let eventsToShow = 4; //change count based on input on website

        events.forEach(event => {
            if (count >= eventsToShow) return;

            const card = document.createElement("div");

            card.className = "eventItem";
            card.innerHTML = `
                <div class="eventItem">
                    <h3 class="eventTitle">Club Meeting</h3>

                    <div class="eventMeta">
                        <p><strong>Host:</strong> ${event.host}</p>
                        <p><strong>Date:</strong> ${event.date}</p>
                        <p><strong>Time:</strong> ${event.time}</p>
                    </div>

                    <p class="eventLocation">
                        <strong>Location:</strong> ${event.location}
                    </p>

                    <p class="eventDetails">
                        ${event.details}
                    </p>
                </div>
            `;

            list.appendChild(card);

            count++;
        });
    });