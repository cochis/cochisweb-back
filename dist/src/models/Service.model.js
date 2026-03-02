"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ServiceSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 }
}, { timestamps: true });
exports.Service = mongoose_1.default.model("Service", ServiceSchema);
//# sourceMappingURL=Service.model.js.map