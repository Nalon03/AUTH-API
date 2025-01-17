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
exports.updateUserProfile = exports.getUserProfile = void 0;
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const handleError = (res, error) => {
    const err = error;
    res
        .status(err.statusCode || 400)
        .json({ success: false, message: err.message || "An error occurred" });
};
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        const userRepo = db_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOne({
            where: { id: userId },
            relations: ["roles"],
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        const errorResponse = {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error occurred",
        };
        res.status(500).json(errorResponse);
    }
});
exports.getUserProfile = getUserProfile;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        const { firstName, lastName, email } = req.body;
        const userRepo = db_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        const updatedUser = yield userRepo.save(user);
        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=userController.js.map