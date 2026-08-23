const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true
        },
        assessmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SymptomAssessment",
            required: false
        },
        facilityName: {
            type: String,
            required: true
        },
        facilityType: {
            type: String,
            enum: ["PHC", "DH", "CHC", "AH", "SUB_CENTER", "DISTRICT_HOSPITAL", "EMERGENCY", "OTHER"],
            required: true
        },
        reason: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["PENDING", "CONTACTED", "VISITED", "CANCELLED"],
            default: "PENDING"
        },
        district: {
            type: String,
            default: "West Godavari"
        },
        mandal: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Referral", referralSchema);
