const triageService = require("./triageService");

const symptomService = {
    getTeluguResponse(triageLevel, symptoms, duration, redFlags) {
        if (triageLevel === "EMERGENCY") {
            return {
                text: "ఇది అత్యవసర పరిస్థితి కావచ్చు. వెంటనే సమీపంలోని అత్యవసర వైద్య సేవలను సంప్రదించండి లేదా ఆసుపత్రికి వెళ్లండి. చాట్‌బాట్ సమాధానం కోసం వేచి ఉండకండి.",
                recommendation: "emergency",
                triageLevel: "EMERGENCY"
            };
        }

        if (triageLevel === "URGENT") {
            return {
                text: "మీ లక్షణాలు ఆందోళనాత్మకంగా ఉంటున్నాయి. దయచేసి వెంటనే సమీప ప్రధాన ఆరోగ్య కేంద్రం (PHC) లోకి వెళ్లండి లేదా వైద్యుడిని సంప్రదించండి. ఇది వైద్య నిర్ధారణ కాదు.",
                recommendation: "phc_soon",
                triageLevel: "URGENT"
            };
        }

        if (triageLevel === "MODERATE") {
            return {
                text: `మీరు చెప్పిన లక్షణాలు (${symptoms.join(", ")}) మధ్యస్థంగా ఉన్నాయి. దయచేసి 2-3 రోజుల పాటు విశ్రాంతి తీసుకుంటూ గమనించండి. లక్షణాలు తీవ్రమైనా లేదా తగ్గకపోయినా సమీప PHC లో వైద్యుడిని సంప్రదించండి. ఇది సాధారణ మార్గదర్శకం మాత్రమే.`,
                recommendation: "monitor_phc",
                triageLevel: "MODERATE"
            };
        }

        return {
            text: "మీ లక్షణాలు తేలికపాటివిగా కనిపిస్తున్నాయి. ఇంట్లోనే విశ్రాంతి తీసుకుంటూ తగినంత నీరు త్రాగండి. లక్షణాలు ఎక్కువైనా లేదా తగ్గకపోయినా సమీప PHC ని సంప్రదించండి. ఇది వైద్య నిర్ధారణ కాదు.",
            recommendation: "home_monitor",
            triageLevel: "LOW"
        };
    },

    getEnglishResponse(triageLevel, symptoms, duration, redFlags) {
        if (triageLevel === "EMERGENCY") {
            return {
                text: "This may be an emergency. Please immediately contact emergency medical services or go to the nearest hospital. Do not wait for a chatbot response.",
                recommendation: "emergency",
                triageLevel: "EMERGENCY"
            };
        }

        if (triageLevel === "URGENT") {
            return {
                text: "Your symptoms are concerning. Please visit your nearest Primary Health Centre (PHC) or consult a doctor soon. This is not a medical diagnosis.",
                recommendation: "phc_soon",
                triageLevel: "URGENT"
            };
        }

        if (triageLevel === "MODERATE") {
            return {
                text: `Based on your symptoms (${symptoms.join(", ")}), please monitor for 2-3 days. If symptoms persist or worsen, visit a PHC or consult a doctor. This is general guidance only.`,
                recommendation: "monitor_phc",
                triageLevel: "MODERATE"
            };
        }

        return {
            text: "Your symptoms appear mild. Continue to monitor your condition. If symptoms persist or worsen, visit a PHC. This is not a medical diagnosis.",
            recommendation: "home_monitor",
            triageLevel: "LOW"
        };
    },

    assessSymptoms(message, duration, severity, age, gender, language) {
        const triageResult = triageService.assessTriage(message, duration, severity, age);
        const symptoms = triageService.detectModerateSymptoms(message);

        if (triageResult.isEmergency) {
            const redFlags = triageResult.redFlags;
            const response = language === "Telugu"
                ? this.getTeluguResponse("EMERGENCY", symptoms, duration, redFlags)
                : this.getEnglishResponse("EMERGENCY", symptoms, duration, redFlags);

            return {
                ...response,
                symptoms,
                duration,
                severity,
                age,
                gender,
                language,
                redFlags,
                disclaimer: language === "Telugu"
                    ? "ఇది వైద్య నిర్ధారణ కాదు. అత్యవసర పరిస్థితిలో వెంటనే వైద్య సహాయం పొందండి."
                    : "This is NOT a medical diagnosis. Seek immediate medical attention in emergencies."
            };
        }

        const response = language === "Telugu"
            ? this.getTeluguResponse(triageResult.triageLevel, symptoms, duration, [])
            : this.getEnglishResponse(triageResult.triageLevel, symptoms, duration, []);

        return {
            ...response,
            symptoms,
            duration,
            severity,
            age,
            gender,
            language,
            redFlags: [],
            disclaimer: language === "Telugu"
                ? "ఇది వైద్య నిర్ధారణ కాదు. అవసరమైతే వైద్యునిని సంప్రదించండి."
                : "This is NOT a medical diagnosis. Consult a doctor if needed."
        };
    },

    generateFollowUpQuestions(message, language) {
        const lowerMessage = message.toLowerCase();
        const questions = [];

        if (lowerMessage.includes("జ్వరం") || lowerMessage.includes("fever")) {
            questions.push(
                language === "Telugu"
                    ? "జ్వరం ఎంత తీవ్రంగా ఉంది (ఉష్ణోగ్రత)?"
                    : "What is the temperature of the fever?"
            );
            questions.push(
                language === "Telugu"
                    ? "ఎన్ని రోజులుగా జ్వరం ఉంది?"
                    : "How many days have you had the fever?"
            );
        }

        if (lowerMessage.includes("దగ్గు") || lowerMessage.includes("cough")) {
            questions.push(
                language === "Telugu"
                    ? "దగ్గుతో పాటు కఫం లేదా రక్తం పడుతోందా?"
                    : "Do you have phlegm or blood with the cough?"
            );
            questions.push(
                language === "Telugu"
                    ? "శ్వాస తీసుకోవడంలో ఏమైనా ఇబ్బంది ఉందా?"
                    : "Do you have difficulty breathing?"
            );
        }

        if (lowerMessage.includes("తలనొప్పి") || lowerMessage.includes("headache")) {
            questions.push(
                language === "Telugu"
                    ? "తలనొప్పి ఎంత తీవ్రంగా ఉంది? వాంతులు ఏమైనా ఉన్నాయా?"
                    : "How severe is the headache, and do you feel nauseous?"
            );
        }

        if (lowerMessage.includes("కడుపు నొప్పి") || lowerMessage.includes("stomach pain")) {
            questions.push(
                language === "Telugu"
                    ? "కడుపు నొప్పితో పాటు వాంతులు లేదా విరేచనాలు ఉన్నాయా?"
                    : "Do you have diarrhea or vomiting along with the pain?"
            );
        }

        if (questions.length === 0) {
            questions.push(
                language === "Telugu"
                    ? "ఈ లక్షణాలు ఎన్ని రోజులుగా ఉన్నాయి?"
                    : "How long have you had these symptoms?"
            );
            questions.push(
                language === "Telugu"
                    ? "లక్షణాల తీవ్రత ఎంతగా ఉంది (తక్కువ / మధ్యస్థం / ఎక్కువ)?"
                    : "How severe are the symptoms (mild / moderate / severe)?"
            );
        }

        return questions.slice(0, 3);
    }
};

module.exports = symptomService;
