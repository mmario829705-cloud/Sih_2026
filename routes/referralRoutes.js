const express = require("express");
const router = express.Router();
const referralController = require("../controllers/referralController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", referralController.createReferral);
router.get("/", referralController.getReferrals);
router.put("/:id/status", referralController.updateReferralStatus);

module.exports = router;
