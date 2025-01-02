import { Schema } from "mongoose";

const schoolEventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: [{
            type: String,
            required: true,
        }],
    },
    {timestamps: true}
)

export const SchoolEvent = mongoose.model("SchoolEvent", schoolEventSchema);