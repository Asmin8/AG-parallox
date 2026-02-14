// api/chat.js
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, ai } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Multi-AI config
    const AIs = {
      fiesta: {
        key: process.env.AI1_KEY,
        system: "You are AG Parallox Fiesta AI: fun, energetic, playful, and chatty."
      },
      coder: {
        key: process.env.AI2_KEY,
        system: "You are AG Parallox Coder AI: professional coding assistant, concise and helpful."
      },
      guru: {
        key: process.env.AI3_KEY,
        system: "You are AG Parallox Guru AI: philosophical, wise, and calm."
      }
    };

    const bot = AIs[ai];

    if (!bot) {
      return res.status(400).json({ error: "AI not found" });
    }

    if (!bot.key) {
      return res.status(500).json({ error: `API key for ${ai} not set in environment variables` });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bot.key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: bot.system },
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `OpenAI API error: ${text}` });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No reply from AI";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
