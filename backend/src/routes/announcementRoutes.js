import express from "express"
import { createSchoolAnnouncement, fetchSchoolAnnouncement } from "../controllers/announcementController.js";
import { requireAdmin } from "../middleware/index.js";

const router  = express.Router();
router.get("/:slug/fetch-school-announcement", fetchSchoolAnnouncement);
router.post("/:slug/create-school-announcement", requireAdmin, createSchoolAnnouncement);
export default router;