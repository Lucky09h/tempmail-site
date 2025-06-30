let token = "";
let user = {};
let domain = "";

async function generateEmail() {
  document.getElementById("inbox").innerHTML = "Loading...";
  
  const domainsRes = await fetch("https://api.mail.tm/domains");
  const domainsData = await domainsRes.json();
  domain = domainsData["hydra:member"][0].domain;

  const username = "user" + Math.floor(Math.random() * 10000);
  const email = `${username}@${domain}`;
  const password = "pass123456";

  await fetch("https://api.mail.tm/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: email, password: password }),
  });

  const tokenRes = await fetch("https://api.mail.tm/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: email, password: password }),
  });

  const tokenData = await tokenRes.json();
  token = tokenData.token;
  user = { email, password };

  document.getElementById("email").value = email;

  checkInbox();
  setInterval(checkInbox, 10000);
}

async function checkInbox() {
  if (!token) return;

  const res = await fetch("https://api.mail.tm/messages", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  const messages = data["hydra:member"];

  const inbox = document.getElementById("inbox");
  inbox.innerHTML = messages.length
    ? messages.map(msg => `<p><strong>${msg.from.name}:</strong> ${msg.subject}</p>`).join("")
    : "<p>No new messages.</p>";
}
