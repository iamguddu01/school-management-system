import { sortAvailableClasses } from "../constant/index.js";
import { generateSlug } from "../helpers/index.js";
import db from "../models/index.js"
import { handleBetterAuth } from "../config/auth.js";
const {School, Membership, User, Attendance, Announcement} = db;
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

export const fetchSchoolMembersController = async(req, res)=>{
    try {
        const {slug} = req.params;
        const {role, class: className} = req.query;
        if(!slug){
            return res.status(400).json({
                success:false,
                message: "Slug is required."
            })
        }
        if(!role || !["student", "teacher", "admin"].includes(role)){
            return res.status(400).json({
                success:false,
                message: "Valid role is required."
            })
        }
        const school = await School.findOne({slug});
        if(!school){
            return res.status(404).json({
                success: false,
                message: "School not found."
            })
        }
        
        const query = {
            schoolId: school._id,
            roles: role
        };
        if (role === "student" && className) {
            query["metadata.class"] = className;
        }
        
        const memberships = await Membership.find(query);
        
        const userIds = memberships.map(m => m.userId);
        const users = await User.find({ _id: { $in: userIds } });
        
        const membersData = memberships.map(m => {
            const user = users.find(u => u._id.toString() === m.userId.toString());
            return {
                id: m._id,
                userId: m.userId,
                name: user?.name || "Unknown",
                email: user?.email || "Unknown",
                roles: m.roles,
                status: m.status,
                class: m.metadata?.class || "",
                createdAt: m.createdAt
            }
        });
        
        res.status(200).json({
            success: true,
            message: `${role}s fetched successfully`,
            data: membersData
        });
    } catch (error) {
        console.log("Error in fetchSchoolMembersController => ", error)
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occurred while fetching members.",
            error: error?.message || error
        })
    }
}

export const addSchoolMemberController = async(req, res)=>{
    try {
        const {slug} = req.params;
        const {name, email, password, role, class: className} = req.body || {};
        if(!name || !email || !password || !role){
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required."
            })
        }
        if(!["student", "teacher"].includes(role)){
            return res.status(400).json({
                success: false,
                message: "Role must be 'student' or 'teacher'."
            })
        }
        
        const school = await School.findOne({slug});
        if(!school){
            return res.status(404).json({
                success: false,
                message: "School not found."
            })
        }
        
        let user = await User.findOne({ email });
        let userId;
        
        if(!user){
            const auth = await handleBetterAuth();
            const data = await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name,
                }
            });
            userId = data.user.id;
            await User.findByIdAndUpdate(userId, { changePasswordRequired: true });
        } else {
            userId = user._id;
        }
        
        const existingMembership = await Membership.findOne({
            userId,
            schoolId: school._id
        });
        if(existingMembership){
            return res.status(400).json({
                success: false,
                message: "User is already a member of this school."
            })
        }
        
        const membership = await Membership.create({
            userId,
            schoolId: school._id,
            roles: role,
            status: "active",
            metadata: className ? { class: className } : {}
        });
        
        res.status(201).json({
            success: true,
            message: `${role} added successfully.`,
            data: {
                id: membership._id,
                userId,
                name,
                email,
                roles: role,
                status: membership.status,
                class: membership.metadata?.class || "",
                createdAt: membership.createdAt
            }
        });
    } catch (error) {
        console.log("Error in addSchoolMemberController => ", error)
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occurred while adding member.",
            error: error?.message || error
        })
    }
}

export const addSchoolMembersBulkController = async(req, res)=>{
    try {
        const {slug} = req.params;
        const {members, role} = req.body || {};
        if(!members || !Array.isArray(members) || members.length === 0 || !role){
            return res.status(400).json({
                success: false,
                message: "Members array and role are required."
            })
        }
        if(!["student", "teacher"].includes(role)){
            return res.status(400).json({
                success: false,
                message: "Role must be 'student' or 'teacher'."
            })
        }
        
        const school = await School.findOne({slug});
        if(!school){
            return res.status(404).json({
                success: false,
                message: "School not found."
            })
        }
        
        const auth = await handleBetterAuth();
        const results = [];
        const errors = [];
        
        for (const member of members) {
            const {name, email, password = "Welcome@123", class: className} = member;
            if(!name || !email){
                errors.push({ email: email || "unknown", message: "Name and email are required" });
                continue;
            }
            try {
                let user = await User.findOne({ email });
                let userId;
                
                if(!user){
                    const data = await auth.api.signUpEmail({
                        body: {
                            email,
                            password,
                            name,
                        }
                    });
                    userId = data.user.id;
                    await User.findByIdAndUpdate(userId, { changePasswordRequired: true });
                } else {
                    userId = user._id;
                }
                
                const existingMembership = await Membership.findOne({
                    userId,
                    schoolId: school._id
                });
                if(existingMembership){
                    errors.push({ email, message: "User is already a member of this school" });
                    continue;
                }
                
                const membership = await Membership.create({
                    userId,
                    schoolId: school._id,
                    roles: role,
                    status: "active",
                    metadata: className ? { class: className } : {}
                });
                
                results.push({
                    id: membership._id,
                    userId,
                    name,
                    email,
                    roles: role,
                    status: membership.status,
                    class: membership.metadata?.class || ""
                });
            } catch (err) {
                errors.push({ email, message: err?.message || "Failed to create user" });
            }
        }
        
        res.status(200).json({
            success: true,
            message: `Bulk processing completed. Added ${results.length} members.`,
            addedCount: results.length,
            results,
            errors
        });
    } catch (error) {
        console.log("Error in addSchoolMembersBulkController => ", error)
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occurred during bulk import.",
            error: error?.message || error
        })
    }
}

