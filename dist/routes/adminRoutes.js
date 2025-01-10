"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminController_1 = require("../controllers/adminController");
const authRoutes_1 = __importDefault(require("./authRoutes"));
authRoutes_1.default.get("/all/roles", adminController_1.getAllRoles);
authRoutes_1.default.put("/update/user/role", adminController_1.updateUserRole);
authRoutes_1.default.delete("/users/:userId", adminController_1.deleteUser);
exports.default = authRoutes_1.default;
//# sourceMappingURL=adminRoutes.js.map