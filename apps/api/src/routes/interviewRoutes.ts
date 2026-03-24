import { Router } from "express";
import { listInterviews, startInterview, submitInterview } from "../controllers/interviewController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listInterviews);
router.post("/", requireAuth, startInterview);
router.post("/:id/submit", requireAuth, submitInterview);

export default router;
