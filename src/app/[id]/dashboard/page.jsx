import OverviewPage from '@/views/dashboard/Overview'
import React, { memo } from 'react'

export const metadata = {
    title: "Dashboard Overview",
    description: "Welcome to your school dashboard."
}

const OverviewUi = () => {
  return (
    <OverviewPage />
  )
}

export default memo(OverviewUi);
