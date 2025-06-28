let email = '';
let password = '';
let token = '';

async function createAccount() {
  const res = await fetch('https://api.mail.tm/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: generateEmail(),
      password: generatePassword()
    })
  });

  const data = await res.json();
  email = data.address;
  password = data.password;
  document.getElementById('email').value = email;

  await loginAndFetch();
}

function generateEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  const name = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${name}@development.mail.tm`;
}

function generatePassword() {
  return Math.random().toString(36).slice(-10);
}

async function loginAndFetch() {
  const res = await fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  token = data.token;

  fetchMessages();
}

async function fetchMessages() {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  const data = await res.json();
  const messages = data.messages;

  const list = document.getElementById('messages');
  list.innerHTML = '';
  messages.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = `${msg.from.address} - ${msg.subject}`;
    list.appendChild(li);
  });
}

function copyEmail() {
  const emailInput = document.getElementById('email');
  emailInput.select();
  emailInput.setSelectionRange(0, 99999);
  document.execCommand('copy');
  alert('Email copied!');
}

createAccount();
