export async function GET(request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const res = await fetch('https://api.mail.tm/messages', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const messages = await res.json();

  return new Response(JSON.stringify(messages['hydra:member']), {
    headers: { 'Content-Type': 'application/json' }
  });
}
