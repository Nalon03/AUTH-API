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
exports.changeUserRole = void 0;
const typeorm_1 = require("typeorm");
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const changeUserRole = (userId, newRoles) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = db_1.AppDataSource.getRepository(User_1.User);
    const roleRepo = db_1.AppDataSource.getRepository(Role_1.Role);
    const user = yield userRepo.findOne({
        where: { id: userId },
        relations: ["roles"],
    });
    if (!user)
        throw new Error("User not found");
    const validRoles = ["user", "admin"];
    if (!newRoles.every((roleName) => validRoles.includes(roleName))) {
        throw new Error("Invalid role name provided");
    }
    const rolesToAssign = yield roleRepo.findBy({ name: (0, typeorm_1.In)(newRoles) });
    user.roles = rolesToAssign;
    console.log("Roles to assign:", rolesToAssign);
    return yield userRepo.save(user);
});
exports.changeUserRole = changeUserRole;
//# sourceMappingURL=userService.js.map