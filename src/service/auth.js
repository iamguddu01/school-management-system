
import api from "./index.js";
export const register=async(payload)=>{
    try {
        const {data} = await api.post("/auth/register", payload);
        return data
    } catch (error) {
        throw error
    }
}

export const fetchSchoolInformation = async(slug)=>{
    try {
        const {data} = await api.get(`/school/${slug}/school-information`);
        return data
    } catch (error) {
        throw error
    }
}

export const updateSchoolInformation = async(slug, payload)=>{
    try {
        const {data} = await api.put(
            `/school/${slug}/update-school-information`,
            payload
        )
        return data
    } catch (error) {
        throw error
    }
}   

export const fetchSchoolAnnouncements = async(slug)=>{
    try {
        const {data} = await api.get(`/announcement/${slug}/fetch-school-announcement`);
        return data
    } catch (error) {
        throw error
    }
}

export const login = async(slug, payload)=>{
    try {
        const {data} = await api.post(`/auth/${slug}/sign-in`, payload);
        return data
    } catch (error) {
        throw error
    }
}