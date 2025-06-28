let email = "";
let token = "";

async function generateEmail() {
  const domain = "mail.tm";
  const random = Math.random().toString(36).substring(2, 10);
  email = `${random}@${domain}`;
  document.getElementById("email").value = email;
  await getToken(email);
}

function copyEmail() {
  navigator.clipboard.writeText(document.getElementById("email").value);
  alert("Email copied!");
}

async function getToken(email) {
  const res = await fetch("/api/token.js", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  token = data.token;
  fetchMessages();
}

async function fetchMessages() {
  const res = await fetch("/api/messages.js", {
    method: "POST",
    body: JSON.stringify({ token }),
    headers: { "Content-Type": "application/json" }
  });
  const messages = await res.json();
  const msgList = document.getElementById("messages");
  msgList.innerHTML = "";
  messages.forEach(msg => {
    const li = document.createElement("li");
    li.textContent = msg.subject;
    msgList.appendChild(li);
  });
}

generateEmail();
