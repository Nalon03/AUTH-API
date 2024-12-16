import express from "express";
import { register, login } from "../controllers/authController";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/generate-access-token", (req, res) => {
  const { id, roles } = req.body;
  const accessToken = generateAccessToken(id, roles);
  return res.json({ accessToken });
});

router.post("/generate-refresh-token", (req, res) => {
  const { id } = req.body;
  const refreshToken = generateRefreshToken(id);
  return res.json({ refreshToken });
});
export default router;
