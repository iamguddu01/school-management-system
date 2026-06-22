
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

export const createSchoolAnnouncement = async(slug, payload)=>{
    try {
        const {data} = await api.post(`/announcement/${slug}/create-school-announcement`, payload);
        return data
    } catch (error) {
        throw error
    }
}

export const updateSchoolAnnouncement = async(slug, id, payload)=>{
    try {
        const {data} = await api.put(`/announcement/${slug}/update-school-announcement/${id}`, payload);
        return data
    } catch (error) {
        throw error
    }
}

export const deleteSchoolAnnouncement = async(slug, id)=>{
    try {
        const {data} = await api.delete(`/announcement/${slug}/delete-school-announcement/${id}`);
        return data
    } catch (error) {
        throw error
    }
}

export const fetchSchoolMembers = async(slug, role, className)=>{
    try {
        const url = className 
            ? `/school/${slug}/members?role=${role}&class=${encodeURIComponent(className)}`
            : `/school/${slug}/members?role=${role}`;
        const {data} = await api.get(url);
        return data
    } catch (error) {
        throw error
    }
}

export const addSchoolMember = async(slug, payload)=>{
    try {
        const {data} = await api.post(`/school/${slug}/members`, payload);
        return data
    } catch (error) {
        throw error
    }
}

export const addSchoolMembersBulk = async(slug, payload)=>{
    try {
        const {data} = await api.post(`/school/${slug}/members/bulk`, payload);
        return data
    } catch (error) {
        throw error
    }
}

export const fetchAttendance = async(slug, date)=>{
    try {
        const {data} = await api.get(`/school/${slug}/attendance?date=${encodeURIComponent(date)}`);
        return data
    } catch (error) {
        throw error
    }
}

export const saveAttendance = async(slug, payload)=>{
    try {
        const {data} = await api.post(`/school/${slug}/attendance`, payload);
        return data
    } catch (error) {
        throw error
    }
}

export const fetchAllSchools = async()=>{
    try {
        const {data} = await api.get('/school/all');
        return data
    } catch (error) {
        throw error
    }
}

export const fetchDashboardStats = async(slug)=>{
    try {
        const {data} = await api.get(`/school/${slug}/dashboard-stats`);
        return data
    } catch (error) {
        throw error
    }
}

export const fetchMyAttendance = async(slug)=>{
    try {
        const {data} = await api.get(`/school/${slug}/my-attendance`);
        return data
    } catch (error) {
        throw error
    }
}