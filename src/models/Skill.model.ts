import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        level: { type: Number, min: 1, max: 5, default: 3 },
        category: { type: String, default: "General" }
    },
    { timestamps: true }
);

export type SkillDoc = mongoose.InferSchemaType<typeof SkillSchema>;
export const Skill = mongoose.model("Skill", SkillSchema);