export const fetchAttendanceController = async(req, res)=>{
    try {
        const {slug} = req.params;
        const {date} = req.query;
        if(!slug || !date){
            return res.status(400).json({
                success: false,
                message: "Slug and date are required."
            })
        }
        
        const school = await School.findOne({slug});
        if(!school){
            return res.status(404).json({
                success: false,
                message: "School not found."
            })
        }
        
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
        
        const attendanceRecords = await Attendance.find({
            schoolId: school._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        
        res.status(200).json({
            success: true,
            message: "Attendance records fetched successfully.",
            data: attendanceRecords
        });
    } catch (error) {
        console.log("Error in fetchAttendanceController => ", error);
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occurred while fetching attendance.",
            error: error?.message || error
        });
    }
}

export const saveAttendanceController = async(req, res)=>{
    try {
        const {slug} = req.params;
        const {date, records} = req.body || {};
        const user = req.user;
        
        if(!slug || !date || !records || !Array.isArray(records)){
            return res.status(400).json({
                success: false,
                message: "Slug, date, and records array are required."
            })
        }
        
        const school = await School.findOne({slug});
        if(!school){
            return res.status(404).json({
                success: false,
                message: "School not found."
            })
        }
        
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
        
        const operations = records.map(record => {
            const {studentId, status} = record;
            return {
                updateOne: {
                    filter: {
                        schoolId: school._id,
                        studentId,
                        date: { $gte: startOfDay, $lte: endOfDay }
                    },
                    update: {
                        $set: {
                            status,
                            recordedBy: user.id,
                            date: startOfDay
                        }
                    },
                    upsert: true
                }
            };
        });
        
        await Attendance.bulkWrite(operations);
        
        res.status(200).json({
            success: true,
            message: "Attendance records saved successfully."
        });
    } catch (error) {
        console.log("Error in saveAttendanceController => ", error);
        res.status(error?.statusCode || 500).json({
            success: false,
            message: "An error occurred while saving attendance.",
            error: error?.message || error
        });
    }
}

export const fetchAllSchoolsController = async(req, res)=>{
    try {
        const schools = await School.find({ status: "active" }, "name slug details.logo");
        res.status(200).json({
            success: true,
            message: "Schools fetched successfully.",
            schools
        });
    } catch (error) {
        console.log("Error in fetchAllSchoolsController => ", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching schools.",
            error: error?.message || error
        });
    }
}

export const fetchDashboardStatsController = async(req, res)=>{
    try {
        const {slug} = req.params;
        const school = req.school;
        const membership = req.membership;
        const user = req.user;
        
        const announcements = await Announcement.find({
            schoolId: school._id,
            scope: "school",
            status: "active"
        }).sort({ createdAt: -1 }).limit(5);
        
        let stats = {
            role: membership.roles,
            schoolName: school.name,
            schoolLogo: school.details?.logo || "",
            schoolAddress: school.details?.address || ""
        };
        
        if (membership.roles === "admin" || membership.roles === "teacher") {
            const studentsCount = await Membership.countDocuments({
                schoolId: school._id,
                roles: "student"
            });
            const teachersCount = await Membership.countDocuments({
                schoolId: school._id,
                roles: "teacher"
            });
            stats = {
                ...stats,
                totalStudents: studentsCount,
                totalTeachers: teachersCount,
                totalAnnouncements: await Announcement.countDocuments({ schoolId: school._id })
            };
        } else if (membership.roles === "student") {
            const studentClass = membership.metadata?.class || "";
            const totalRecords = await Attendance.countDocuments({
                schoolId: school._id,
                studentId: user.id
            });
            const presentRecords = await Attendance.countDocuments({
                schoolId: school._id,
                studentId: user.id,
                status: "present"
            });
            const lateRecords = await Attendance.countDocuments({
                schoolId: school._id,
                studentId: user.id,
                status: "late"
            });
            
            const attendanceRate = totalRecords > 0 
                ? Math.round(((presentRecords + lateRecords) / totalRecords) * 100)
                : 100;
                
            stats = {
                ...stats,
                class: studentClass,
                attendanceRate,
                totalDays: totalRecords,
                presentDays: presentRecords,
                absentDays: totalRecords - (presentRecords + lateRecords),
                lateDays: lateRecords
            };
            
            if (studentClass) {
                const classAnnouncements = await Announcement.find({
                    schoolId: school._id,
                    scope: "class",
                    classes: studentClass,
                    status: "active"
                }).sort({ createdAt: -1 }).limit(5);
                
                stats.announcements = [...announcements, ...classAnnouncements]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);
            }
        }
        
        if (!stats.announcements) {
            stats.announcements = announcements;
        }
        
        res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully.",
            data: stats
        });
    } catch (error) {
        console.log("Error in fetchDashboardStatsController => ", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching dashboard stats.",
            error: error?.message || error
        });
    }
}

export const fetchMyAttendanceController = async(req, res)=>{
    try {
        const school = req.school;
        const user = req.user;
        
        const attendanceRecords = await Attendance.find({
            schoolId: school._id,
            studentId: user.id
        }).sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            message: "My attendance records fetched successfully.",
            data: attendanceRecords
        });
    } catch (error) {
        console.log("Error in fetchMyAttendanceController => ", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching your attendance.",
            error: error?.message || error
        });
    }
}