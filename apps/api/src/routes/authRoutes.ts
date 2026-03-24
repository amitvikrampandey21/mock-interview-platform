import { Router } from "express";
import { getCurrentSession, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.get("/me", requireAuth, getCurrentSession);

export default router;
