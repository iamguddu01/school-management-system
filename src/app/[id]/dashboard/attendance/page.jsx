import AttendancePage from '@/views/dashboard/Attendance';
import React, { memo } from 'react';

export const metadata = {
    title: "Attendance tracking",
    description: "Mark daily student attendance."
}

const AttendanceUi = () => {
  return (
    <AttendancePage />
  )
}

export default memo(AttendanceUi);
