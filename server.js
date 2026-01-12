import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  try{
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Você é um atendente profissional da MAXPLAY TV.
Explique planos, valores, compatibilidade e incentive o cliente a falar no WhatsApp 27 99797-4777.
`
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  }catch(e){
    res.status(500).json({reply:"Erro no atendimento. Tente novamente."});
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("🤖 Chatbot IA rodando")
);
