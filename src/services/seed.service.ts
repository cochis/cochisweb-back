import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Skill } from "../models/Skill.model.js";
import { Service } from "../models/Service.model.js";
import { hashPassword } from "../utils/crypto.js";

export async function seedAll(): Promise<void> {
    // Admin user
    const admin = await User.findOne({ email: ENV.ADMIN_EMAIL }).lean();
    if (!admin) {
        const passwordHash = await hashPassword(ENV.ADMIN_PASSWORD);
        await User.create({ email: ENV.ADMIN_EMAIL, passwordHash, role: "admin" });
        console.log(`[seed] admin created: ${ENV.ADMIN_EMAIL}`);
    } else {
        console.log(`[seed] admin exists: ${ENV.ADMIN_EMAIL}`);
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
        await Skill.updateOne({ name: s.name }, { $setOnInsert: s }, { upsert: true });
    }

    // Services
    const services = [
        { title: "Landing / Portafolio", description: "Sitios rápidos, SEO y diseño moderno.", highlights: ["SEO", "Performance", "Diseño"], order: 1 },
        { title: "Full-Stack Apps", description: "Angular + API + DB listos para producción.", highlights: ["JWT", "Admin", "CRUD"], order: 2 },
        { title: "DevOps / Deploy", description: "Docker, Traefik, CI/CD, VPS o cloud.", highlights: ["HTTPS", "CI/CD", "Hardening"], order: 3 }
    ];
    for (const s of services) {
        await Service.updateOne({ title: s.title }, { $setOnInsert: s }, { upsert: true });
    }

    // Projects (si está vacío)
    const count = await Project.countDocuments({});
    if (count === 0) {
        await Project.create([
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
    } else {
        console.log("[seed] projects already exist");
    }
}