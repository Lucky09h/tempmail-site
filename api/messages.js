export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { token } = req.body;

  try {
    const response = await fetch('https://api.mail.tm/messages', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    res.status(200).json({ messages: data['hydra:member'] });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch messages', details: error });
  }
}
