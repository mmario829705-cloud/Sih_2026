const ChatSession = require("../models/ChatSession");
const SymptomAssessment = require("../models/SymptomAssessment");
const triageService = require("../services/triageService");
const symptomService = require("../services/symptomService");
const aiService = require("../services/aiService");

const chatController = {
    sendMessage: async (req, res) => {
        try {
            const { message, language, sessionId } = req.body;
            const memberId = req.member._id;

            if (!message || !message.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Message cannot be empty"
                });
            }

            const lang = language || req.member.language || "Telugu";

            let session = null;

            if (sessionId) {
                session = await ChatSession.findById(sessionId);
            }

            if (!session) {
                session = await ChatSession.create({
                    memberId: memberId,
                    messages: [],
                    title: message.slice(0, 50)
                });
            }

            const triageResult = triageService.assessTriage(message, "", "", req.member.age);

            let reply = "";
            let triageLevel = triageResult.triageLevel;
            let redFlags = triageResult.redFlags;
            let recommendation = "";

            if (triageResult.isEmergency) {
                reply = lang === "Telugu"
                    ? "ఇది అత్యవసర పరిస్థితి కావచ్చు. వెంటనే సమీపంలోని అత్యవసర వైద్య సేవలను సంప్రదించండి లేదా ఆసుపత్రికి వెళ్లండి. చాట్‌బాట్ సమాధానం కోసం వేచి ఉండకండి."
                    : "This may be an emergency. Please immediately contact emergency medical services or go to the nearest hospital. Do not wait for a chatbot response.";
                recommendation = "emergency";

                await SymptomAssessment.create({
                    memberId: memberId,
                    chatSessionId: session._id,
                    symptoms: [message],
                    duration: "",
                    severity: "",
                    age: req.member.age,
                    gender: req.member.gender,
                    language: lang,
                    triageLevel: "EMERGENCY",
                    redFlags: redFlags,
                    recommendation: recommendation
                });
            } else {
                const aiResponse = await aiService.generateHealthResponse(message, lang, session.messages.map(m => ({
                    role: m.sender === "user" ? "user" : "assistant",
                    content: m.text
                })));

                if (aiResponse) {
                    reply = aiResponse;
                } else {
                    const assessment = symptomService.assessSymptoms(
                        message,
                        "",
                        "",
                        req.member.age,
                        req.member.gender,
                        lang
                    );
                    reply = assessment.text;
                    triageLevel = assessment.triageLevel;

                    await SymptomAssessment.create({
                        memberId: memberId,
                        chatSessionId: session._id,
                        symptoms: assessment.symptoms,
                        duration: assessment.duration,
                        severity: assessment.severity,
                        age: assessment.age,
                        gender: assessment.gender,
                        language: assessment.language,
                        triageLevel: assessment.triageLevel,
                        redFlags: assessment.redFlags,
                        recommendation: assessment.recommendation,
                        aiGenerated: false
                    });
                }

                const followUpQuestions = symptomService.generateFollowUpQuestions(message, lang);
                if (followUpQuestions.length > 0) {
                    reply += (lang === "Telugu" ? "\n\nమరింత సమాచారం ఉంటే: " : "\n\nTo help me understand better: ");
                    reply += followUpQuestions.map(q => q).join((lang === "Telugu" ? "\n" : "\n"));
                }

                reply += (lang === "Telugu" ? "\n\n(గమనిక: ఇది వైద్య నిర్ధారణ కాదు.)" : "\n\n(Note: This is NOT a medical diagnosis.)");
                recommendation = triageLevel === "URGENT" ? "phc_soon" : triageLevel === "MODERATE" ? "monitor_phc" : "home_monitor";
            }

            session.messages.push({
                sender: "user",
                text: message,
                language: lang,
                timestamp: new Date()
            });

            session.messages.push({
                sender: "assistant",
                text: reply,
                language: lang,
                timestamp: new Date()
            });

            await session.save();

            res.status(200).json({
                success: true,
                reply,
                language: lang,
                triageLevel: triageLevel,
                redFlags: redFlags,
                recommendation: recommendation,
                sessionId: session._id
            });
        } catch (error) {
            console.error("Send message error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to send message"
            });
        }
    },

    getSessions: async (req, res) => {
        try {
            const sessions = await ChatSession.find({ memberId: req.member._id })
                .sort({ createdAt: -1 })
                .limit(20);

            const formattedSessions = sessions.map(session => ({
                id: session._id,
                title: session.title,
                messageCount: session.messages.length,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt
            }));

            res.status(200).json({
                success: true,
                count: formattedSessions.length,
                sessions: formattedSessions
            });
        } catch (error) {
            console.error("Get sessions error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get chat sessions"
            });
        }
    },

    getSessionById: async (req, res) => {
        try {
            const session = await ChatSession.findOne({
                _id: req.params.id,
                memberId: req.member._id
            });

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: "Chat session not found"
                });
            }

            res.status(200).json({
                success: true,
                session
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Invalid session ID"
            });
        }
    },

    createSession: async (req, res) => {
        try {
            const session = await ChatSession.create({
                memberId: req.member._id,
                messages: [],
                title: "New Chat"
            });

            res.status(201).json({
                success: true,
                sessionId: session._id
            });
        } catch (error) {
            console.error("Create session error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to create chat session"
            });
        }
    },

    deleteSession: async (req, res) => {
        try {
            const session = await ChatSession.findOneAndDelete({
                _id: req.params.id,
                memberId: req.member._id
            });

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: "Chat session not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Chat session deleted successfully"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Invalid session ID"
            });
        }
    }
};

module.exports = chatController;
