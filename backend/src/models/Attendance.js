import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
    schoolId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "School"
    },
    studentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["present", "absent", "late"],
        required: true
    },
    recordedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, { timestamps: true });

// Create a compound index to ensure one attendance record per student per day per school
attendanceSchema.index({ studentId: 1, date: 1, schoolId: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
