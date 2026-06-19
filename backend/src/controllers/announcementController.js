

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