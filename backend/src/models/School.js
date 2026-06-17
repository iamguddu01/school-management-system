import mongoose, { Schema } from "mongoose";

const schoolSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    slug:{
        type:String,
        required: true,
        trim: true,
        index: true,
        unique: true
    },
    details: {
        type: Schema.Types.Mixed,
        required: false,
        default: {}
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }

}, {timestamps: true})

const School = mongoose.model("School", schoolSchema)
export default School;