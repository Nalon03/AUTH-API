"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const env_1 = require("./env");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: env_1.env.DB_URL,
    entities: [User_1.User, Role_1.Role],
    synchronize: true,
});
//# sourceMappingURL=db.js.map