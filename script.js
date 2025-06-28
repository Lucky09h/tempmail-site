const emailField = document.getElementById("email");
const statusText = document.getElementById("status");

async function generateTempMail() {
  try {
    const res = await fetch("https://api.mail.tm/domains");
    const data = await res.json();
    const domain = data["hydra:member"][0].domain;
    const username = Math.random().toString(36).substring(2, 10);
    const tempEmail = `${username}@${domain}`;
    emailField.value = tempEmail;
    statusText.textContent = "Temporary Email Generated!";
  } catch (error) {
    statusText.textContent = "Failed to generate email. Try again.";
    console.error(error);
  }
}

function copyEmail() {
  emailField.select();
  document.execCommand("copy");
  alert("Email copied to clipboard!");
}

generateTempMail();
