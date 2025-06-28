export async function POST(request) {
  const { token } = await request.json();

  const res = await fetch("https://api.mail.tm/messages", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  return new Response(JSON.stringify(data["hydra:member"]));
}
