const socket = io("http://localhost:5000");
const token = localStorage.getItem("token");
const userName = localStorage.getItem("userName");

const hostBtn = document.getElementById("hostBtn");
const joinBtn = document.getElementById("joinBtn");
const meetingCodeInput = document.getElementById("meetingCode");

let localStream;
let peers = {};

async function initLocalStream() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById("localVideo").srcObject = localStream;
}

hostBtn.onclick = async () => {
  const res = await fetch("http://localhost:5000/api/meetings/host", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();
  alert(`Meeting hosted! Code: ${data.meetingCode}`);
  joinRoom(data.meetingCode);
};

joinBtn.onclick = async () => {
  const code = meetingCodeInput.value.trim();
  if (!code) return alert("Enter a meeting code");
  await fetch("http://localhost:5000/api/meetings/join", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ meetingCode: code })
  });
  joinRoom(code);
};

function joinRoom(code) {
  socket.emit("join-room", { meetingCode: code, userName });
  initLocalStream();
}

socket.on("user-joined", ({ userName, id }) => {
  console.log(`${userName} joined: ${id}`);
});
