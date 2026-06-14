import ForgotPassword from "@/views/auth/ForgotPassword";

import { memo } from "react";

export const metadata = {
    title: "Forgot your school"
}

const authForgot = () => {
  return (
    <ForgotPassword/>
  )
}

export default memo(authForgot)
