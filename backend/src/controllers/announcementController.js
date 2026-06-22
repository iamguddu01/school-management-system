

import db from "../models/index.js"
const {School, Membership, Announcement} = db;
export const fetchSchoolAnnouncement = async(req, res)=>{
    try {
        const {slug} = req.params;
        if(!slug){
            return res.status(400).json({
                success:false,
                message:"Slug is required"
            })
        }
        const school = await School.findOne({slug});
        if(!school){
            return res.status(404).json({
                success: false,
                message: "School not found."
            })
        }

        const schoolAnnouncements = await Announcement.find({
            schoolId: school._id,
            scope: "school",
            status:"active"
        }).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            message: "Annoouncements fetched successfully.",
            schoolAnnouncements
        })
    } catch (error) {
        console.log("Error in fetchSchoolAnnouncement => ", error)
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occur while fetching school announcement.",
            error: error,
        })
    }
}
export const createSchoolAnnouncement = async(req, res)=>{
    try {
        const user = req.user
        const school = req.school;
        const { tag, title, description } = req.body || {};
        if(!tag || !title || !description){
            return res.status(400).json({
                success:false,
                message:"Tag, title and description is required."
            })
        }
        const announcement = await Announcement.create({
            schoolId: school._id,
            tag,
            title,
            description,
            scope: "school",
            createdBy: user.id,
        });
        return res.status(201).json({
            success:true,
            message:"Announcement created successfully.",
            data: announcement
        })
    } catch (error) {
        console.log("Error in createAnnouncement => ", error)
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occur while creating announcement.",
            error: error,
        })
    }
}

export const updateSchoolAnnouncement = async(req, res)=>{
    try {
        const {id} = req.params;
        const { tag, title, description, status } = req.body || {};
        const announcement = await Announcement.findByIdAndUpdate(id, { tag, title, description, status }, { new: true });
        if(!announcement){
            return res.status(404).json({
                success: false,
                message: "Announcement not found."
            })
        }
        res.status(200).json({
            success: true,
            message: "Announcement updated successfully.",
            data: announcement
        })
    } catch (error) {
        console.log("Error in updateSchoolAnnouncement => ", error)
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occur while updating announcement.",
            error: error,
        })
    }
}

export const deleteSchoolAnnouncement = async(req, res)=>{
    try {
        const {id} = req.params;
        const announcement = await Announcement.findByIdAndDelete(id);
        if(!announcement){
            return res.status(404).json({
                success: false,
                message: "Announcement not found."
            })
        }
        res.status(200).json({
            success: true,
            message: "Announcement deleted successfully."
        })
    } catch (error) {
        console.log("Error in deleteSchoolAnnouncement => ", error)
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occur while deleting announcement.",
            error: error,
        })
    }
}