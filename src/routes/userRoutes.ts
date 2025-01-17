import { getUserById, getUsers } from "../controllers/adminController";
import { authenticateUser, isAdmin } from "../middleware/authMiddleware";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import router from "./authRoutes";

router.get("/user/profile", authenticateUser, getUserProfile);
router.put("/user/update/profile", authenticateUser, updateUserProfile);
router.get("/users",authenticateUser,  getUsers);
router.get("/users/:id", authenticateUser, getUserById);
export default router;
