const token = localStorage.getItem("token"); // HR/Founder token must be stored after login
const API_URL = "http://localhost:5000/api/attendance/all"; // adjust if needed

// Fetch & render attendance
async function fetchAttendance() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch attendance");

    let records = await res.json();
    renderTable(records);

    // Add filter functionality
    document.getElementById("applyFilter").addEventListener("click", () => {
      const status = document.getElementById("statusFilter").value;
      const fromDate = document.getElementById("fromDate").value;
      const toDate = document.getElementById("toDate").value;

      let filtered = records;

      if (status) {
        filtered = filtered.filter(r => r.status === status);
      }
      if (fromDate) {
        filtered = filtered.filter(r => new Date(r.date) >= new Date(fromDate));
      }
      if (toDate) {
        filtered = filtered.filter(r => new Date(r.date) <= new Date(toDate));
      }

      renderTable(filtered);
    });

  } catch (err) {
    console.error(err);
    alert("Error loading attendance records");
  }
}

function renderTable(records) {
  const tbody = document.querySelector("#attendanceTable tbody");
  tbody.innerHTML = "";

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No records found</td></tr>`;
    return;
  }

  records.forEach(r => {
    const tr = document.createElement("tr");
    const dateObj = new Date(r.date);
    const formattedDate = dateObj.toLocaleDateString("en-GB"); // dd/mm/yyyy

    tr.innerHTML = `
      <td>${r.userEmail}</td>
      <td>${r.status === "present" ? "✅ Present" : "❌ Absent"}</td>
      <td>${formattedDate}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Run fetch on page load
fetchAttendance();
