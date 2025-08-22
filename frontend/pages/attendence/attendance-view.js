document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in as HR/Founder");
    window.location.href = "/login.html";
    return;
  }

  fetch("http://localhost:5000/api/attendance/all", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#attendanceTable tbody");
      tbody.innerHTML = "";

      data.forEach(record => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${record.userId?.name || "Unknown"}</td>
          <td>${record.userId?.email || "-"}</td>
          <td>${record.userId?.role || "-"}</td>
          <td>${new Date(record.date).toLocaleString()}</td>
        `;

        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error("Error:", err));
});
