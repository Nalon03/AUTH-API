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
exports.getAllRoles = exports.deleteUser = exports.getUserById = exports.updateUserRole = exports.getUsers = void 0;
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const userService_1 = require("../services/userService");
const Role_1 = require("../models/Role");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepo = db_1.AppDataSource.getRepository(User_1.User);
        const users = yield userRepo.find({ relations: ["roles"] });
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        const errorResponse = {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error occurred",
        };
        res.status(500).json(errorResponse);
    }
});
exports.getUsers = getUsers;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, newRoles } = req.body;
        if (!userId || !newRoles || !Array.isArray(newRoles)) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
            });
        }
        if (!req.user || !req.user.role.includes("admin")) {
            return res.status(403).json({
                success: false,
                message: "Forbidden - Only admins can modify roles",
            });
        }
        const updatedUser = yield (0, userService_1.changeUserRole)(userId, newRoles);
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found or update failed",
            });
        }
        res
            .status(200)
            .json({ success: true, data: updatedUser });
    }
    catch (error) {
        const errorResponse = {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error occurred",
        };
        res.status(500).json(errorResponse);
    }
});
exports.updateUserRole = updateUserRole;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userRepo = db_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOne({
            where: { id: id },
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
exports.getUserById = getUserById;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!req.user || !req.user.role.includes("admin")) {
            return res.status(403).json({
                success: false,
                message: "Forbidden - Only admins can delete users",
            });
        }
        const userRepo = db_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        yield userRepo.remove(user);
        res
            .status(200)
            .json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        const errorResponse = {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error occurred",
        };
        res.status(500).json(errorResponse);
    }
});
exports.deleteUser = deleteUser;
const getAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleRepo = db_1.AppDataSource.getRepository(Role_1.Role);
        const roles = yield roleRepo.find();
        res.json({ success: true, data: roles });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch roles" });
    }
});
exports.getAllRoles = getAllRoles;
//# sourceMappingURL=adminController.js.map