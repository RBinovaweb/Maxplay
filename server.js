import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["POST","GET"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

// Rota de teste (IMPORTANTE)
app.get("/", (req, res) => {
  res.send("✅ Chatbot Gemini MAXPLAY rodando");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Mensagem vazia." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
Você é um atendente profissional da MAXPLAY TV.
Explique planos, valores, compatibilidade e SEMPRE convide para o WhatsApp 27 99797-4777.
Seja claro, vendedor e educado.

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
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Desculpe, não consegui responder agora.";

    res.json({ reply });

  } catch (error) {
    console.error("ERRO:", error);
    res.status(500).json({
      reply: "Erro no atendimento. Tente novamente em instantes."
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🤖 Chatbot Gemini MAXPLAY online");
});
