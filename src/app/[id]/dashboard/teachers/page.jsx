import TeachersPage from '@/views/dashboard/Teachers';
import React, { memo } from 'react';

export const metadata = {
    title: "Teachers management",
    description: "Manage teachers registry."
}

const TeachersUi = () => {
  return (
    <TeachersPage />
  )
}

export default memo(TeachersUi);
