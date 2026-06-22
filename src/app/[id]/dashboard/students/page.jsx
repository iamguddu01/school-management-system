import StudentsPage from '@/views/dashboard/Students';
import React, { memo } from 'react';

export const metadata = {
    title: "Students management",
    description: "Manage students registry."
}

const StudentsUi = () => {
  return (
    <StudentsPage />
  )
}

export default memo(StudentsUi);
