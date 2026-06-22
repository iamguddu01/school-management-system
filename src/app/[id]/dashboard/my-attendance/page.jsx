import StudentAttendancePage from '@/views/dashboard/StudentAttendance';
import React, { memo } from 'react';

export const metadata = {
    title: "My Attendance Logs",
    description: "Track your daily school attendance history."
}

const StudentAttendanceUi = () => {
  return (
    <StudentAttendancePage />
  )
}

export default memo(StudentAttendanceUi);
