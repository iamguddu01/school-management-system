import { Bell } from 'lucide-react'
import React from 'react'

const EmptyAnnouncement = () => {
  return (
    <div className='flex flex-col items-center justify-center py-14 px-6 text-center'>
        <div className='w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4'>
            <Bell className='w-6 h-6 text-slate-400'/>
        </div>
        <p className='text-slate-700 font-semibold text-sm'>No announcements yet</p>
        <p className='text-slate-400 text-xs mt-1.5 max-w-xs'>There are no announcements at the moment. <br />Check back later for updates from the school</p>
    </div>
  )
}

export default EmptyAnnouncement
