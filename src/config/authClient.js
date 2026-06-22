import { createAuthClient } from "better-auth/react"
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
export const authClient = createAuthClient({
    baseURL: "http://localhost:5000",
    fetchOptions: {
        auth:{
            type: "Bearer",
            token:()=>{
                const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                return token
            }
        }
    }
})