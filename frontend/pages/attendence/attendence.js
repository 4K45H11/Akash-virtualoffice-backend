const API_URL = "http://localhost:5000/api/attendance";

// Get token from localStorage (after login)
const token = localStorage.getItem("token");

async function markAttendance(status) {
  const res = await fetch(`${API_URL}/mark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  const data = await res.json();
  alert(data.msg);
  fetchAttendance();
}

async function fetchAttendance() {
  const res = await fetch(`${API_URL}/me`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const records = await res.json();

  const tbody = document.getElementById("attendance-list");
  tbody.innerHTML = "";
  records.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${new Date(r.date).toLocaleDateString()}</td><td>${r.status}</td>`;
    tbody.appendChild(tr);
  });
}

// Load on page start
fetchAttendance();
