let token = '';
let address = '';

async function generateEmail() {
  const res = await fetch('https://api.mail.tm/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: `user${Date.now()}@domitrix.com`,
      password: 'tempmail123'
    })
  });

  const data = await res.json();
  address = data.address;
  document.getElementById("email").value = address;

  const login = await fetch('https://api.mail.tm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      password: 'tempmail123'
    })
  });

  const tokenData = await login.json();
  token = tokenData.token;

  getInbox();
}

function copyEmail() {
  const emailField = document.getElementById("email");
  emailField.select();
  document.execCommand("copy");
  alert("Email copied!");
}

async function getInbox() {
  const res = await fetch('https://api.mail.tm/messages', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  const inbox = document.getElementById("inbox");
  inbox.innerHTML = '';

  if (data['hydra:member'].length === 0) {
    inbox.innerHTML = '<p>No messages yet.</p>';
  } else {
    data['hydra:member'].forEach(msg => {
      inbox.innerHTML += `<div><strong>${msg.from.address}</strong><p>${msg.subject}</p></div><hr>`;
    });
  }
}
