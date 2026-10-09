const medicineForm = document.getElementById("medicineForm");
const medicineName = document.getElementById("medicineName");
const medicineTime = document.getElementById("medicineTime");
const medicineList = document.getElementById("medicineList");
const medicineCount = document.getElementById("medicineCount");

let medicines = [];

try {
    medicines = JSON.parse(localStorage.getItem("medicines")) || [];
} catch {
    medicines = [];
}

function saveMedicines() {
    localStorage.setItem("medicines", JSON.stringify(medicines));
}

function renderMedicines() {
    medicineList.innerHTML = "";
    medicineCount.textContent = medicines.length;

    medicines.forEach((medicine, index) => {
        const item = document.createElement("div");
        item.className = "medicine-item";

        const details = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = medicine.name;

        const time = document.createElement("p");
        time.textContent = "Reminder: " + medicine.time;

        const status = document.createElement("p");
        status.className = medicine.taken ? "taken" : "";
        status.textContent = medicine.taken ? "✓ Taken" : "⏳ Pending";

        details.append(name, time, status);

        const actions = document.createElement("div");

        if (!medicine.taken) {
            const takenButton = document.createElement("button");
            takenButton.textContent = "Mark as Taken";

            takenButton.onclick = () => {
                medicines[index].taken = true;
                saveMedicines();
                renderMedicines();
            };

            actions.appendChild(takenButton);
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "8px";
        deleteButton.style.background = "#d9534f";

        deleteButton.onclick = () => {
            medicines.splice(index, 1);
            saveMedicines();
            renderMedicines();
        };

        actions.appendChild(deleteButton);
        item.append(details, actions);
        medicineList.appendChild(item);
    });
}

medicineForm.onsubmit = function(event) {
    event.preventDefault();

    const name = medicineName.value.trim();
    const time = medicineTime.value;

    if (!name || !time) {
        alert("Please enter medicine name and time.");
        return;
    }

    medicines.push({
        name: name,
        time: time,
        taken: false,
        notified: false
    });

    saveMedicines();
    renderMedicines();
    medicineForm.reset();
};

function checkReminders() {
    const now = new Date();
    const currentTime =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0");

    medicines.forEach(medicine => {
        if (
            medicine.time === currentTime &&
            !medicine.taken &&
            !medicine.notified
        ) {
            if ("Notification" in window && Notification.permission === "granted") {
    new Notification("💊 SmartCare Medicine Reminder", {
        body: "Time to take " + medicine.name
    });
} else {
    alert("💊 Medicine Reminder: Time to take " + medicine.name);
}
            medicine.notified = true;
            saveMedicines();
        }
    });
}

renderMedicines();
setInterval(checkReminders, 10000);
function updateDateTime() {
    const now = new Date();

    document.getElementById("currentTime").textContent =
        now.toLocaleTimeString();

    document.getElementById("currentDate").textContent =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}

updateDateTime();
setInterval(updateDateTime, 1000);
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

function updateMedicineHistory() {
    document.getElementById("totalMedicines").textContent =
        medicines.length;

    document.getElementById("takenMedicines").textContent =
        medicines.filter(medicine => medicine.taken).length;

    document.getElementById("pendingMedicines").textContent =
        medicines.filter(medicine => !medicine.taken).length;
}

const originalRenderMedicines = renderMedicines;

renderMedicines = function() {
    originalRenderMedicines();
    updateMedicineHistory();
};

updateMedicineHistory();