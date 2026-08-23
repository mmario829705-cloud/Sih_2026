const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },
        age: {
            type: Number,
            required: [true, "Age is required"],
            min: [1, "Age must be at least 1"],
            max: [120, "Age must be at most 120"]
        },
        gender: {
            type: String,
            enum: {
                values: ["Male", "Female", "Other"],
                message: "Gender must be Male, Female, or Other"
            },
            required: [true, "Gender is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },
        language: {
            type: String,
            enum: {
                values: ["Telugu", "English"],
                message: "Language must be Telugu or English"
            },
            default: "Telugu"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Member", memberSchema);
