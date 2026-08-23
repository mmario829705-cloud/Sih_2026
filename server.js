require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const chatRoutes = require("./routes/chatRoutes");
const symptomRoutes = require("./routes/symptomRoutes");

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests (curl, server-to-server) and any request
        // when no FRONTEND_URL is configured (local dev convenience).
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 8000;

const MONGO_URI =
    process.env.MONGO_URI ||
    `mongodb+srv://${encodeURIComponent(process.env.MONGO_USERNAME || "")}:${encodeURIComponent(process.env.MONGO_PASSWORD || "")}@${process.env.MONGO_CLUSTER || ""}/${process.env.MONGO_DATABASE || ""}?appName=Cluster0`;

console.log("Connecting to MongoDB Atlas...");
if (process.env.MONGO_URI) {
    console.log("Using MONGO_URI from .env");
} else {
    console.log("Cluster:", process.env.MONGO_CLUSTER);
    console.log("Database:", process.env.MONGO_DATABASE);
}

mongoose
    .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        family: 4
    })
    .then(() => {
        console.log("✅ MongoDB Atlas connected successfully");
        console.log("✅ Database:", mongoose.connection.name);
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
    });

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Arogya Innovators Healthcare Chatbot API is running",
        version: "1.0.0"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        server: "running",
        database: mongoose.connection.name || "not connected",
        databaseStatus:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/symptoms", symptomRoutes);

console.log("Routes mounted: /api/auth, /api/members, /api/chat, /api/symptoms");

app.get("/api/phcs", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.district) {
      const term = String(req.query.district).trim();
      const districtAliases = {
        anantapur: "Ananthapuramu",
        "dr. b.r. ambedkar konaseema": "Dr. B. R. Ambedkar Konaseema",
        "y.s.r. kadapa": "YSR Kadapa"
      };
      const normalizedTerm = districtAliases[term.toLowerCase()] || term;
      const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.district = new RegExp(escaped, "i");
    }
    if (req.query.mandal) {
      const term = String(req.query.mandal).trim();
      query.mandal = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }

    const PHC = require("./models/PHC");
    const phcs = await PHC.find(query).sort({ district: 1, mandal: 1, name: 1 }).lean();

    res.status(200).json({
      success: true,
      count: phcs.length,
      data: phcs,
      note: "PHC data sourced from Andhra Pradesh government records."
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/stats", async (req, res, next) => {
  try {
    const Member = require("./models/Member");
    const SymptomAssessment = require("./models/SymptomAssessment");
    const PHC = require("./models/PHC");

    const totalMembers = await Member.countDocuments();
    const totalAssessments = await SymptomAssessment.countDocuments();
    const emergencyCases = await SymptomAssessment.countDocuments({ triageLevel: "EMERGENCY" });
    const totalPHCs = await PHC.countDocuments();

    const recentAssessments = await SymptomAssessment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("symptoms triageLevel language createdAt");

    res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        totalAssessments,
        emergencyCases,
        totalPHCs
      },
      recentAssessments
    });
  } catch (error) {
    next(error);
  }
});

const PHC = require("./models/PHC");

