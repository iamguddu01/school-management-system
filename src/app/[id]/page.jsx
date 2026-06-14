import SchoolLanding from "@/views/landing/SchoolLanding";
import { memo } from "react";

export const metadata = {
    title: "pw school",
    description: ""
}

const Landing = () => {
  return (
    <SchoolLanding/>
  )
}

export default memo(Landing)
