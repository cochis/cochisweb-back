import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        highlights: { type: [String], default: [] },
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export type ServiceDoc = mongoose.InferSchemaType<typeof ServiceSchema>;
export const Service = mongoose.model("Service", ServiceSchema);