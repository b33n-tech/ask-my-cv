// api/chat.js
export default async function handler(req, res) {
  // Configuration CORS pour autoriser votre GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // MODIFIEZ CETTE LIGNE POUR VOTRE PROMPT
  const systemPrompt = "Tu es un assistant expert en recrutement. Réponds aux questions sur mon profil. Si on te demande si mon profil correspond à un poste, analyse les compétences et sois honnête.";

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ reply: "Erreur serveur : impossible de contacter l'API." });
  }
}
