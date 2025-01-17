import { deleteUser, getAllRoles, updateUserRole } from "../controllers/adminController";
import router from "./authRoutes";

router.get("/all/roles", getAllRoles);
router.put("/update/user/role", updateUserRole);
router.delete("/users/:userId", deleteUser);
export default router;
