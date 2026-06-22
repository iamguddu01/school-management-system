import express from "express"
import {
    fetchSchoolInformationController,
    updateSchoolInformationController,
    fetchSchoolMembersController,
    addSchoolMemberController,
    addSchoolMembersBulkController,
    fetchAttendanceController,
    saveAttendanceController,
    fetchAllSchoolsController,
    fetchDashboardStatsController,
    fetchMyAttendanceController
} from "../controllers/schoolController.js";
import { requireAdmin, requireAuth } from "../middleware/index.js";

const router = express.Router();
router.get("/all", fetchAllSchoolsController);
router.get("/:slug/school-information", fetchSchoolInformationController)
router.put("/:slug/update-school-information", requireAdmin, updateSchoolInformationController);
router.get("/:slug/members", requireAdmin, fetchSchoolMembersController);
router.post("/:slug/members", requireAdmin, addSchoolMemberController);
router.post("/:slug/members/bulk", requireAdmin, addSchoolMembersBulkController);
router.get("/:slug/attendance", requireAdmin, fetchAttendanceController);
router.post("/:slug/attendance", requireAdmin, saveAttendanceController);
router.get("/:slug/dashboard-stats", requireAuth, fetchDashboardStatsController);
router.get("/:slug/my-attendance", requireAuth, fetchMyAttendanceController);
export default router