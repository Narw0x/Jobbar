import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;