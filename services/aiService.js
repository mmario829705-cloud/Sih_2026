const aiService = {
    async generateHealthResponse(message, language, context) {
        const apiKey = process.env.AI_API_KEY;
        const apiUrl = process.env.AI_API_URL;
        const model = process.env.AI_MODEL;

        if (!apiKey || !apiUrl) {
            return null;
        }

        try {
            const systemPrompt = language === "Telugu"
                ? `మీరు ఆరోగ్య సహాయకుడు. మీరు వైద్య నిర్ధారణ ఇవ్వరాదు, మందులు ఉండేవి ఉండరాదు. 
           వినిపించే వ్యక్తి గురించి సూక్ష్మంగా తెలుసుకోవడానికి ప్రశ్నలు అడగండి.
           అత్యవసర పరిస్థితులు ఉంటే వెంటనే అత్యవసర వైద్య సేవలకు సూచించండి.
           ఎప్పుడూ "మీరు ఖచ్చితంగా X రోగం కలిగి ఉన్నారు" అని చెప్పకండి.
           సాధారణ ఆరోగ్య మార్గదర్శకాలను ఇవ్వండి మరియు అవసరమైతే సమీప PHC లోకి వెళ్ళడానికి సూచించండి.`
                : `You are a healthcare assistant. You must not provide medical diagnoses or prescribe medicines.
           Ask clarifying questions to understand the user's condition better.
           If emergency symptoms are detected, immediately recommend emergency medical care.
           Never say "you definitely have X disease".
           Provide general health guidance and recommend PHC care if appropriate.`;

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model || "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...(context || []),
                        { role: "user", content: message }
                    ],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || null;
        } catch (error) {
            console.error("AI service error:", error.message);
            return null;
        }
    }
};

module.exports = aiService;
