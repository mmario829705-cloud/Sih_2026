const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", memberController.getMembers);
router.get("/:id", memberController.getMemberById);
router.put("/profile", memberController.updateMember);
router.delete("/profile", memberController.deleteMember);

module.exports = router;
