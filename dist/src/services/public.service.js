"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSkills = listSkills;
exports.listServices = listServices;
const Skill_model_js_1 = require("../models/Skill.model.js");
const Service_model_js_1 = require("../models/Service.model.js");
async function listSkills() {
    return Skill_model_js_1.Skill.find({}).sort({ category: 1, level: -1, name: 1 }).lean();
}
async function listServices() {
    return Service_model_js_1.Service.find({}).sort({ order: 1, title: 1 }).lean();
}
//# sourceMappingURL=public.service.js.map