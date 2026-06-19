"use client";
import { BellRing, ChevronRight, GraduationCap, Mail, MapPin, Megaphone, Phone, School, UsersRound } from 'lucide-react'
import React, { memo, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import EmptyAnnouncement from '@/components/EmptyAnnouncement'
import { useParams, useRouter } from 'next/navigation';
import { fetchSchoolAnnouncements, fetchSchoolInformation } from '@/service/auth.js';
import { message } from 'antd';
import Loader from '@/components/Loader';
import moment from "moment"
import Image from 'next/image';


const SchoolLanding = () => {

    const params = useParams();
    const router = useRouter();
    const slug = params?.id;
    const [info, setInfo] = useState({
        announcements: [],
        active: null,
        schoolInfo: null,
        loading: true
    });

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/immutability
        fetchSchoolInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleNavigateToLogin = useCallback(async()=>{
        router.push(`/${slug}/login`)
    },[slug, router])

    const fetchSchoolInfo = useCallback(async()=>{
        try {
            const [response1, response2] = await Promise.all([fetchSchoolInformation(slug), fetchSchoolAnnouncements(slug)])
            const { data, totalStudents } = response1 || {};
            const { schoolAnnouncements=[] } = response2 || {};
            setInfo((prev)=>({
                ...prev,
                schoolInfo: {...data, totalStudents},
                announcements: schoolAnnouncements,
                active: schoolAnnouncements.length ? schoolAnnouncements?.[0] : null,
            }))
        } catch (error) {
            console.log("Error while fetching school info", error)
            message.error("Failed to fetch school information. Please try again later.")
        } finally {
            setInfo((prev)=>({
                ...prev, 
                loading: false
            }))
        }
    }, [slug])

    if (info.loading) {
        return <Loader />;
    }

  return (
    <div className='min-h-screen min-w-screen flex flex-col bg-slate-100'>
        <header className='bg-white border-b border-slate-200'>
            <div className='mx-auto py-4 px-6 max-w-5xl flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600'>
                        {info?.schoolInfo?.details?.logo ? (
                            <Image
                                src={info?.schoolInfo?.details?.logo}
                                alt='logo'
                                width={100}
                                height={100}
                            />
                        ) : (
                            <GraduationCap/>
                        )}
                    </div>
                    <div>
                        <p className='font-semibold text-slate-800 text-sm'>{info?.schoolInfo?.name || "School Portal"}</p>
                        <p className='text-slate-400 text-xs'>CBSE affiliation</p>
                    </div>
                </div>

                <a 
                    className='flex items-center bg-blue-600 hover:bg-blue-700 transition-all font-medium text-white text-sm py-2 px-4 rounded-lg cursor-pointer'
                    onClick={handleNavigateToLogin}
                    >
                    Login <ChevronRight className='w-5 h-5'/>
                </a>
            </div>
        </header>
        <div className='flex-1 max-w-5xl mx-auto w-full flex flex-col gap-5 py-6 px-4 '>
            {/* Hero Section */}
            <div className='w-full rounded-2xl flex flex-col overflow-hidden bg-blue-600 p-6 md:px-8'>
                <div className='flex gap-5 flex-col md:flex-row'>
                    <div className='flex justify-center font-bold items-center w-20 h-20 rounded-2xl bg-white text-blue-600 shadow-lg text-xl shrink-0 overflow-hidden'>
                        {info?.schoolInfo?.details?.logo ? (
                            <Image
                                src={info?.schoolInfo?.details?.logo}
                                alt='logo'
                                width={100}
                                height={100}
                            />
                        ) : (
                            info?.schoolInfo?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || "SCH"
                        )}
                    </div>
                    <div className='flex-1 flex flex-col'>
                        <h1 className='text-2xl text-white font-bold'>{info?.schoolInfo?.name}</h1>
                        <div className='flex items-center gap-2 text-xs text-blue-50 mt-2'>
                            <MapPin className='w-4 h-4 text-white'/>
                            <span>{info?.schoolInfo?.details?.address || "Location not provided"}</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <a onClick={handleNavigateToLogin} className='flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors'>
                            Login <ChevronRight className='w-4 h-4'/>
                        </a>
                        {info?.schoolInfo?.details?.phone && (
                            <a href={`tel:${info.schoolInfo.details.phone}`} className='flex items-center justify-center text-blue-200 text-xs hover:text-white gap-1'>
                                <Phone className='w-3 h-3'/> {info.schoolInfo.details.phone}
                            </a>
                        )}
                        {info?.schoolInfo?.details?.email && (
                            <a href={`mailto:${info.schoolInfo.details.email}`} className='flex items-center justify-center text-blue-200 text-xs hover:text-white gap-1'>
                                <Mail className='w-3 h-3'/> {info.schoolInfo.details.email}
                            </a>
                        )}
                    </div>
                </div>
                <div className='flex flex-col md:flex-row flex-wrap justify-around mt-6 gap-2 md:gap-0'>
                    <div className='flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 flex-1 text-white md:max-w-[calc(30%)]'>
                        <UsersRound className='text-white'/>
                        <div className='flex flex-col'>
                            <p className='text-white text-sm'>{}</p>
                            <span className='text-blue-300 text-xs'>Students</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 flex-1 text-white md:max-w-[calc(30%)]'>
                        <School className='text-white'/>
                        <div className='flex flex-col'>
                            <p className='text-white text-sm'>
                                {info?.schoolInfo?.details?.available_classes?.length 
                                    ? `${info.schoolInfo.details.available_classes[0]} - ${info.schoolInfo.details.available_classes[info.schoolInfo.details.available_classes.length - 1]}`
                                    : "Not specified"}
                            </p>
                            <span className='text-blue-300 text-xs'>Classes</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 rounded-xl px-4 py-3 bg-white/10 flex-1 text-white md:max-w-[calc(30%)]'>
                        <BellRing className='text-white'/>
                        <div className='flex flex-col'>
                            <p className='text-white text-sm'>{info?.announcements?.length || 0}</p>
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
                    {info?.announcements?.length ? (
                        <span className='text-xs font-semibold bg-blue-600 px-2.5 py-1 rounded-full text-white'>
                            {info?.announcements?.length} Notices
                        </span>
                    ):(
                        <span className='text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-full text-slate-400'>
                            No Notices
                        </span>
                    )}
                </div>
                {/* empty state */}
                {info?.announcements?.length===0 ? (<EmptyAnnouncement/>) : (
                    <div className='flex divide-x divide-slate-100 flex-col md:flex-row divide-y'>
                        {/* left: list */}
                        <div className='md:w-65 shrink-0 p-3 space-y-1.5 overflow-y-auto max-h-100'>
                            {info?.announcements.map((a) => (
                                <button
                                    key={a._id}
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
                                            {moment(a.createdAt).format("MMM DD, YYYY")}
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
                                            {moment(info?.active?.createdAt).format("MMM DD, YYYY")}
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
                                            {info?.schoolInfo?.details?.email ? (
                                                <a 
                                                    href={`mailto:${info.schoolInfo.details.email}`}
                                                    className='text-blue-600 hover:underline'
                                                >
                                                    {info.schoolInfo.details.email}
                                                </a>
                                            ) : (
                                                "contact info unavailable"
                                            )}
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
            © {new Date().getFullYear()} {info?.schoolInfo?.name || "School Portal"}, All rights reserved.
        </footer> 
    </div>
  )
}

export default memo(SchoolLanding)
