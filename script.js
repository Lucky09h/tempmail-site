let token = '';
let address = '';
let userId = '';

async function generateEmail() {
  const domainRes = await fetch('https://api.mail.tm/domains');
  const domainData = await domainRes.json();
  const domain = domainData['hydra:member'][0].domain;

  address = `user${Math.floor(Math.random() * 10000)}@${domain}`;
  const password = 'TempMail123';

  const accountRes = await fetch('https://api.mail.tm/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password })
  });

  const accountData = await accountRes.json();
  userId = accountData.id;

  const tokenRes = await fetch('https://api.mail.tm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password })
  });

  const tokenData = await tokenRes.json();
  token = tokenData.token;

  document.getElementById('email').value = address;
  loadMessages();
}

async function loadMessages() {
  const msgRes = await fetch('https://api.mail.tm/messages', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const msgData = await msgRes.json();
  const list = document.getElementById('messages');
  list.innerHTML = '';

  msgData['hydra:member'].forEach(msg => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${msg.from.address}</strong><br>${msg.subject}`;
    list.appendChild(li);
  });
}

function copyEmail() {
  const emailInput = document.getElementById('email');
  navigator.clipboard.writeText(emailInput.value);
  alert('Email copied!');
}

window.onload = generateEmail;
