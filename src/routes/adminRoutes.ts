import { deleteUser, updateUserRole } from "../controllers/adminController";
import router from "./authRoutes";

router.put("/update/users/role", updateUserRole);
router.delete("/users/:userId", deleteUser);
export default router;
