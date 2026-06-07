import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// =====================
// Firebase Config
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyDsdAN179ttB5TMVfbF1DPpzUPaiXpWKIM",
  authDomain: "mvhscryptoden-cd11a.firebaseapp.com",
  projectId: "mvhscryptoden-cd11a",
  storageBucket: "mvhscryptoden-cd11a.firebasestorage.app",
  messagingSenderId: "779693738347",
  appId: "1:779693738347:web:8ef756a526e330a9ede42e",
  measurementId: "G-W55XSNBQ7Z"
};

// =====================
// Init Firebase
// =====================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
emailjs.init("mvxsEwKxLYY8Retx1");

// =====================
// State
// =====================
let membersLoading = false;
let emailMembers = false;
let editingEventId = null;

// =====================
// Admin UIDs
// =====================
const admins = [
  "GQbqHZQ9Z7MDqkPhnxTpaf6gLQf1",
  "VQEF8SOpqTaCsOCL0RXDYz37h0n1",
  "ARK0gB6NUzWhXuzf2TgMKcQduC03"
];

// =====================
// UI Elements
// =====================
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const dashboard = document.getElementById("dashboard");
const accessDenied = document.getElementById("accessDenied");

const publishBtn = document.getElementById("publishBtn");
const titleInput = document.getElementById("announcementTitle");
const messageInput = document.getElementById("announcementMessage");
const announcementList = document.getElementById("announcementList");

const userEmailText = document.getElementById("userEmail");

const emailToAdd = document.getElementById("emailToAdd");

const saveEventBtn = document.getElementById("saveEventBtn");
const eventsList = document.getElementById("eventsList");

const importEventsBtn = document.getElementById("importEventsBtn");

// =====================
// LOGIN
// =====================
loginBtn?.addEventListener("click", async () => {
  const result = await signInWithPopup(auth, provider);
  handleUser(result.user);
});

// =====================
// LOGOUT
// =====================
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
});

importEventsBtn?.addEventListener("click", async () => {
  await importCalendarJSON();
});

// =====================
// AUTH LISTENER
// =====================
onAuthStateChanged(auth, (user) => {
  if (user) handleUser(user);
  else resetUI();
});

// =====================
// HANDLE USER
// =====================
function handleUser(user) {

  if (userEmailText) {
    userEmailText.textContent = user.email;
  }

  const isAdmin = admins.includes(user.uid);

  if (!isAdmin) {
    dashboard.style.display = "none";
    accessDenied.style.display = "block";
    loginBtn.style.display = "block";
    return;
  }

  dashboard.style.display = "flex";
  accessDenied.style.display = "none";
  loginBtn.style.display = "none";

  loadAnnouncements();
  loadMembers();
  loadEvents();
}

// =====================
// RESET UI
// =====================
function resetUI() {

  dashboard.style.display = "none";
  accessDenied.style.display = "none";
  loginBtn.style.display = "block";

  if (userEmailText) userEmailText.textContent = "";
}

// =====================
// ANNOUNCEMENTS
// =====================
async function createAnnouncement(title, message, email) {
  await addDoc(collection(db, "announcements"), {
    title,
    message,
    timestamp: Date.now(),
    sentBy: email
  });
}

async function loadAnnouncements() {

  if (!announcementList) return;

  announcementList.innerHTML = "";

  const q = query(
    collection(db, "announcements"),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "announcementItem";

    div.innerHTML = `
      <h4>${data.title}</h4>
      <p>${data.message}</p>
      <button data-id="${docSnap.id}">Delete</button>
    `;

    announcementList.appendChild(div);
  });
}

publishBtn?.addEventListener("click", async () => {

  const title = titleInput.value.trim();
  const message = messageInput.value.trim();

  if (!title || !message) return alert("Fill out all fields.");

  const user = auth.currentUser;
  if (!user) return alert("Not logged in.");

  await createAnnouncement(title, message, user.email);

  const snapshot = await getDocs(collection(db, "emails"));

  const emails = snapshot.docs
    .map(d => d.data().email)
    .filter(e => typeof e === "string" && e.includes("@"));

  if (emailMembers) {
    for (const email of emails) {
      await emailjs.send(
        "service_n7ti5ij",
        "template_qfsrpmp",
        {
          title,
          message,
          to_email: email
        }
      );
    }
  }

  titleInput.value = "";
  messageInput.value = "";

  loadAnnouncements();

  alert("Announcement published.");
});

// =====================
// DELETE ANNOUNCEMENT
// =====================
announcementList?.addEventListener("click", async (e) => {

  const btn = e.target.closest("button");
  if (!btn) return;

  await deleteDoc(doc(db, "announcements", btn.dataset.id));
  loadAnnouncements();
});

