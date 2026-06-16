import api from "./index.js";
export const register=async(payload)=>{
    try {
        const data = await api.post("/auth/register", payload);
        return data
    } catch (error) {
        throw error
    }
}