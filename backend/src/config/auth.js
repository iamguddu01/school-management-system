import { betterAuth } from "better-auth";
import { bearer, jwt } from "better-auth/plugins"
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { handleMongoDbConnection } from "./index.js";

let auth = null
export const handleBetterAuth = async()=>{
    if(auth) return auth;
    const {db} = await handleMongoDbConnection();
    auth = betterAuth({
        database: mongodbAdapter(db),
        emailAndPassword: {
            enabled: true,
        },
        baseURL: "http://localhost:5000",
        user: {
            additionalFields: {

                profile:{
                    type: "object",
                    required: false,
                    defaultValue: {},
                },
                changePasswordRequired:{
                    type: "boolean",
                    defaultValue: false,
                },
            },
        },
        plugins: [jwt(), bearer()],
    })

    return auth;
}
