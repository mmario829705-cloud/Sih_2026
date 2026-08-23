const Referral = require("../models/Referral");

const referralController = {
    createReferral: async (req, res) => {
        try {
            const { facilityName, facilityType, reason, assessmentId, district, mandal } = req.body;

            if (!facilityName || !facilityType) {
                return res.status(400).json({
                    success: false,
                    message: "Facility name and type are required"
                });
            }

            const referral = await Referral.create({
                memberId: req.member._id,
                assessmentId: assessmentId || null,
                facilityName,
                facilityType,
                reason: reason || "",
                district: district || "West Godavari",
                mandal: mandal || ""
            });

            res.status(201).json({
                success: true,
                message: "Referral created successfully",
                referral
            });
        } catch (error) {
            console.error("Create referral error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to create referral"
            });
        }
    },

    getReferrals: async (req, res) => {
        try {
            const referrals = await Referral.find({ memberId: req.member._id })
                .sort({ createdAt: -1 })
                .limit(20);

            res.status(200).json({
                success: true,
                count: referrals.length,
                referrals: referrals.map(r => ({
                    id: r._id,
                    facilityName: r.facilityName,
                    facilityType: r.facilityType,
                    reason: r.reason,
                    status: r.status,
                    district: r.district,
                    mandal: r.mandal,
                    createdAt: r.createdAt
                }))
            });
        } catch (error) {
            console.error("Get referrals error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get referrals"
            });
        }
    },

    updateReferralStatus: async (req, res) => {
        try {
            const { status } = req.body;

            if (!["PENDING", "CONTACTED", "VISITED", "CANCELLED"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status"
                });
            }

            const referral = await Referral.findOneAndUpdate(
                { _id: req.params.id, memberId: req.member._id },
                { status },
                { new: true }
            );

            if (!referral) {
                return res.status(404).json({
                    success: false,
                    message: "Referral not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Referral status updated",
                referral
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update referral status"
            });
        }
    }
};

module.exports = referralController;
