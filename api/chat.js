export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, ai } = req.body;

    const AIs = {
      fiesta: {
        key: process.env.AI1_KEY,
        system: "Fun energetic AI with fiesta vibe"
      },
      coder: {
        key: process.env.AI2_KEY,
        system: "Expert coding AI"
      },
      guru: {
        key: process.env.AI3_KEY,
        system: "Deep philosophical AI"
      }
    };

    const bot = AIs[ai] || AIs.fiesta;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bot.key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: bot.system },
          { role: "user", content: message }
        ]
      })
    });

    const data = await r.json();
    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ reply: "Server error" });
  }
}
