"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SkillSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    level: { type: Number, min: 1, max: 5, default: 3 },
    category: { type: String, default: "General" }
}, { timestamps: true });
exports.Skill = mongoose_1.default.model("Skill", SkillSchema);
//# sourceMappingURL=Skill.model.js.map