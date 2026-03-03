import bcrypt from "bcryptjs";
import { connectMongo } from "../src/config/mongo.js";
import { ENV } from "../src/config/env.js";
import { User } from "../src/models/user.model.js";

async function run() {
    await connectMongo();

    const exists = await User.findOne({ email: ENV.ADMIN_EMAIL });
    if (!exists) {
        const hash = await bcrypt.hash(ENV.ADMIN_PASSWORD, 10);
        await User.create({ email: ENV.ADMIN_EMAIL, passwordHash: hash });
        console.log("[seed] admin created ✅", ENV.ADMIN_EMAIL);
    } else {
        console.log("[seed] admin exists ✅", ENV.ADMIN_EMAIL);
    }

    process.exit(0);
}

run().catch((e) => {
    console.error("[seed] fatal:", e);
    process.exit(1);
});