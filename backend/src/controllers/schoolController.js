import { sortAvailableClasses } from "../constant/index.js";
import { generateSlug } from "../helpers/index.js";
import db from "../models/index.js"
const {School, Membership} = db;
export const fetchSchoolInformationController = async(req, res)=>{
    try {
        const {slug} = req.params;
        const school = await School.findOne({slug}).populate("createdBy");
        if(!school){
            return res.status(404).json({
                success: false,
                message: "School not found."
            })
        }

        const studentsCount = await Membership.countDocuments({
            schoolId: school?._id,
            roles: "student"
        })
        const availableClasses = school?.details?.available_classes || []
        const sortedAvailableClasses = sortAvailableClasses(availableClasses);
        school.details.available_classes = sortedAvailableClasses;
        res.status(200).json({
            success:true,
            message:"School info fetched successfully",
            data:school,
            totalStudents: studentsCount
        })
    } catch (error) {
        console.log("Error in fetchSchoolInformationController => ", error)
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occur while fetching school info.",
            error: error,
        })
    }
}
export const updateSchoolInformationController = async(req, res)=>{
    try {
        const {slug} = req.params;
        if(!slug){
            return res.status(400).json({
                success:false,
                message: "Slug is required."
            })
        }
        const {payloadForUpdate} = req.body || {};
        if(!payloadForUpdate || Object.keys(payloadForUpdate).length === 0){
            return res.status(400).json({
                success:false,
                message: "Payload is required."
            })
        }
        if(payloadForUpdate.name){
            const updatedSlug = await generateSlug(payloadForUpdate.name);
            payloadForUpdate.slug = updatedSlug;
        }
        const school = await School.findOneAndUpdate({slug}, {...payloadForUpdate}, {new: true});
        if(!school){
            return res.status(404).json({
                success: false,
                message: "School not found."
            })
        }
        res.status(200).json({
            success:true,
            message:"School info updated successfully",
            data:school,
            slug: school.slug
        })
    } catch (error) {
        console.log("Error in updateSchoolInformationController => ", error)
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occur while updating school info.",
            error: error,
        })
    }
}