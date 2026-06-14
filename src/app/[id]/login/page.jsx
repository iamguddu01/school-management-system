import Login from "@/views/auth/Login";
import { memo } from "react";

export const metadata = {
    title: "Login to your school"
}

const authLogin = () => {
  return (
    <Login/>
  )
}

export default memo(authLogin)
