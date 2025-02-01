export default async function handler(req, res) {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    console.log("API KEY:", openaiApiKey ? "POSTOJI" : "NE POSTOJI");


    if (!openaiApiKey) {
        return res.status(500).json({ error: "API ključ nije pronađen!" });
    }

    let userMessage = req.query.message || "Ćao, Deda Močo! Kako si?";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "Ti si Deda Moča, mudar i duhovit četbot." }, 
                    { role: "user", content: userMessage }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
            throw new Error("Prazan odgovor od OpenAI.");
        }

        res.json({ message: data.choices[0].message.content });

    } catch (error) {
        console.error("Greška:", error);
        res.status(500).json({ error: "Došlo je do greške u komunikaciji sa OpenAI." });
    }
}


