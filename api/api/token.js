export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { email, password } = req.body;

  try {
    const response = await fetch('https://api.mail.tm/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address: email, password: password })
    });

    const data = await response.json();

    if (data.token) {
      res.status(200).json({ token: data.token });
    } else {
      res.status(400).json({ error: 'Token not found', details: data });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error });
  }
}
