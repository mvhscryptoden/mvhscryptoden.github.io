/* =========================
   LOAD HOME DATA
========================= */

async function loadHomeData() {
  try {
    const res = await fetch("data/home.json");
    const data = await res.json();

    // NEXT MEETING
    const meeting = data.nextMeeting;

    const date = new Date(meeting.date).toLocaleString();

    document.getElementById("nextMeetingCard").innerHTML = `
      <strong>Topic:</strong> ${meeting.topic}<br>
      <strong>Presenter:</strong> ${meeting.presenter}<br>
      <strong>Date:</strong> ${date}
    `;

    // OFFICER PREVIEW
    const officerContainer = document.getElementById("officerPreview");

    if (data.officersPreview) {
      officerContainer.innerHTML = data.officersPreview.map(o => `
        <div class="card">
          <strong>${o.name}</strong><br>
          <span style="color:#5FE1D9;">${o.position}</span>
        </div>
      `).join("");
    }

  } catch (err) {
    console.error("Failed to load home data:", err);
  }
}

/* =========================
   LOAD NEWS DATA
========================= */

async function loadNews() {
  try {
    const res = await fetch("data/news.json");
    const news = await res.json();

    const container = document.getElementById("newsContainer");

    container.innerHTML = news.slice(0, 3).map(item => `
      <div class="card">
        <h3>${item.title}</h3>
        <small style="color:#747474;">${item.date}</small>
        <p>${item.summary}</p>
      </div>
    `).join("");

  } catch (err) {
    console.log("No news loaded yet.");
  }
}

/* =========================
   INIT
========================= */

loadHomeData();
loadNews();