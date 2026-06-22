import AddBulkUsersPage from '@/views/dashboard/AddBulkUsers';
import React, { memo } from 'react';

export const metadata = {
    title: "Add bulk users",
    description: "Import multiple users at once."
}

const AddBulkUsersUi = () => {
  return (
    <AddBulkUsersPage />
  )
}

export default memo(AddBulkUsersUi);
