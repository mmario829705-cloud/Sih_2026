const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            enum: ["user", "assistant"],
            required: true
        },
        text: {
            type: String,
            required: true
        },
        language: {
            type: String,
            enum: ["Telugu", "English"],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false
    }
);

const chatSessionSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true
        },
        messages: [messageSchema],
        title: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ChatSession", chatSessionSchema);
