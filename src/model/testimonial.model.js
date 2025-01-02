import { Schema } from "mongoose";

const testimonialSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        }
        ,
        designation: {
            type: String,
            required: true,
            default: "Gaurdian",
        },
        review: {
            type: String,
            required: true,
            default: "R.K. Memorial HR Sec School shaped my dreams and gave me the confidence to pursue them. The values and knowledge I gained here continue to inspire my journey as a software engineer.",
        },
    },
    {timestamps: true}
)

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
