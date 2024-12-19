import express from "express";
import {
  register,
  login,
  generateAccessToken,
  generateRefreshToken,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/generate-access-token", generateAccessToken);
router.post("/generate-refresh-token", generateRefreshToken);

export default router;
