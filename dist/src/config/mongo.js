"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
async function connectMongo() {
    mongoose_1.default.set("strictQuery", true);
    try {
        await mongoose_1.default.connect(env_1.ENV.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("[mongo] connected ✅");
    }
    catch (err) {
        console.error("[mongo] connection failed ❌", err);
        throw err;
    }
}
//# sourceMappingURL=mongo.js.map