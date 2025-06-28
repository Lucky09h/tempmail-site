export async function POST(request) {
  const { email } = await request.json();

  const res = await fetch("https://api.mail.tm/accounts", {
    method: "POST",
    body: JSON.stringify({ address: email, password: "12345678" }),
    headers: { "Content-Type": "application/json" }
  });

  await res.json(); // Ignore result for now

  const tokenRes = await fetch("https://api.mail.tm/token", {
    method: "POST",
    body: JSON.stringify({ address: email, password: "12345678" }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await tokenRes.json();
  return new Response(JSON.stringify({ token: data.token }));
}
