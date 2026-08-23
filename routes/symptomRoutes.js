const express = require("express");
const router = express.Router();
const symptomController = require("../controllers/symptomController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/assess", symptomController.assess);
router.get("/history", symptomController.getHistory);
router.get("/:id", symptomController.getAssessmentById);

module.exports = router;
