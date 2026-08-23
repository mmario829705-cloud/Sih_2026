const mongoose = require("mongoose");

const phcSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "PHC name is required"],
            trim: true
        },
        district: {
            type: String,
            required: [true, "District is required"],
            trim: true
        },
        mandal: {
            type: String,
            required: [true, "Mandal is required"],
            trim: true
        },
        type: {
            type: String,
            enum: ["PHC", "DH", "CHC", "AH", "OTHER"],
            default: "PHC"
        },
        phone: {
            type: String,
            trim: true,
            default: ""
        },
        latitude: {
            type: String,
            trim: true,
            default: ""
        },
        longitude: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

phcSchema.index({ district: 1, mandal: 1, name: 1 });

module.exports = mongoose.model("PHC", phcSchema);
