const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const bcrypt = require("bcryptjs");

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, phone, age, gender, password, language } = req.body;

            if (!name || !email || !phone || !age || !gender || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide all required fields"
                });
            }

            if (!/^\d{10}$/.test(String(phone))) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number must be exactly 10 digits"
                });
            }

            const existingMember = await Member.findOne({ email: email.toLowerCase() });

            if (existingMember) {
                return res.status(409).json({
                    success: false,
                    message: "A member with this email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const member = await Member.create({
                name,
                email,
                phone,
                age,
                gender,
                password: hashedPassword,
                language: language || "Telugu"
            });

            const memberResponse = {
                id: member._id,
                name: member.name,
                email: member.email,
                phone: member.phone,
                age: member.age,
                gender: member.gender,
                language: member.language,
                createdAt: member.createdAt
            };

            res.status(201).json({
                success: true,
                message: "Member registered successfully",
                member: memberResponse
            });
        } catch (error) {
            console.error("Register error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to register member"
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide email and password"
                });
            }

            const member = await Member.findOne({ email: email.toLowerCase() });

            if (!member) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const isPasswordValid = await bcrypt.compare(password, member.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                { id: member._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            const memberResponse = {
                id: member._id,
                name: member.name,
                email: member.email,
                phone: member.phone,
                age: member.age,
                gender: member.gender,
                language: member.language,
                createdAt: member.createdAt
            };

            res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                member: memberResponse
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to login"
            });
        }
    },

    getMe: async (req, res) => {
        try {
            const memberResponse = {
                id: req.member._id,
                name: req.member.name,
                email: req.member.email,
                phone: req.member.phone,
                age: req.member.age,
                gender: req.member.gender,
                language: req.member.language,
                createdAt: req.member.createdAt
            };

            res.status(200).json({
                success: true,
                member: memberResponse
            });
        } catch (error) {
            console.error("Get me error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get member details"
            });
        }
    }
};

module.exports = authController;
