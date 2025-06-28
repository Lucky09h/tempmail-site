let token = "";
let address = "";

async function getToken() {
  const res = await fetch('/api/token.js');
  const data = await res.json();
  token = data.token;
  address = data.address;
  document.getElementById('email').value = address;
  getMessages();
}

function copyEmail() {
  navigator.clipboard.writeText(address);
  alert("Email copied!");
}

async function getMessages() {
  const res = await fetch('/api/messages.js?token=' + token);
  const data = await res.json();
  const messagesBox = document.getElementById('messages');
  messagesBox.innerHTML = "";
  data.forEach(msg => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${msg.from.address}</strong><p>${msg.subject}</p>`;
    messagesBox.appendChild(div);
  });
}

getToken();
