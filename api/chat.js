// api/chat.js
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Missing message" });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "Server not configured" });

    // Use the v1/completions endpoint for your key
    const payload = {
      model: "text-davinci-003", // your key-supported model
      prompt: `You are Adam, Skills Expert. Be helpful, friendly, sometimes sprinkle light Nigerian Pidgin. 
Respond to the user message below professionally:\n\nUser: ${message}\nAdam:`,
      max_tokens: 600,
      temperature: 0.7
    };

    const r = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();

    // Extract reply from response
    const reply = data?.choices?.[0]?.text?.trim() || "Sorry, I can't reply now";

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



