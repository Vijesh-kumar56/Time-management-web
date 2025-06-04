let timetable = JSON.parse(localStorage.getItem("timetable")) || {};
let currentTheme = localStorage.getItem("theme") || "light";
document.body.classList.add(currentTheme);

// LOGIN
window.onload = function () {
    const user = localStorage.getItem("user");
    if (user) {
        document.getElementById("mainApp").style.display = "block";
        document.getElementById("loginScreen").style.display = "none";
    }
};



// THEME TOGGLE
function toggleTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    document.body.className = currentTheme;
    localStorage.setItem("theme", currentTheme);
    document.getElementById("themeBtn").textContent = currentTheme === "dark" ? "☀️" : "🌙";
}

// TOAST
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

// MAIN FUNCTIONS
function addOrUpdateActivity() {
    const day = document.getElementById("day").value;
    const start = document.getElementById("startTime").value;
    const end = document.getElementById("endTime").value;
    const activity = document.getElementById("activity").value;
    const editIndex = document.getElementById("editIndex").value;

    if (!start || !end || !activity) {
        alert("Please fill in all fields.");
        return;
    }

    if (!timetable[day]) timetable[day] = [];

    if (editIndex === "-1") {
        timetable[day].push({ start, end, activity });
        showToast("Activity added!");
    } else {
        timetable[day][editIndex] = { start, end, activity };
        document.getElementById("submitBtn").textContent = "Add";
        document.getElementById("editIndex").value = -1;
        showToast("Activity updated!");
    }

    saveToStorage();
    displayTodayList(day);
    clearInputs();
}

function editActivity(day, index) {
    const item = timetable[day][index];
    document.getElementById("day").value = day;
    document.getElementById("startTime").value = item.start;
    document.getElementById("endTime").value = item.end;
    document.getElementById("activity").value = item.activity;
    document.getElementById("editIndex").value = index;
    document.getElementById("submitBtn").textContent = "Update";
}

function deleteActivity(day, index) {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    timetable[day].splice(index, 1);
    saveToStorage();
    displayTodayList(day);
    viewTimetable();
    showToast("Activity deleted!");
}

function saveTimetable() {
    saveToStorage();
    showToast("Timetable saved!");
}

function saveToStorage() {
    localStorage.setItem("timetable", JSON.stringify(timetable));
}

function viewTimetable() {
    const day = document.getElementById("viewDay").value;
    const viewList = document.getElementById("viewList");
    viewList.innerHTML = "";

    const list = timetable[day] || [];
    if (list.length === 0) {
        viewList.innerHTML = "<li>No activities found.</li>";
        return;
    }

    list.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${formatTime(item.start)} - ${formatTime(item.end)}: ${item.activity}
          <button onclick="editActivity('${day}', ${index})">Edit</button>
          <button onclick="deleteActivity('${day}', ${index})">Delete</button>
        `;
        viewList.appendChild(li);
    });
}

function displayTodayList(day) {
    const list = document.getElementById("activityList");
    list.innerHTML = "";

    (timetable[day] || []).forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${formatTime(item.start)} - ${formatTime(item.end)}: ${item.activity}
          <button onclick="editActivity('${day}', ${index})">Edit</button>
          <button onclick="deleteActivity('${day}', ${index})">Delete</button>
        `;
        list.appendChild(li);
    });
}

function clearInputs() {
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("activity").value = "";
    document.getElementById("editIndex").value = -1;
    document.getElementById("submitBtn").textContent = "Add";
}

function formatTime(time) {
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
}
