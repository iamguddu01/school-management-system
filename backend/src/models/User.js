import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    emailVerified: {
        type: Boolean,
        required: false,
        default: false
    },
    profile: {
        type: Schema.Types.Mixed,
        default: {},
        required: false
    },
    changePasswordRequired: {
        type: Boolean,
        default: false,
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema, "user")
export default User;