const PHC_SEED = [
  { name: "Paderu Area Hospital", district: "Alluri Sitharama Raju", mandal: "Paderu", type: "AH" },
  { name: "Chintapalli PHC", district: "Alluri Sitharama Raju", mandal: "Chintapalli", type: "PHC" },
  { name: "Rampachodavaram PHC", district: "Alluri Sitharama Raju", mandal: "Rampachodavaram", type: "PHC" },
  { name: "Anakapalli District Hospital", district: "Anakapalli", mandal: "Anakapalli", type: "DH" },
  { name: "Narsipatnam PHC", district: "Anakapalli", mandal: "Narsipatnam", type: "PHC" },
  { name: "Payakaraopeta PHC", district: "Anakapalli", mandal: "Payakaraopeta", type: "PHC" },
  { name: "Anantapur District Hospital", district: "Ananthapuramu", mandal: "Anantapur", type: "DH" },
  { name: "Guntakal PHC", district: "Ananthapuramu", mandal: "Guntakal", type: "PHC" },
  { name: "Hindupur PHC", district: "Ananthapuramu", mandal: "Hindupur", type: "PHC" },
  { name: "Kadiri PHC", district: "Ananthapuramu", mandal: "Kadiri", type: "PHC" },
  { name: "Rayachoti District Hospital", district: "Annamayya", mandal: "Rayachoti", type: "DH" },
  { name: "Madanapalle PHC", district: "Annamayya", mandal: "Madanapalle", type: "PHC" },
  { name: "Rajampeta PHC", district: "Annamayya", mandal: "Rajampeta", type: "PHC" },
  { name: "Bapatla District Hospital", district: "Bapatla", mandal: "Bapatla", type: "DH" },
  { name: "Chirala PHC", district: "Bapatla", mandal: "Chirala", type: "PHC" },
  { name: "Repalle PHC", district: "Bapatla", mandal: "Repalle", type: "PHC" },
  { name: "Chittoor District Hospital", district: "Chittoor", mandal: "Chittoor", type: "DH" },
  { name: "Tirupati PHC", district: "Chittoor", mandal: "Tirupati", type: "PHC" },
  { name: "Palamaner PHC", district: "Chittoor", mandal: "Palamaner", type: "PHC" },
  { name: "Punganur PHC", district: "Chittoor", mandal: "Punganur", type: "PHC" },
  { name: "Amalapuram District Hospital", district: "Dr. B. R. Ambedkar Konaseema", mandal: "Amalapuram", type: "DH" },
  { name: "Razole PHC", district: "Dr. B. R. Ambedkar Konaseema", mandal: "Razole", type: "PHC" },
  { name: "Kothapeta PHC", district: "Dr. B. R. Ambedkar Konaseema", mandal: "Kothapeta", type: "PHC" },
  { name: "Rajahmundry District Hospital", district: "East Godavari", mandal: "Rajahmundry", type: "DH" },
  { name: "Kakinada PHC", district: "East Godavari", mandal: "Kakinada", type: "PHC" },
  { name: "Peddapuram PHC", district: "East Godavari", mandal: "Peddapuram", type: "PHC" },
  { name: "Tuni PHC", district: "East Godavari", mandal: "Tuni", type: "PHC" },
  { name: "Eluru District Hospital", district: "Eluru", mandal: "Eluru", type: "DH" },
  { name: "Nuzvid PHC", district: "Eluru", mandal: "Nuzvid", type: "PHC" },
  { name: "Jangareddigudem PHC", district: "Eluru", mandal: "Jangareddigudem", type: "PHC" },
  { name: "Guntur District Hospital", district: "Guntur", mandal: "Guntur", type: "DH" },
  { name: "Tenali PHC", district: "Guntur", mandal: "Tenali", type: "PHC" },
  { name: "Mangalagiri PHC", district: "Guntur", mandal: "Mangalagiri", type: "PHC" },
  { name: "Sattenapalle PHC", district: "Guntur", mandal: "Sattenapalle", type: "PHC" },
  { name: "Kakinada District Hospital", district: "Kakinada", mandal: "Kakinada", type: "DH" },
  { name: "Peddapuram PHC", district: "Kakinada", mandal: "Peddapuram", type: "PHC" },
  { name: "Samalkota PHC", district: "Kakinada", mandal: "Samalkota", type: "PHC" },
  { name: "Machilipatnam District Hospital", district: "Krishna", mandal: "Machilipatnam", type: "DH" },
  { name: "Gudivada PHC", district: "Krishna", mandal: "Gudivada", type: "PHC" },
  { name: "Vijayawada PHC", district: "Krishna", mandal: "Vijayawada", type: "PHC" },
  { name: "Nandigama PHC", district: "Krishna", mandal: "Nandigama", type: "PHC" },
  { name: "Kurnool District Hospital", district: "Kurnool", mandal: "Kurnool", type: "DH" },
  { name: "Adoni PHC", district: "Kurnool", mandal: "Adoni", type: "PHC" },
  { name: "Nandyal PHC", district: "Kurnool", mandal: "Nandyal", type: "PHC" },
  { name: "Dhone PHC", district: "Kurnool", mandal: "Dhone", type: "PHC" },
  { name: "Nandyal District Hospital", district: "Nandyal", mandal: "Nandyal", type: "DH" },
  { name: "Atmakur PHC", district: "Nandyal", mandal: "Atmakur", type: "PHC" },
  { name: "Allagadda PHC", district: "Nandyal", mandal: "Allagadda", type: "PHC" },
  { name: "Banaganapalle PHC", district: "Nandyal", mandal: "Banaganapalle", type: "PHC" },
  { name: "Vijayawada District Hospital", district: "NTR", mandal: "Vijayawada", type: "DH" },
  { name: "Nandigama PHC", district: "NTR", mandal: "Nandigama", type: "PHC" },
  { name: "Tiruvuru PHC", district: "NTR", mandal: "Tiruvuru", type: "PHC" },
  { name: "Gannavaram PHC", district: "NTR", mandal: "Gannavaram", type: "PHC" },
  { name: "Narasaraopet District Hospital", district: "Palnadu", mandal: "Narasaraopet", type: "DH" },
  { name: "Sattenapalle PHC", district: "Palnadu", mandal: "Sattenapalle", type: "PHC" },
  { name: "Gurazala PHC", district: "Palnadu", mandal: "Gurazala", type: "PHC" },
  { name: "Vinukonda PHC", district: "Palnadu", mandal: "Vinukonda", type: "PHC" },
  { name: "Parvathipuram District Hospital", district: "Parvathipuram Manyam", mandal: "Parvathipuram", type: "DH" },
  { name: "Palakonda PHC", district: "Parvathipuram Manyam", mandal: "Palakonda", type: "PHC" },
  { name: "Salur PHC", district: "Parvathipuram Manyam", mandal: "Salur", type: "PHC" },
  { name: "Ongole District Hospital", district: "Prakasam", mandal: "Ongole", type: "DH" },
  { name: "Markapur PHC", district: "Prakasam", mandal: "Markapur", type: "PHC" },
  { name: "Kanigiri PHC", district: "Prakasam", mandal: "Kanigiri", type: "PHC" },
  { name: "Chirala PHC", district: "Prakasam", mandal: "Chirala", type: "PHC" },
  { name: "Srikakulam District Hospital", district: "Srikakulam", mandal: "Srikakulam", type: "DH" },
  { name: "Palasa PHC", district: "Srikakulam", mandal: "Palasa", type: "PHC" },
  { name: "Tekkali PHC", district: "Srikakulam", mandal: "Tekkali", type: "PHC" },
  { name: "Ichapuram PHC", district: "Srikakulam", mandal: "Ichapuram", type: "PHC" },
  { name: "Nellore District Hospital", district: "Sri Potti Sriramulu Nellore", mandal: "Nellore", type: "DH" },
  { name: "Kavali PHC", district: "Sri Potti Sriramulu Nellore", mandal: "Kavali", type: "PHC" },
  { name: "Gudur PHC", district: "Sri Potti Sriramulu Nellore", mandal: "Gudur", type: "PHC" },
  { name: "Sullurpet PHC", district: "Sri Potti Sriramulu Nellore", mandal: "Sullurpet", type: "PHC" },
  { name: "Puttaparthi District Hospital", district: "Sri Sathya Sai", mandal: "Puttaparthi", type: "DH" },
  { name: "Dharmavaram PHC", district: "Sri Sathya Sai", mandal: "Dharmavaram", type: "PHC" },
  { name: "Penukonda PHC", district: "Sri Sathya Sai", mandal: "Penukonda", type: "PHC" },
  { name: "Kadiri PHC", district: "Sri Sathya Sai", mandal: "Kadiri", type: "PHC" },
  { name: "Tirupati District Hospital", district: "Tirupati", mandal: "Tirupati", type: "DH" },
  { name: "Srikalahasti PHC", district: "Tirupati", mandal: "Srikalahasti", type: "PHC" },
  { name: "Puttur PHC", district: "Tirupati", mandal: "Puttur", type: "PHC" },
  { name: "Nagari PHC", district: "Tirupati", mandal: "Nagari", type: "PHC" },
  { name: "Visakhapatnam District Hospital", district: "Visakhapatnam", mandal: "Visakhapatnam", type: "DH" },
  { name: "Bheemunipatnam PHC", district: "Visakhapatnam", mandal: "Bheemunipatnam", type: "PHC" },
  { name: "Anakapalli PHC", district: "Visakhapatnam", mandal: "Anakapalli", type: "PHC" },
  { name: "Vizianagaram District Hospital", district: "Vizianagaram", mandal: "Vizianagaram", type: "DH" },
  { name: "Bobbili PHC", district: "Vizianagaram", mandal: "Bobbili", type: "PHC" },
  { name: "Salur PHC", district: "Vizianagaram", mandal: "Salur", type: "PHC" },
  { name: "Bhimavaram District Hospital", district: "West Godavari", mandal: "Bhimavaram", type: "DH" },
  { name: "Narasapuram PHC", district: "West Godavari", mandal: "Narasapuram", type: "PHC" },
  { name: "Tadepalligudem PHC", district: "West Godavari", mandal: "Tadepalligudem", type: "PHC" },
  { name: "Kovvur PHC", district: "West Godavari", mandal: "Kovvur", type: "PHC" },
  { name: "Kadapa District Hospital", district: "YSR Kadapa", mandal: "Kadapa", type: "DH" },
  { name: "Pulivendula PHC", district: "YSR Kadapa", mandal: "Pulivendula", type: "PHC" },
  { name: "Badvel PHC", district: "YSR Kadapa", mandal: "Badvel", type: "PHC" },
  { name: "Jammalamadugu PHC", district: "YSR Kadapa", mandal: "Jammalamadugu", type: "PHC" }
];

async function seedPHCs() {
  try {
    const count = await PHC.countDocuments();
    if (count > 0) {
      console.log(`PHC seed skipped: ${count} records already exist.`);
      return;
    }

    await PHC.insertMany(PHC_SEED);
    console.log(`PHC seed completed: ${PHC_SEED.length} PHCs inserted.`);
  } catch (error) {
    console.error("PHC seed failed:", error.message);
  }
}

seedPHCs();

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
