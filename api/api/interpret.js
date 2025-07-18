const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { dream } = req.body;

  if (!dream || dream.trim().length < 5) {
    return res.status(400).json({ error: 'اكتب حلم واضح لتفسيره.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY
      },
      body: JSON.stringify({
        model: 'claude-2',
        prompt: `أنت مفسر أحلام إسلامي محترف. فسّر هذا الحلم باللغة العربية:\n\n"${dream}"`,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.completion || 'لم يتم العثور على تفسير واضح.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '❌ حدث خطأ أثناء التفسير، حاول لاحقاً.' });
  }
};
