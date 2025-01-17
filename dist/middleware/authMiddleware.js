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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authorizeAdmin = exports.authorizeRole = exports.authenticateUser = void 0;
const tokenUtils_1 = require("../utils/tokenUtils");
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const db_1 = require("../config/db");
const unauthorizedResponse = (res, message) => {
    return res.status(401).json({ message });
};
const forbiddenResponse = (res, message) => {
    return res.status(403).json({ message });
};
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get("authorization");
    if (!authHeader)
        return unauthorizedResponse(res, "Unauthorized");
    const tokenPrefix = "Bearer ";
    if (!authHeader.startsWith(tokenPrefix))
        return unauthorizedResponse(res, "Unauthorized");
    const token = authHeader.slice(tokenPrefix.length).trim();
    if (!token)
        return unauthorizedResponse(res, "Unauthorized");
    try {
        const decoded = (0, tokenUtils_1.verifyToken)(token, env_1.env.JWT_ACCESS_SECRET);
        if (!decoded || !decoded.id)
            return unauthorizedResponse(res, "Unauthorized");
        const userRepo = db_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOne({
            where: { id: decoded.id },
            relations: ["roles"],
        });
        if (!user)
            return unauthorizedResponse(res, "User not found");
        req.user = {
            id: user.id,
            role: user.roles.map((role) => role.name),
            iat: decoded.iat,
            exp: decoded.exp,
        };
        next();
    }
    catch (error) {
        console.error("Authentication Error:", {
            name: error instanceof Error ? error.name : "Unknown Error",
            message: error instanceof Error ? error.message : "No error message",
            stack: error instanceof Error ? error.stack : "No stack trace",
        });
        if (error instanceof Error) {
            switch (error.name) {
                case "TokenExpiredError":
                    return unauthorizedResponse(res, "Token expired");
                case "JsonWebTokenError":
                    return unauthorizedResponse(res, "Invalid token");
                default:
                    return forbiddenResponse(res, "Authentication error");
            }
        }
        return forbiddenResponse(res, "Unexpected authentication error");
    }
});
exports.authenticateUser = authenticateUser;
const authorizeRole = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return forbiddenResponse(res, "Forbidden - No user found");
        if (!req.user.role.some((roleName) => roles.includes(roleName))) {
            return forbiddenResponse(res, "Forbidden - Insufficient permissions");
        }
        next();
    });
};
exports.authorizeRole = authorizeRole;
const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.role.includes("admin")) {
        return forbiddenResponse(res, "Forbidden - Admins only");
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
exports.isAdmin = (0, exports.authorizeRole)(["admin"]);
//# sourceMappingURL=authMiddleware.js.map