import mongoose from "mongoose"
export const handleMongoDbConnection = async()=>{
    try {
        mongoose.connect("mongodb://localhost:27017/school_management_system")
        console.log("DB connected");
    } catch (error) {
        console.log("DB connection failed, error ==> ", error);
    }
}