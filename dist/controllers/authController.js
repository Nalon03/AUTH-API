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
exports.loginUser = exports.generateRefreshToken = exports.generateAccessToken = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
Object.defineProperty(exports, "loginUser", { enumerable: true, get: function () { return authService_1.loginUser; } });
const sendResponse = (res, statusCode, data, success) => {
    res.status(statusCode).json({ success, data });
};
const handleError = (res, error) => {
    const err = error;
    res
        .status(err.statusCode || 400)
        .json({ success: false, message: err.message || "An error occurred" });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        yield (0, authService_1.registerUser)(firstName, lastName, email, password);
        sendResponse(res, 201, { message: "Registration successful" }, true);
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const tokens = yield (0, authService_1.loginUser)(email, password);
        sendResponse(res, 200, tokens, true);
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.login = login;
const generateAccessToken = (req, res) => {
    try {
        const { id, roles } = req.body;
        const accessToken = (0, exports.generateAccessToken)(id, roles);
        sendResponse(res, 200, { accessToken }, true);
    }
    catch (error) {
        handleError(res, error);
    }
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (req, res) => {
    try {
        const { id, roles } = req.body;
        const refreshToken = (0, exports.generateRefreshToken)(id, roles);
        sendResponse(res, 200, { refreshToken }, true);
    }
    catch (error) {
        handleError(res, error);
    }
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=authController.js.map