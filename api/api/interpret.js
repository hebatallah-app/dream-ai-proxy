import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const { dream } = req.body;
    const resp = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY
      },
      body: JSON.stringify({
        model: 'claude-2',
        prompt: `أنت مفسر أحلام إسلامي محترف. فسّر هذا الحلم:\n\n"${dream}"`,
        max_tokens: 500,
        temperature: 0.7
      })
    });
    const data = await resp.json();
    res.status(200).json({ result: data.completion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في التفسير' });
  }
}
