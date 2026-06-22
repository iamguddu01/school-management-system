import express from "express"
import { createSchoolAnnouncement, fetchSchoolAnnouncement, updateSchoolAnnouncement, deleteSchoolAnnouncement } from "../controllers/announcementController.js";
import { requireAdmin } from "../middleware/index.js";

const router  = express.Router();
router.get("/:slug/fetch-school-announcement", fetchSchoolAnnouncement);
router.post("/:slug/create-school-announcement", requireAdmin, createSchoolAnnouncement);
router.put("/:slug/update-school-announcement/:id", requireAdmin, updateSchoolAnnouncement);
router.delete("/:slug/delete-school-announcement/:id", requireAdmin, deleteSchoolAnnouncement);
export default router;