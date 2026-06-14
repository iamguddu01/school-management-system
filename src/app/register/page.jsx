import Register from "@/views/auth/Register";
import { memo } from "react";

export const metadata = {
    title: "Register your school"
}

function authRegister() {
  return (
    <Register/>
  )
}

export default memo(authRegister)
