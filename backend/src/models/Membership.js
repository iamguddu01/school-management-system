import mongoose, { Schema } from "mongoose";

const membershipSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    schoolId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "School"
    },
    roles: {
        type: String,
        enum: ["admin", "teacher", "student"],
        required: true
    },
    metadata: {
        type: Schema.Types.Mixed,
        required: false,
        default: {}
    },
    status: {
        type: String,
        enum: ["active", "inactive", "invited"],
        default: "active"
    }

}, {timestamps: true})

const Membership = mongoose.model("Membership", membershipSchema)
export default Membership;