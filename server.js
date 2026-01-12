import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Você é um atendente profissional da MAXPLAY TV.
Explique planos, valores, compatibilidade, estabilidade e leve o cliente para o WhatsApp 27 99797-4777.
Seja educado, objetivo e vendedor.
                  
Pergunta do cliente: ${userMessage}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não entendi, pode repetir?";

    res.json({ reply });

  } catch (err) {
    res.status(500).json({
      reply: "Erro no atendimento. Tente novamente em instantes."
    });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("🤖 Chatbot Gemini rodando")
);
