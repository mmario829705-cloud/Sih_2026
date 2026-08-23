const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const { chatLimiter } = require("../middleware/rateLimitMiddleware");

router.use(authMiddleware);

router.post("/", chatLimiter, chatController.sendMessage);
router.get("/sessions", chatController.getSessions);
router.get("/sessions/:id", chatController.getSessionById);
router.post("/sessions", chatController.createSession);
router.delete("/sessions/:id", chatController.deleteSession);

module.exports = router;
