"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const generateAccessToken = (id, roles) => {
    return jsonwebtoken_1.default.sign({ id, roles }, env_1.env.JWT_ACCESS_SECRET, {
        expiresIn: "2h",
        algorithm: "HS256"
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, env_1.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
        algorithm: "HS256"
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token, secret) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret, {
            algorithms: ['HS256']
        });
        if (!decoded.id) {
            throw new Error("Invalid token payload");
        }
        return decoded;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error("Token has expired");
        }
        else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error("Invalid token");
        }
        else {
            throw new Error("Token verification failed");
        }
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=tokenUtils.js.map