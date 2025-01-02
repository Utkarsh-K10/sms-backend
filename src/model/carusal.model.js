import mongoose, { Schema } from "mongoose";

const carusalSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        image: [
            {
                type: String,
                required: true,
            },
        ]
    },
    {timestamps: true});

export const Carusal = mongoose.model("Carusal", carusalSchema);


