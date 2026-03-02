"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAll = seedAll;
const env_js_1 = require("../config/env.js");
const user_model_js_1 = require("../models/user.model.js");
const project_model_js_1 = require("../models/project.model.js");
const Skill_model_js_1 = require("../models/Skill.model.js");
const Service_model_js_1 = require("../models/Service.model.js");
const crypto_js_1 = require("../utils/crypto.js");
async function seedAll() {
    // Admin user
    const admin = await user_model_js_1.User.findOne({ email: env_js_1.ENV.ADMIN_EMAIL }).lean();
    if (!admin) {
        const passwordHash = await (0, crypto_js_1.hashPassword)(env_js_1.ENV.ADMIN_PASSWORD);
        await user_model_js_1.User.create({ email: env_js_1.ENV.ADMIN_EMAIL, passwordHash, role: "admin" });
        console.log(`[seed] admin created: ${env_js_1.ENV.ADMIN_EMAIL}`);
    }
    else {
        console.log(`[seed] admin exists: ${env_js_1.ENV.ADMIN_EMAIL}`);
    }
    // Skills (idempotente simple: crea si no existe)
    const skills = [
        { name: "Angular", level: 5, category: "Frontend" },
        { name: "Node.js", level: 5, category: "Backend" },
        { name: "MongoDB", level: 4, category: "Database" },
        { name: "Docker", level: 4, category: "DevOps" },
        { name: "Traefik", level: 4, category: "DevOps" }
    ];
    for (const s of skills) {
        await Skill_model_js_1.Skill.updateOne({ name: s.name }, { $setOnInsert: s }, { upsert: true });
    }
    // Services
    const services = [
        { title: "Landing / Portafolio", description: "Sitios rápidos, SEO y diseño moderno.", highlights: ["SEO", "Performance", "Diseño"], order: 1 },
        { title: "Full-Stack Apps", description: "Angular + API + DB listos para producción.", highlights: ["JWT", "Admin", "CRUD"], order: 2 },
        { title: "DevOps / Deploy", description: "Docker, Traefik, CI/CD, VPS o cloud.", highlights: ["HTTPS", "CI/CD", "Hardening"], order: 3 }
    ];
    for (const s of services) {
        await Service_model_js_1.Service.updateOne({ title: s.title }, { $setOnInsert: s }, { upsert: true });
    }
    // Projects (si está vacío)
    const count = await project_model_js_1.Project.countDocuments({});
    if (count === 0) {
        await project_model_js_1.Project.create([
            {
                title: "Cochisweb Starter",
                slug: "cochisweb-starter",
                summary: "Portafolio dinámico con panel admin y deploy con Traefik.",
                content: "Proyecto inicial de Cochisweb con Angular + Node + Mongo.\n\n- SEO por proyecto\n- Admin CRUD\n- Docker compose perfiles",
                coverImageUrl: "",
                tags: ["portfolio", "angular", "node", "docker"],
                stack: ["Angular 21", "Express", "MongoDB", "Traefik"],
                links: { liveUrl: "https://cochisweb.com", repoUrl: "", videoUrl: "" },
                status: "published",
                publishedAt: new Date()
            },
            {
                title: "Proyecto Draft Ejemplo",
                slug: "draft-ejemplo",
                summary: "Un proyecto en borrador no visible en público.",
                content: "Este es un draft para mostrar el flujo en admin.",
                tags: ["draft"],
                stack: ["Angular", "Node"],
                links: { liveUrl: "", repoUrl: "", videoUrl: "" },
                status: "draft",
                publishedAt: null
            }
        ]);
        console.log("[seed] projects created");
    }
    else {
        console.log("[seed] projects already exist");
    }
}
//# sourceMappingURL=seed.service.js.map