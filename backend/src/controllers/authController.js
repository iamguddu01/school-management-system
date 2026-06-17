import db from "../models/index.js"
import { handleBetterAuth } from "../config/auth.js"
import { generateSlug } from "../helpers/index.js";

const {School, Membership} = db;
const auth = await handleBetterAuth();
export const registerController = async(req, res)=>{
    try {
        const {email, password, name} = req.body || {};
        const data = await auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
        },
    });

    const userId = data?.user?.id;
    const slug = await generateSlug(name) 
    const school = await School.create({
        name: name,
        slug: slug,
        createdBy: userId,
    })
    const membership = await Membership.create({
        userId,
        schoolId: school._id,
        roles: "admin",
    })

    res.status(200).json({
        success: true,
        message: "User registered successfully",
        data,
        slug,
        membership,
        school

    })
    } catch (error) {
        console.log("Error in register controller => ", error);
        res.status(error?.statusCode || 500).json({
            success:false,
            message: "An error occured during registration",
            error: error
        })
    }
}


export const loginController = async(req, res)=>{
    try {
        const {slug} = req.params;
        const {email, password} = req.body || {};
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                data
            })
        }
        const school = await School.findOne({slug});
        if(!school){
            return res.status(404).json({
                success: false,
                message: `No school found with ${slug}`,
            })
        }
        const data = await auth.api.signInEmail({
            body:{
                email,
                password
            }
        })
        const membership = await Membership.findOne({
            userId: data?.user?.id,
            schoolId: school._id,
        })
        if(!membership){
            return res.status(403).json({
                success: false,
                message: `User does not have access to school with slug - ${slug}`,
                data
            })
        }

        res.status(200).json({
            success: true,
            message: "Login successfully",
            data,
            membership
        })
    } catch (error) {
        console.log("Error in login controller => ", error);
        res.status(error?.statusCode || 500).json({
            success:false,
            message: "An error occured during login",
            error: error
        })
    }
}