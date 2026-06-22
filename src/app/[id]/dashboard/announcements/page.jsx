import AnnouncementPage from '@/views/dashboard/Announcement'
import React, { memo } from 'react'

export const metadata = {
    title: "Announcement page",
    description: "School announcement information"
}

const AnnouncementUi = () => {
  return (
    <AnnouncementPage />
  )
}

export default memo(AnnouncementUi)
