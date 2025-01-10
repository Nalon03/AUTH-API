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
exports.loginUser = exports.registerUser = void 0;
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const hashUtils_1 = require("../utils/hashUtils");
const tokenUtils_1 = require("../utils/tokenUtils");
const Role_1 = require("../models/Role");
const registerUser = (firstName, lastName, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = db_1.AppDataSource.getRepository(User_1.User);
    const roleRepo = db_1.AppDataSource.getRepository(Role_1.Role);
    const existingUser = yield userRepo.findOne({ where: { email } });
    if (existingUser) {
        throw new Error("Email already registered");
    }
    const hashedPassword = yield (0, hashUtils_1.hashPassword)(password);
    const userRole = yield roleRepo.findOne({ where: { name: "user" } });
    if (!userRole) {
        throw new Error("Role not found");
    }
    const user = userRepo.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roles: [userRole],
    });
    return userRepo.save(user);
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = db_1.AppDataSource.getRepository(User_1.User);
    const user = yield userRepo.findOne({
        where: { email },
        relations: ["roles"],
    });
    if (!user || !(yield (0, hashUtils_1.comparePassword)(password, user.password))) {
        throw new Error("Invalid email or password");
    }
    const userRoles = user.roles.map((role) => role.name);
    const accessToken = (0, tokenUtils_1.generateAccessToken)(user.id, userRoles);
    const refreshToken = (0, tokenUtils_1.generateRefreshToken)(user.id);
    return { accessToken, refreshToken, user: Object.assign(Object.assign({}, user), { roles: userRoles }) };
});
exports.loginUser = loginUser;
//# sourceMappingURL=authService.js.map