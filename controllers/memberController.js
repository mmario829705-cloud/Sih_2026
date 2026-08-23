const Member = require("../models/Member");

const memberController = {
    getMembers: async (req, res) => {
        try {
            const members = await Member.find()
                .select("-password")
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: members.length,
                members
            });
        } catch (error) {
            console.error("Get members error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get members"
            });
        }
    },

    getMemberById: async (req, res) => {
        try {
            const member = await Member.findById(req.params.id).select("-password");

            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: "Member not found"
                });
            }

            res.status(200).json({
                success: true,
                member
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Invalid member ID"
            });
        }
    },

    updateMember: async (req, res) => {
        try {
            const allowedUpdates = ["name", "phone", "age", "gender", "language"];
            const updates = {};

            for (const key of allowedUpdates) {
                if (req.body[key] !== undefined) {
                    updates[key] = req.body[key];
                }
            }

            const member = await Member.findByIdAndUpdate(
                req.member._id,
                updates,
                { new: true, runValidators: true }
            ).select("-password");

            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                member
            });
        } catch (error) {
            console.error("Update member error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update profile"
            });
        }
    },

    deleteMember: async (req, res) => {
        try {
            await Member.findByIdAndDelete(req.member._id);
            res.status(200).json({
                success: true,
                message: "Account deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete account"
            });
        }
    }
};

module.exports = memberController;
