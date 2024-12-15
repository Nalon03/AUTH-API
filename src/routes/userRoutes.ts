import { getUserById, getUsers } from "../controllers/adminController";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import router from "./authRoutes";

router.get("/user/profile", authenticateToken, getUserProfile);
router.put("/user/update", authenticateToken, updateUserProfile);
router.get("/users", authenticateToken, getUsers);
router.get("/users/:id", authenticateToken, getUserById);
export default router;
