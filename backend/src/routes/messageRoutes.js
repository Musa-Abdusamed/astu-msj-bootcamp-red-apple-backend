const express = require("express");

const {
  sendMessage,
  getConversation,
  getInbox,
  markAsRead,
} = require("../controllers/messageController");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", sendMessage);

router.get("/conversation/:userId", getConversation);

router.get("/inbox", getInbox);

router.patch("/:id/read", markAsRead);

module.exports = router;
