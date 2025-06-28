let token = '';
let userEmail = '';
let userId = '';

async function getToken() {
  const username = `user${Math.floor(Math.random() * 10000)}@mail.tm`;
  const password = 'temp123456';

  await fetch('https://api.mail.tm/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: username, password })
  });

  const res = await fetch('https://api.mail.tm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: username, password })
  });
  const data = await res.json();
  token = data.token;
  userEmail = username;
  getUserId();
}

async function getUserId() {
  const res = await fetch('https://api.mail.tm/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  userId = data.id;
  document.getElementById('email').value = userEmail;
  getMessages();
}

async function getMessages() {
  const res = await fetch('https://api.mail.tm/messages', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();

  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = '';
  if (data['hydra:member'].length === 0) {
    messagesDiv.innerHTML = '<p>📨 No new messages yet. Please wait...</p>';
  } else {
    data['hydra:member'].forEach(msg => {
      messagesDiv.innerHTML += `
        <div class="msg">
          <h3>📩 ${msg.subject}</h3>
          <p><strong>From:</strong> ${msg.from.address}</p>
          <p>${msg.intro}</p>
        </div>
      `;
    });
  }

  setTimeout(getMessages, 10000); // Poll every 10 sec
}

function copyEmail() {
  const emailField = document.getElementById('email');
  navigator.clipboard.writeText(emailField.value);
  alert("Email copied to clipboard!");
}

getToken();