// =====================
// MEMBERS
// =====================
async function addEmail(email) {

  const emailId = email.toLowerCase().trim();

  if (!emailId.includes("@")) {
    alert("Invalid email");
    return;
  }

  const ref = doc(db, "emails", emailId);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    alert("Email already exists");
    return;
  }

  await setDoc(ref, {
    email: emailId,
    addedAt: Date.now()
  });
}

async function loadMembers() {

  if (membersLoading) return;
  membersLoading = true;

  const container = document.getElementById("membersList");
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "emails"));

  let index = 1;

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "memberCard";

    div.innerHTML = `
      <p>${index}.</p>
      <p>${data.email}</p>
      <button class="removeMember" data-id="${docSnap.id}">
        🗑
      </button>
    `;

    container.appendChild(div);
    index++;
  });

  membersLoading = false;
}

document.getElementById("addEmailButton")?.addEventListener("click", async () => {

  const email = emailToAdd.value.trim();
  if (!email) return;

  await addEmail(email);

  emailToAdd.value = "";
  loadMembers();
});

document.getElementById("membersList")?.addEventListener("click", async (e) => {

  const btn = e.target.closest(".removeMember");
  if (!btn) return;

  await deleteDoc(doc(db, "emails", btn.dataset.id));

  loadMembers();
});

// =====================
// EVENTS
// =====================
async function loadEvents() {

  if (!eventsList) return;

  eventsList.innerHTML = "";

  const snapshot = await getDocs(
    query(collection(db, "events"), orderBy("createdAt", "asc"))
  );

  snapshot.forEach(docSnap => {

    const event = docSnap.data();
    const isPast = eventIsPast(event);

    const div = document.createElement("div");

    div.innerHTML = `
      <div class="eventRow ${isPast ? "pastEvent" : ""}">

        <div class="eventMain">

          <div class="eventTitleRow">
            <strong>${event.title}</strong>

            ${isPast ? `<span class="pastEventBadgeSmall">PAST</span>` : ""}
          </div>

          <div class="eventMeta">
            ${event.monthYear} ${event.day} • ${event.time} • ${event.location}
          </div>

        </div>

        <div class="eventActions">

          <button class="editEvent" data-id="${docSnap.id}">
            Edit
          </button>

          <button class="deleteEvent" data-id="${docSnap.id}">
            Delete
          </button>

        </div>

      </div>
    `;

    eventsList.appendChild(div);
  });
}

function eventIsPast(event) {

  const monthMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3,
    May: 4, Jun: 5, Jul: 6, Aug: 7,
    Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  const month = event.monthYear.split(" ")[0];
  const year = 2000 + parseInt(event.monthYear.split("'")[1]);

  const eventDate = new Date(year, monthMap[month], event.day);

  return eventDate < new Date();
}

saveEventBtn?.addEventListener("click", async () => {

  const data = {
    title: document.getElementById("eventTitle").value,
    host: document.getElementById("eventHost").value,
    monthYear: document.getElementById("eventMonthYear").value,
    day: parseInt(document.getElementById("eventDay").value),
    time: document.getElementById("eventTime").value,
    location: document.getElementById("eventLocation").value,
    details: document.getElementById("eventDetails").value
  };

  if (editingEventId) {

    await setDoc(doc(db, "events", editingEventId), data, { merge: true });

    editingEventId = null;
    saveEventBtn.textContent = "Add Event";

  } else {

    await addDoc(collection(db, "events"), {
      ...data,
      createdAt: Date.now()
    });
  }

  loadEvents();
});

// =====================
// EDIT + DELETE EVENTS
// =====================
eventsList?.addEventListener("click", async (e) => {

  const editBtn = e.target.closest(".editEvent");
  const deleteBtn = e.target.closest(".deleteEvent");

  if (deleteBtn) {

    await deleteDoc(doc(db, "events", deleteBtn.dataset.id));
    loadEvents();
    return;
  }

  if (editBtn) {

    const snap = await getDoc(doc(db, "events", editBtn.dataset.id));
    const event = snap.data();

    document.getElementById("eventTitle").value = event.title;
    document.getElementById("eventHost").value = event.host;
    document.getElementById("eventMonthYear").value = event.monthYear;
    document.getElementById("eventDay").value = event.day;
    document.getElementById("eventTime").value = event.time;
    document.getElementById("eventLocation").value = event.location;
    document.getElementById("eventDetails").value = event.details;

    editingEventId = editBtn.dataset.id;
    saveEventBtn.textContent = "Save Changes";
  }
});

async function importCalendarJSON() {

  const res = await fetch("../data/calendar.json");
  const events = await res.json();

  for (const event of events) {

    const ref = doc(db, "events", event.id);

    const existing = await getDoc(ref);

    if (!existing.exists()) {

      await setDoc(ref, {
        ...event,
        createdAt: Date.now()
      });
    }
  }

  alert("Calendar imported successfully.");
  loadEvents();
}