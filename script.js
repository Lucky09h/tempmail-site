let email = '';
let token = '';

async function getEmail() {
  const res = await fetch('https://api.mail.tm/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: `user${Date.now()}@gwfh.net`,
      password: 'TempPass123'
    })
  });

  const data = await res.json();
  email = data.address;
  document.getElementById('emailDisplay').value = email;

  const tokenRes = await fetch('https://api.mail.tm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: email,
      password: 'TempPass123'
    })
  });

  const tokenData = await tokenRes.json();
  token = tokenData.token;

  loadInbox();
}

async function loadInbox() {
  const inbox = document.getElementById('inbox');
  inbox.innerHTML = '<p>Checking for new emails...</p>';

  const res = await fetch('https://api.mail.tm/messages', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const messages = await res.json();
  if (messages['hydra:member'].length === 0) {
    inbox.innerHTML = '<p>No new messages</p>';
  } else {
    inbox.innerHTML = '';
    messages['hydra:member'].forEach(msg => {
      inbox.innerHTML += `<div><strong>${msg.from.address}</strong>: ${msg.subject}</div><hr>`;
    });
  }
}

function copyEmail() {
  navigator.clipboard.writeText(email);
  alert('Copied: ' + email);
}

getEmail();
