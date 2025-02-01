export default async function handler(req, res) {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
        return res.status(500).json({ error: "API ključ nije pronađen!" });
    }

    let userMessage = req.query.message || "Ćao, Deda Močo kako si!";
    
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Ti si Deda Moča, mudar i duhovit četbott." }, 
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            res.json({ message: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: "Došlo je do greške u komunikaciji sa OpenAI.", details: data });
        }

    } catch (error) {
        res.status(500).json({ error: "Došlo je do interne greške.", details: error.message });
    }
}
