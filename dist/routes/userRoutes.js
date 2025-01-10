"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controllers/userController");
const authRoutes_1 = __importDefault(require("./authRoutes"));
authRoutes_1.default.get("/user/profile", authMiddleware_1.authenticateUser, userController_1.getUserProfile);
authRoutes_1.default.put("/user/update/profile", authMiddleware_1.authenticateUser, userController_1.updateUserProfile);
authRoutes_1.default.get("/users", authMiddleware_1.authenticateUser, adminController_1.getUsers);
authRoutes_1.default.get("/users/:id", authMiddleware_1.authenticateUser, adminController_1.getUserById);
exports.default = authRoutes_1.default;
//# sourceMappingURL=userRoutes.js.map