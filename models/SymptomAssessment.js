const mongoose = require("mongoose");

const symptomAssessmentSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true
        },
        chatSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatSession",
            required: false
        },
        symptoms: {
            type: [String],
            required: true
        },
        duration: {
            type: String,
            default: ""
        },
        severity: {
            type: String,
            default: ""
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        language: {
            type: String,
            enum: ["Telugu", "English"],
            required: true
        },
        triageLevel: {
            type: String,
            enum: ["LOW", "MODERATE", "URGENT", "EMERGENCY"],
            required: true
        },
        redFlags: {
            type: [String],
            default: []
        },
        recommendation: {
            type: String,
            required: true
        },
        aiGenerated: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SymptomAssessment", symptomAssessmentSchema);
