import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 }
}, { timestamps: true });
export const Service = mongoose.model("Service", ServiceSchema);
//# sourceMappingURL=Service.model.js.map