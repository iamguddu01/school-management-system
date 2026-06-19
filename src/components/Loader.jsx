import React from 'react'
import { Skeleton  } from 'antd'
import { BellRing, ChevronRight, GraduationCap, Mail, MapPin, Megaphone, Phone, School, UsersRound } from 'lucide-react'

const Loader = () => {
  return (
    <div className='min-h-screen min-w-screen flex flex-col bg-slate-100'>
        <header className='bg-white border-b border-slate-200'>
            <div className='mx-auto py-4 px-6 max-w-5xl flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600' >
                        <GraduationCap className='w-5 h-5 text-white' />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Skeleton.Input active size="small" style={{ width: 100, height: 16 }} />
                        <Skeleton.Input active size="small" style={{ width: 75, height: 12 }} />
                    </div>
                </div>

                <div className='flex items-center bg-blue-600/10 transition-all font-medium text-blue-600 text-sm py-2 px-4 rounded-lg cursor-wait'>
                    Loading...
                </div>
            </div>
        </header>
        <div className='flex-1 max-w-5xl mx-auto w-full flex flex-col gap-5 py-6 px-4 '>
            {/* Hero Section */}
            <div className='w-full rounded-2xl flex flex-col overflow-hidden bg-blue-600 p-6 md:px-8'>
                <div className='flex gap-5 flex-col md:flex-row'>
                    <div className='flex justify-center font-bold items-center w-20 h-20 rounded-2xl bg-white/20 text-blue-600 shadow-lg text-xl shrink-0'>
                        <Skeleton.Avatar active size={64} shape="square" />
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <Skeleton.Input active size="large" style={{ width: 200, height: 24 }} />
                        <div className='flex items-center gap-2 text-xs text-blue-50 mt-2'>
                            <MapPin className='w-4 h-4 text-white'/>
                            <Skeleton.Input active size="small" style={{ width: 140, height: 14 }} />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-white/20 text-white'>
                            Please Wait
                        </div>
                        <div className='flex items-center justify-center text-blue-200 text-xs gap-1'>
                            <Phone className='w-3 h-3'/> <Skeleton.Input active size="small" style={{ width: 80, height: 12 }} />
                        </div>
                        <div className='flex items-center justify-center text-blue-200 text-xs gap-1'>
                            <Mail className='w-3 h-3'/> <Skeleton.Input active size="small" style={{ width: 120, height: 12 }} />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col md:flex-row flex-wrap justify-around mt-6 gap-2 md:gap-0'>
                    <div className='flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 flex-1 text-white md:max-w-[calc(30%)]'>
                        <UsersRound className='text-white'/>
                        <div className='flex flex-col gap-1'>
                            <Skeleton.Input active size="small" style={{ width: 40, height: 16 }} />
                            <span className='text-blue-300 text-xs'>Students</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 flex-1 text-white md:max-w-[calc(30%)]'>
                        <School className='text-white'/>
                        <div className='flex flex-col gap-1'>
                            <Skeleton.Input active size="small" style={{ width: 80, height: 16 }} />
                            <span className='text-blue-300 text-xs'>Classes</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 flex-1 text-white md:max-w-[calc(30%)]'>
                        <BellRing className='text-white'/>
                        <div className='flex flex-col gap-1'>
                            <Skeleton.Input active size="small" style={{ width: 40, height: 16 }} />
                            <span className='text-blue-300 text-xs'>Notices</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Announcement */}
            <div className='w-full bg-white flex flex-col border border-slate-200 rounded-2xl overflow-hidden'>
                <div className='flex items-center justify-between px-5 py-4 border-b border-slate-100'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center'>
                            <Megaphone className='w-4 h-4 text-blue-600'/>
                        </div>
                        <h2 className='text-sm font-semibold text-slate-700'>School Announcements</h2>
                    </div>
                    <span className='text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-full text-slate-400'>Loading...</span>
                </div>
                <div className='flex divide-x divide-slate-100 flex-col md:flex-row divide-y w-full'>
                    {/* left: list */}
                    <div className='md:w-64 shrink-0 p-3 space-y-1.5 overflow-y-auto max-h-100'>
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="w-full rounded-xl px-4 py-3 flex flex-col gap-1.5 border border-slate-100"
                            >
                                <div className='flex items-center justify-between'>
                                    <Skeleton.Button active size="small" style={{ width: 40, height: 14 }} />
                                    <Skeleton.Button active size="small" style={{ width: 50, height: 14 }} />
                                </div>
                                <Skeleton.Input active size="small" style={{ width: '100%', height: 14 }} />
                            </div>
                        ))}
                    </div>

                    {/* right: detail */}
                    <div className='flex-1 p-6 flex flex-col gap-3'>
                        <div className='flex items-center justify-between'>
                            <Skeleton.Button active size="small" style={{ width: 50, height: 18 }} />
                            <Skeleton.Button active size="small" style={{ width: 60, height: 18 }} />
                        </div>
                        <Skeleton.Input active size="large" style={{ width: '50%', height: 22 }} />
                        <Skeleton active paragraph={{ rows: 2 }} title={false} />
                        <div className='mt-auto pt-4 border-t border-slate-100'>
                            <Skeleton.Input active size="small" style={{ width: '40%', height: 14 }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer className='bg-white flex text-center justify-center text-xs text-slate-400 py-4 border-t border-slate-200'>
            © {new Date().getFullYear()} School Portal, All rights reserved.
        </footer> 
    </div>
  )
}

export default Loader
