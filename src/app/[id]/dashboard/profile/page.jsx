
import ProfilePage from "@/views/dashboard/Profile";
import { memo } from "react";

export const metadata = {
    title: "Profile page",
    description: "User profile information."
}

const ProfileUi = () => {
  return (
    <ProfilePage/>
  )
}

export default memo(ProfileUi)
