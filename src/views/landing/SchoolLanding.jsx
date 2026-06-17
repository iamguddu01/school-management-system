"use client";
import { BellRing, ChevronRight, GraduationCap, Mail, MapPin, Megaphone, Phone, School, UsersRound } from 'lucide-react'
import React, { memo, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import EmptyAnnouncement from '@/components/EmptyAnnouncement'
import { useParams } from 'next/navigation';
import { fetchSchoolInformation } from '@/service/auth.js';
import { message } from 'antd';

const ANNOUNCEMENTS = [
    {
        id: 1,
        tag: "Event",
        date: "Feb 10, 2026",
        title: "Annual sports day - Registration open",
        description: "Students from 3-12 can register for sports event. Last date of registration is 22 Feb. Please contact your class teacher."
    },
    {
        id: 2,
        tag: "Fee",
        date: "Feb 10, 2026",
        title: "Annual sports day - Registration open",
        description: "Students from 3-12 can register for sports event. Last date of registration is 22 Feb. Please contact your class teacher."
    },
    {
        id: 3,
        tag: "Event",
        date: "Feb 10, 2026",
        title: "Annual sports day - Registration open",
        description: "Students from 3-12 can register for sports event. Last date of registration is 22 Feb. Please contact your class teacher."
    },
    {
        id: 4,
        tag: "Event",
        date: "Feb 10, 2026",
        title: "Annual sports day - Registration open",
        description: "Students from 3-12 can register for sports event. Last date of registration is 22 Feb. Please contact your class teacher."
    },
    {
        id: 5,
        tag: "Event",
        date: "Feb 10, 2026",
        title: "Annual sports day - Registration open",
        description: "Students from 3-12 can register for sports event. Last date of registration is 22 Feb. Please contact your class teacher."
    },
    {
        id: 6,
        tag: "Event",
        date: "Feb 10, 2026",
        title: "Annual sports day - Registration open",
        description: "Students from 3-12 can register for sports event. Last date of registration is 22 Feb. Please contact your class teacher."
    },
    {
        id: 7,
        tag: "Event",
        date: "Feb 10, 2026",
        title: "Annual sports day - Registration open",
        description: "Students from 3-12 can register for sports event. Last date of registration is 22 Feb. Please contact your class teacher."
    },
    {
        id: 8,
        tag: "lolo",
        date: "Feb 10, 2026",
        title: "Annual sports day - Registration open",
        description: "Students from 3-12 can lolo for sports event. Last date of registration is 22 Feb. Please contact your class teacher."
    },
]

const SchoolLanding = () => {

    const params = useParams();
    const slug = params?.id;
    const [info, setInfo] = useState({
        announcements: [...(ANNOUNCEMENTS || [])],
        active: ANNOUNCEMENTS.length ? ANNOUNCEMENTS?.[0] : null,
        schoolInfo: null,
        loading: true,
    });

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/immutability
        fetchSchoolInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchSchoolInfo = useCallback(async()=>{
        try {
            const response = await fetchSchoolInformation(slug)
            const {data, totalStudents}=response || {}

            setInfo((prev)=>({...prev, schoolInfo: {...data, totalStudents}}))
        } catch (error) {
            console.log("Error while fetching school info", error)
            message.error("Failed to fetch school information. Please try again later.")
        }finally{
            setInfo((prev)=>({...prev, loading: false}))
        }
    }, [slug])

    

  return (
    <div className='min-h-screen min-w-screen flex flex-col bg-slate-100'>
        <header className='bg-white border-b border-slate-200'>
            <div className='mx-auto py-4 px-6 max-w-5xl flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600'>
                        <GraduationCap className='w-5 h-5 text-white' />
                    </div>
                    <div>
                        <p className='font-semibold text-slate-800 text-sm'>{info?.schoolInfo?.name || ""}</p>
                        <p className='text-slate-400 text-xs'>CBSE affiliation</p>
                    </div>
                </div>

                <a className='flex items-center bg-blue-600 hover:bg-blue-700 transition-all font-medium text-white text-sm py-2 px-4 rounded-lg cursor-pointer'>
                    Login <ChevronRight className='w-5 h-5'/>
                </a>
            </div>
        </header>
        <div className='flex-1 max-w-5xl mx-auto w-full flex flex-col gap-5 py-6 px-4 '>
            {/* Hero Section */}
            <div className='w-full rounded-2xl flex flex-col overflow-hidden bg-blue-600 p-6 md:px-8'>
                <div className='flex gap-5 flex-col md:flex-row'>
                    <div className='flex justify-center font-bold items-center w-20 h-20 rounded-2xl bg-white text-blue-600 shadow-lg text-xl shrink-0'>
                        PW
                    </div>
                    <div className='flex-1 flex flex-col'>
                        <h1 className='text-2xl text-white font-bold'>{info?.schoolInfo?.name}</h1>
                        <div className='flex items-center gap-2 text-xs text-blue-50 mt-2'>
                            <MapPin className='w-4 h-4 text-white'/>
                            <span>{info?.schoolInfo?.details?.address || ""}</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Link href="/login" className='flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors'>
                            Login <ChevronRight className='w-4 h-4'/>
                        </Link>
                        <Link href="" className='flex items-center justify-center text-blue-200 text-xs hover:text-white gap-1'>
                            <Phone className='w-3 h-3'/> {info?.schoolInfo?.details?.phone || ""}
                        </Link>
                        <Link href="" className='flex items-center justify-center text-blue-200 text-xs hover:text-white gap-1'>
                            <Mail className='w-3 h-3'/> {info?.schoolInfo?.details?.email || ""}
                        </Link>
                    </div>
                </div>
                <div className='flex flex-col md:flex-row flex-wrap justify-around mt-6 gap-2 md:gap-0'>
                    <div className='flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 flex-1 text-white md:max-w-[calc(30%)]'>
                        <UsersRound className='text-white'/>
                        <div className='flex flex-col'>
                            <p className='text-white text-sm'>{info?.schoolInfo?.totalStudents || 0}+</p>
                            <span className='text-blue-300 text-xs'>Students</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 flex-1 text-white md:max-w-[calc(30%)]'>
                        <School className='text-white'/>
                        <div className='flex flex-col'>
                            <p className='text-white text-sm'>{info?.schoolInfo?.details?.available_classes?.[0]} - {info?.schoolInfo?.details?.available_classes?.[info?.schoolInfo?.details?.available_classes?.length-1]}</p>
                            <span className='text-blue-300 text-xs'>Classes</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 flex-1 text-white md:max-w-[calc(30%)]'>
                        <BellRing className='text-white'/>
                        <div className='flex flex-col'>
                            <p className='text-white text-sm'>0</p>
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
                    <span className='text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-full text-slate-400'>No Notices</span>
                </div>
                {/* empty state */}
                {info?.announcements?.length===0 ? (<EmptyAnnouncement/>) : (
                    <div className='flex divide-x divide-slate-100 flex-col md:flex-row divide-y'>
                        {/* left: list */}
                        <div className='md:w-65 shrink-0 p-3 space-y-1.5 overflow-y-auto max-h-100'>
                            {info?.announcements.map((a) => (
                                <button
                                    key={a.id}
                                    onClick={()=>setInfo((prev)=>({...prev, active:a}))}
                                    className={`w-full text-left rounded-xl px-4 py-3 transition-all duration-150 flex flex-col gap-1.5 border ${
                                        info?.active?.id === a.id
                                            ? "bg-blue-50 border-blue-200"
                                            : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                                    }`}
                                >
                                    <div className='flex items-center justify-between'>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600`}>
                                            {a.tag}
                                        </span>
                                        <span className='text-slate-400 text-[10px]'>
                                            {a.date}
                                        </span>
                                    </div>
                                    <p className={`text-xs font-semibold leading-snug ${
                                            info?.active?.id === a.id
                                                ? "text-blue-600"
                                                : "text-slate-700"
                                        }`}>
                                            {a.title}
                                        </p>
                                </button>
                            ))}
                        </div>

                        {/* right: detail */}
                        <div className='flex-1 p-6 flex flex-col gap-3'>
                            {!info?.active ? (
                                <div className='flex flex-col items-center justify-center h-full py-10 text-center'>
                                    <Megaphone className='w-8 h-8 text-slate-300 mb-3'/>
                                    <p className='text-slate-400 text-sm'>
                                        Select an announcement to read it.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-600'>
                                            {info?.active?.tag}
                                        </span>
                                        <span className='text-slate-400 text-xs'>
                                            {info?.active?.date}
                                        </span>
                                    </div>
                                    <h3 className='text-lg font-bold text-slate-900 leadomg-snug'>
                                        {info?.active?.title}
                                    </h3>
                                    <p className='text-slate-500 text-sm leading-relaxed'>
                                        {info?.active?.description}
                                    </p>
                                    <div className='mt-auto pt-4 border-t border-slate-100'>
                                        <p className='text-slate-400 test-xs'>
                                            For queries, contact the school office or email {""}
                                            <a 
                                                href={`mailto:physicwallah@pw.live`}
                                                className='text-blue-600 hover:underline'
                                            >
                                                {info?.schoolInfo?.details?.email || ""}
                                            </a>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
        <footer className='bg-white flex text-center justify-center text-xs text-slate-400 py-4 border-t border-slate-200'>
            © {new Date().getFullYear()} PW school, All rights reserved.
        </footer> 
    </div>
  )
}

export default memo(SchoolLanding)
