"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const cors_1 = require("./config/cors");
const env_1 = require("./config/env");
const roleInitializer_1 = require("./utils/roleInitializer");
const authMiddleware_1 = require("./middleware/authMiddleware");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors_1.corsConfig);
app.use("/api/auth", authRoutes_1.default);
app.use("/api", userRoutes_1.default);
app.use("/api/admin", authMiddleware_1.authenticateUser, authMiddleware_1.authorizeAdmin, adminRoutes_1.default);
db_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database connected");
    yield (0, roleInitializer_1.initializeRoles)();
    app.listen(env_1.env.PORT, () => console.log(`Server running on port ${env_1.env.PORT}`));
}))
    .catch((error) => console.error("Database connection error:", error));
//# sourceMappingURL=app.js.map