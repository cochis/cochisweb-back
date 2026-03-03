import { Skill } from "../models/Skill.model.js";
import { Service } from "../models/Service.model.js";
export async function listSkills() {
    return Skill.find({}).sort({ category: 1, level: -1, name: 1 }).lean();
}
export async function listServices() {
    return Service.find({}).sort({ order: 1, title: 1 }).lean();
}
//# sourceMappingURL=public.service.js.map