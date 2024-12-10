"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.get("/ping", (req, res) => {
    res.send("pong");
});
exports.router.post("/register", (req, res) => {
    const { username, email, password } = req.body;
});
exports.router.post("/signin", (req, res) => {
    //>> will go to the engine and process the request
});
exports.router.post("/balance/inr/:userId", (req, res) => {
});
exports.router.post("/balance/inr/:userId", (req, res) => {
});
exports.router.post("/orderbook", (req, res) => {
});
