const SymptomAssessment = require("../models/SymptomAssessment");
const symptomService = require("../services/symptomService");

const symptomController = {
    assess: async (req, res) => {
        try {
            const { symptoms, duration, severity, language } = req.body;

            if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please describe your symptoms"
                });
            }

            const lang = language || req.member.language || "Telugu";
            const symptomText = symptoms.join(" ");

            const assessment = symptomService.assessSymptoms(
                symptomText,
                duration || "",
                severity || "",
                req.member.age,
                req.member.gender,
                lang
            );

            const savedAssessment = await SymptomAssessment.create({
                memberId: req.member._id,
                symptoms: symptoms,
                duration: duration || "",
                severity: severity || "",
                age: req.member.age,
                gender: req.member.gender,
                language: lang,
                triageLevel: assessment.triageLevel,
                redFlags: assessment.redFlags,
                recommendation: assessment.recommendation,
                aiGenerated: false
            });

            res.status(201).json({
                success: true,
                assessment: {
                    id: savedAssessment._id,
                    triageLevel: savedAssessment.triageLevel,
                    redFlags: savedAssessment.redFlags,
                    recommendation: savedAssessment.recommendation,
                    text: assessment.text,
                    disclaimer: assessment.disclaimer,
                    createdAt: savedAssessment.createdAt
                }
            });
        } catch (error) {
            console.error("Assess symptoms error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to assess symptoms"
            });
        }
    },

    getHistory: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const assessments = await SymptomAssessment.find({ memberId: req.member._id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await SymptomAssessment.countDocuments({ memberId: req.member._id });

            res.status(200).json({
                success: true,
                count: assessments.length,
                total,
                page,
                pages: Math.ceil(total / limit),
                assessments: assessments.map(a => ({
                    id: a._id,
                    symptoms: a.symptoms,
                    triageLevel: a.triageLevel,
                    redFlags: a.redFlags,
                    recommendation: a.recommendation,
                    createdAt: a.createdAt
                }))
            });
        } catch (error) {
            console.error("Get history error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get assessment history"
            });
        }
    },

    getAssessmentById: async (req, res) => {
        try {
            const assessment = await SymptomAssessment.findOne({
                _id: req.params.id,
                memberId: req.member._id
            });

            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: "Assessment not found"
                });
            }

            res.status(200).json({
                success: true,
                assessment
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Invalid assessment ID"
            });
        }
    }
};

module.exports = symptomController;
