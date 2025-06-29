let currentEmail = '';

function generateEmail() {
  // Generate a random mailbox
  fetch('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1')
    .then(res => res.json())
    .then(data => {
      currentEmail = data[0];
      document.getElementById('email').value = currentEmail;
      loadInbox(); // immediately load any existing mails
    })
    .catch(err => console.error('Error generating email:', err));
}

function loadInbox() {
  if (!currentEmail) return;
  const [login, domain] = currentEmail.split('@');
  fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`)
    .then(res => res.json())
    .then(messages => {
      const ul = document.getElementById('messages');
      ul.innerHTML = '';
      if (messages.length === 0) {
        ul.innerHTML = '<li>No new messages</li>';
      } else {
        messages.forEach(msg => {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>From:</strong> ${msg.from}<br>
            <strong>Subject:</strong> ${msg.subject}
          `;
          ul.appendChild(li);
        });
      }
    })
    .catch(err => console.error('Error loading inbox:', err));
}

function copyEmail() {
  if (!currentEmail) return;
  navigator.clipboard.writeText(currentEmail)
    .then(() => alert('Copied: ' + currentEmail))
    .catch(err => console.error('Copy failed:', err));
}

// Generate on page load
window.onload = () => {
  generateEmail();
  // Poll every 10 seconds
  setInterval(loadInbox, 10000);
};
