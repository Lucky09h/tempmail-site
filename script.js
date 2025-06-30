let emailField = document.getElementById("email");
let messagesList = document.getElementById("messages");
let account = {};
let token = "";

async function createAccount() {
  const res = await fetch("https://api.mail.tm/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address: `user${Date.now()}@domail.io`,
      password: "tempPassword123",
    }),
  });
  account = await res.json();
}

async function getToken() {
  const res = await fetch("https://api.mail.tm/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address: account.address,
      password: "tempPassword123",
    }),
  });
  const data = await res.json();
  token = data.token;
}

async function getMessages() {
  const res = await fetch("https://api.mail.tm/messages", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  messagesList.innerHTML = "";
  data["hydra:member"].forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = `📩 From: ${msg.from.address}\nSubject: ${msg.subject}`;
    messagesList.appendChild(li);
  });
}

function copyEmail() {
  navigator.clipboard.writeText(emailField.value);
  alert("Email copied!");
}

async function init() {
  await createAccount();
  await getToken();
  emailField.value = account.address;
  getMessages();
  setInterval(getMessages, 10000); // Check inbox every 10 seconds
}

init();
