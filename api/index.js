export default async function handler(req, res) {
    const OPENAI_API_KEY = "const apiKey = process.env.OPENAI_API_KEY;
"; // OVAJ KLJUČ DOBIJAŠ NA OpenAI PLATFORMI// test redeploy // Tes

    let userMessage = req.query.message || "Ćao, Deda Močo!";
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "system", content: "Ti si Deda Moča, mudar i duhovit četbot." }, 
                       { role: "user", content: userMessage }]
        })
    });

    const data = await response.json();
    res.json({ message: data.choices[0].message.content });
}

