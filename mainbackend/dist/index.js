"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//entry point for an express backend
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("./APIs_gateway/userRoutes");
const adminRoutes_1 = require("./APIs_gateway/adminRoutes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/ping', (req, res) => {
    res.status(200).json({ message: "Pong" });
});
app.use("/api/v1/user", userRoutes_1.router);
app.use("/api/v1/admin", adminRoutes_1.adminRouter);
app.listen(3000, () => console.log('server is running on 3000'));
