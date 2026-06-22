import { configureStore } from "@reduxjs/toolkit";
import schoolReducer from "./schoolSlice.js"
import authReducer from "./authSlice.js"

const makeStore=()=>{
    return configureStore({
        reducer: {
            school: schoolReducer,
            auth: authReducer,
        }
    })
}

export default makeStore;