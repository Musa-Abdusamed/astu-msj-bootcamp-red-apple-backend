const express = require("express");

const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const { protect } = require("../middleware/auth.middleware");
const { restrictTo } = require("../middleware/role.middleware");

const router = express.Router();

router.use(protect);

router.get("/", getAnnouncements);

router.get("/:id", getAnnouncement);

router.post("/", restrictTo("admin", "mentor"), createAnnouncement);

router.patch("/:id", restrictTo("admin", "mentor"), updateAnnouncement);

router.delete("/:id", restrictTo("admin", "mentor"), deleteAnnouncement);

module.exports = router;
