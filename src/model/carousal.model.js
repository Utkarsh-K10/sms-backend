import mongoose, { Schema } from "mongoose";

const carousalSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        carousalImage:[{
                type: String,
                required: true,
            }]
    },
    {timestamps: true});

export const Carousal = mongoose.model("Carousal", carousalSchema);


