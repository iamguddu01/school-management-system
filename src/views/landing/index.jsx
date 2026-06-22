"use client";
import React, { memo, useCallback, useEffect, useState } from 'react';
import Image from "next/image";
import { UserLock, UserPen, UserStar, ArrowRight, Search, GraduationCap } from "lucide-react";
import Link from "next/link";   
import { useRouter } from 'next/navigation';
import { Select, Button, message } from 'antd';
import { fetchAllSchools } from '@/service/auth.js';

const Landing = () => {
    const router = useRouter();
    const [schools, setSchools] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState("");
    const [loading, setLoading] = useState(true);

    const loadSchools = useCallback(async () => {
        try {
            const res = await fetchAllSchools();
            setSchools(res?.schools || []);
        } catch (error) {
            console.error("Error loading schools", error);
            message.error("Failed to load school directory.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSchools();
    }, []);

    const handleGoToSchool = () => {
        if (!selectedSlug) {
            return message.warning("Please select a school first.");
        }
        router.push(`/${selectedSlug}`);
    };

    return (
        <div className="flex flex-col self-stretch min-h-screen min-w-screen bg-slate-50 overflow-x-hidden overflow-y-auto md:flex-row md:h-screen md:overflow-hidden">
            <div className="flex-1 flex self-stretch max-h-75 md:max-h-[unset] relative">
                <Image
                    src="/landing.png"
                    alt="landing"
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent flex items-end p-8 md:p-12">
                    <div className="text-white space-y-2">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-8 h-8 text-white" />
                            <span className="font-bold text-lg tracking-wider uppercase">School Management Portal</span>
                        </div>
                        <p className="text-sm text-blue-100 max-w-md">
                            All-in-one administration, faculty collaboration, and student engagement workspace.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 self-stretch justify-between p-6 md:p-12 md:overflow-y-auto space-y-8">
                <div className="space-y-4">
                    <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                        Transforming Education: School Management System
                    </h1>
                    <p className="text-slate-600 text-base leading-relaxed">
                        Discover our innovative platform designed to streamline school operations, enhance learning, and foster seamless communication.
                    </p>
                </div>

                {/* Search / Select School Portal Section */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Search className="w-4 h-4 text-blue-600" />
                            Find & Enter Your School Portal
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Search for your school in the list below to access student and faculty dashboards.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Select
                            showSearch
                            placeholder="Type school name e.g. Divine Public School"
                            optionFilterProp="label"
                            loading={loading}
                            onChange={(value) => setSelectedSlug(value)}
                            className="flex-1 min-h-[42px] select-large"
                            size="large"
                            options={schools.map(s => ({
                                value: s.slug,
                                label: s.name
                            }))}
                        />
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleGoToSchool}
                            className="bg-blue-600 hover:bg-blue-700 font-semibold px-6"
                            icon={<ArrowRight className="w-4 h-4" />}
                        >
                            Go to Portal
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex gap-3 items-start">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                                <UserPen className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-bold text-slate-800 text-sm block">For Students</span>
                                <span className="text-slate-500 text-xs mt-0.5 block">Access academic progress & attendance logs.</span>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                                <UserLock className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-bold text-slate-800 text-sm block">For Teachers</span>
                                <span className="text-slate-500 text-xs mt-0.5 block">Record grades, track attendance & communicate.</span>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                                <UserStar className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-bold text-slate-800 text-sm block">For Admins</span>
                                <span className="text-slate-500 text-xs mt-0.5 block">Manage registries, announcements & configurations.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="text-center sm:text-left">
                        <span className="text-xs text-slate-400 block">Don't have your school registered yet?</span>
                        <Link href="/register" className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-block">
                            Register School & Start Setup
                        </Link>
                    </div>
                    <Link href="/register" className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-2.5 rounded-xl text-center text-xs font-bold transition-all">
                        Register School
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default memo(Landing);
