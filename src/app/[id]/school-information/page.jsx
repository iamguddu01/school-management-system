    import SchoolInformation from "@/views/auth/SchoolInformation";
import { memo } from "react";

export const metadata = {
    title: "Provide your school info"
}

const authSchoolInfo = () => {
  return (
    <SchoolInformation/>
  )
}

export default memo(authSchoolInfo)
