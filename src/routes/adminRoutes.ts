import express from "express";
import { updateUserRole } from "../controllers/adminController";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware";
import router from "./authRoutes";

router.put("/update-role", authenticateToken, isAdmin, updateUserRole);

export default router;
