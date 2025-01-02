import { Schema } from "mongoose";

const noticeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        noticePdf: {
            type: String,
            required: true,
        }
    },
    {timestamps: true}  
)

export const Notice = mongoose.model("Notice", noticeSchema);   