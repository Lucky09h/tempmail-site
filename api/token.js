export async function GET() {
  const res = await fetch('https://api.mail.tm/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: `user${Date.now()}@mails.pw`,
      password: 'password123'
    })
  });

  const account = await res.json();

  const login = await fetch('https://api.mail.tm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: account.address,
      password: 'password123'
    })
  });

  const tokenData = await login.json();

  return new Response(JSON.stringify({
    token: tokenData.token,
    address: account.address
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
