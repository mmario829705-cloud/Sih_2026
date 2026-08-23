const triageService = {
    emergencyKeywords: {
        telugu: [
            "ఛాతీ నొప్పి",
            "ఛాతి నొప్పి",
            "గుండె నొప్పి",
            "గుండెల్లో మంట",
            "శ్వాస తీసుకోవడంలో కష్టం",
            "శ్వాస ఆడకపోవడం",
            "ఆయాసం",
            "ఊపిరి ఆడటం లేదు",
            "స్పృహ తప్పడం",
            "అపస్మారక స్థితి",
            "తీవ్రమైన రక్తస్రావం",
            "రక్తం కారడం",
            "ఫిట్స్",
            "మూర్ఛ",
            "పక్షవాతం",
            "ముఖం వంకర పోవడం",
            "తీవ్రమైన బలహీనత",
            "తీవ్రమైన అలెర్జీ",
            "నీలి రంగు పెదవులు",
            "విషప్రయోగం",
            "విషం",
            "పాము కాటు",
            "తేలు కాటు",
            "ఆత్మహత్య ఆలోచనలు",
            "తీవ్రమైన తల గాయం",
            "ఎముక విరగడం",
            "గర్భధారణ సమస్య",
            "గర్భవతి రక్తస్రావం",
            "అత్యవసరం",
            "అంబులెన్స్",
            "108"
        ],
        english: [
            "chest pain",
            "difficulty breathing",
            "shortness of breath",
            "unconscious",
            "unconsciousness",
            "severe bleeding",
            "seizure",
            "paralysis",
            "sudden weakness",
            "severe allergic reaction",
            "blue lips",
            "suicide",
            "self harm",
            "stroke",
            "heart attack",
            "can't breathe",
            "not breathing",
            "choking",
            "severe dehydration",
            "pregnancy emergency",
            "heavy bleeding",
            "broken bone",
            "severe head injury",
            "overdose",
            "poisoning",
            "emergency",
            "ambulance"
        ]
    },

    moderateKeywords: {
        telugu: [
            "జ్వరం",
            "దగ్గు",
            "తలనొప్పి",
            "కడుపు నొప్పి",
            "వాంతులు",
            "విరేచనాలు",
            "ఒళ్ళు నొప్పులు",
            "శరీర నొప్పులు",
            "గొంతు నొప్పి",
            "జలుబు",
            "తుమ్ములు",
            "దద్దుర్లు",
            "చర్మ సమస్య",
            "కీళ్ల నొప్పులు",
            "అలసట",
            "నీరసం",
            "తలతిరగడం",
            "కళ్ళు తిరగడం",
            "ఆకలి లేకపోవడం",
            "మూత్రంలో మంట"
        ],
        english: [
            "fever",
            "cough",
            "headache",
            "stomach pain",
            "vomiting",
            "diarrhea",
            "body pain",
            "sore throat",
            "cold",
            "flu",
            "mild chest pain",
            "rash",
            "joint pain",
            "fatigue",
            "dizziness"
        ]
    },

    detectRedFlags(message) {
        const lowerMessage = message.toLowerCase();
        const redFlags = [];

        for (const keyword of this.emergencyKeywords.telugu) {
            if (lowerMessage.includes(keyword)) {
                redFlags.push(keyword);
            }
        }

        for (const keyword of this.emergencyKeywords.english) {
            if (lowerMessage.includes(keyword)) {
                redFlags.push(keyword);
            }
        }

        return redFlags;
    },

    detectModerateSymptoms(message) {
        const lowerMessage = message.toLowerCase();
        const symptoms = [];

        for (const keyword of this.moderateKeywords.telugu) {
            if (lowerMessage.includes(keyword)) {
                symptoms.push(keyword);
            }
        }

        for (const keyword of this.moderateKeywords.english) {
            if (lowerMessage.includes(keyword)) {
                symptoms.push(keyword);
            }
        }

        return symptoms;
    },

    assessTriage(message, duration, severity, age) {
        const redFlags = this.detectRedFlags(message);

        if (redFlags.length > 0) {
            return {
                triageLevel: "EMERGENCY",
                redFlags: redFlags,
                isEmergency: true
            };
        }

        const moderateSymptoms = this.detectModerateSymptoms(message);

        if (moderateSymptoms.length > 0) {
            const isSevere = severity && ["severe", "high", "పెద్దదిగా", "అధికంగా"].includes(severity.toLowerCase());
            const isLongDuration = duration && ["week", "weeks", "నెల", "నెలలు", "మొదలైన", "ముందుకు"].some(d => duration.toLowerCase().includes(d));
            const isElderly = age > 65;
            const isChild = age < 5;

            if (isSevere || isLongDuration || isElderly || isChild) {
                return {
                    triageLevel: "URGENT",
                    redFlags: [],
                    isEmergency: false
                };
            }

            return {
                triageLevel: "MODERATE",
                redFlags: [],
                isEmergency: false
            };
        }

        return {
            triageLevel: "LOW",
            redFlags: [],
            isEmergency: false
        };
    }
};

module.exports = triageService;
