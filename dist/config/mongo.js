import mongoose from "mongoose";
import { ENV } from "./env.js";
export async function connectMongo() {
    mongoose.set("strictQuery", true);
    try {
        await mongoose.connect(ENV.MONGO_URI, {
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