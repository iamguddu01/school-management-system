/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Card, Button, Spin, Tag, message } from 'antd';
import { 
    GraduationCap, 
    Users, 
    Megaphone, 
    Calendar, 
    MapPin, 
    ChevronRight, 
    BookOpen, 
    CheckSquare, 
    User,
    Clock,
    FileText
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import moment from 'moment';
import { fetchDashboardStats } from '@/service/auth.js';

const Overview = () => {
    const params = useParams();
    const router = useRouter();
    const slug = params?.id;

    const [info, setInfo] = useState({
        stats: null,
        loading: true,
        userName: ""
    });

    const loadStats = useCallback(async () => {
        if (!slug) return;
        try {
            const res = await fetchDashboardStats(slug);
            let userName = "";
            if (typeof window !== "undefined") {
                const storedUser = localStorage.getItem("user");
                const parsed = storedUser ? JSON.parse(storedUser) : null;
                userName = parsed?.name || "Member";
            }
            setInfo(prev => ({
                ...prev,
                stats: res?.data || null,
                userName,
                loading: false
            }));
        } catch (error) {
            console.error("Error loading dashboard stats", error);
            message.error("Failed to load dashboard overview stats.");
            setInfo(prev => ({ ...prev, loading: false }));
        }
    }, [slug]);

    useEffect(() => {
        loadStats();
    }, [slug]);

    if (info.loading) {
        return (
            <div className="py-32 text-center">
                <Spin size="large" />
                <p className="text-slate-400 mt-2 text-sm">Loading dashboard summary...</p>
            </div>
        );
    }

    const { stats, userName } = info;
    const isStudent = stats?.role === "student";
    const isStaff = stats?.role === "admin" || stats?.role === "teacher";

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcoming Header Banner */}
            <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider">
                        <User className="w-3.5 h-3.5" />
                        {stats?.role || "Member"} Profile
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        Welcome back, {userName}!
                    </h1>
                    <p className="text-blue-100 text-sm max-w-md leading-relaxed">
                        Here is the daily summary and updates for <strong>{stats?.schoolName}</strong>.
                    </p>
                </div>
                {stats?.schoolLogo && (
                    <div className="h-16 w-16 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                        <img src={stats.schoolLogo} alt="school logo" className="h-12 w-12 object-contain" />
                    </div>
                )}
            </div>

            {/* Role-based metrics grid */}
            {isStaff && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="shadow-xs border-slate-200 rounded-2xl">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Registered Students</span>
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                                <span className="text-2xl font-bold text-slate-800">{stats?.totalStudents || 0}</span>
                            </div>
                            <Button type="link" onClick={() => router.push(`/${slug}/dashboard/students`)} className="text-xs text-blue-600 flex items-center p-0 font-medium">
                                Manage <ChevronRight className="w-3 h-3 ml-0.5" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="shadow-xs border-slate-200 rounded-2xl">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Faculty Members</span>
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                                <Users className="w-6 h-6 text-indigo-600" />
                                <span className="text-2xl font-bold text-slate-800">{stats?.totalTeachers || 0}</span>
                            </div>
                            <Button type="link" onClick={() => router.push(`/${slug}/dashboard/teachers`)} className="text-xs text-indigo-600 flex items-center p-0 font-medium">
                                Manage <ChevronRight className="w-3 h-3 ml-0.5" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="shadow-xs border-slate-200 rounded-2xl">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Notices</span>
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                                <Megaphone className="w-6 h-6 text-amber-600" />
                                <span className="text-2xl font-bold text-slate-800">{stats?.totalAnnouncements || 0}</span>
                            </div>
                            <Button type="link" onClick={() => router.push(`/${slug}/dashboard/announcements`)} className="text-xs text-amber-600 flex items-center p-0 font-medium">
                                Bulletins <ChevronRight className="w-3 h-3 ml-0.5" />
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {isStudent && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Card className="shadow-xs border-slate-200 rounded-2xl">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">My Assigned Class</span>
                        <div className="flex items-center gap-2 mt-3 text-blue-600">
                            <BookOpen className="w-6 h-6" />
                            <span className="text-xl font-bold text-slate-800">{stats?.class || "Not Assigned"}</span>
                        </div>
                    </Card>

                    <Card className="shadow-xs border-slate-200 rounded-2xl">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Attendance Rate</span>
                        <div className="flex items-center gap-2 mt-3 text-green-600">
                            <Clock className="w-6 h-6" />
                            <span className="text-xl font-bold text-slate-800">{stats?.attendanceRate || 0}%</span>
                        </div>
                    </Card>

                    <Card className="shadow-xs border-slate-200 rounded-2xl">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Days Attended</span>
                        <div className="flex items-center gap-2 mt-3 text-slate-700">
                            <CheckSquare className="w-6 h-6 text-green-500" />
                            <span className="text-xl font-bold text-slate-800">
                                {stats?.presentDays || 0} <span className="text-xs text-slate-400 font-normal">/ {stats?.totalDays || 0} days</span>
                            </span>
                        </div>
                    </Card>

                    <Card className="shadow-xs border-slate-200 rounded-2xl">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Days Absent</span>
                        <div className="flex items-center gap-2 mt-3 text-red-600">
                            <XCircle className="w-6 h-6 text-red-500" />
                            <span className="text-xl font-bold text-slate-800">{stats?.absentDays || 0} <span className="text-xs text-slate-400 font-normal">days</span></span>
                        </div>
                    </Card>
                </div>
            )}

            {/* Quick Actions Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-800">Quick Navigation</h2>
                <div className="flex flex-wrap gap-3">
                    {isStaff && (
                        <>
                            <Button 
                                type="default" 
                                onClick={() => router.push(`/${slug}/dashboard/students`)}
                                className="font-semibold rounded-lg flex items-center gap-1.5"
                                icon={<GraduationCap className="w-4 h-4" />}
                            >
                                Register Student
                            </Button>
                            <Button 
                                type="default" 
                                onClick={() => router.push(`/${slug}/dashboard/attendance`)}
                                className="font-semibold rounded-lg flex items-center gap-1.5"
                                icon={<CheckSquare className="w-4 h-4" />}
                            >
                                Mark Attendance
                            </Button>
                            <Button 
                                type="default" 
                                onClick={() => router.push(`/${slug}/dashboard/announcements`)}
                                className="font-semibold rounded-lg flex items-center gap-1.5"
                                icon={<Megaphone className="w-4 h-4" />}
                            >
                                Post Announcement
                            </Button>
                        </>
                    )}
                    {isStudent && (
                        <>
                            <Button 
                                type="primary"
                                onClick={() => router.push(`/${slug}/dashboard/my-attendance`)}
                                className="bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg flex items-center gap-1.5"
                                icon={<CheckSquare className="w-4 h-4" />}
                            >
                                View My Attendance Logs
                            </Button>
                            <Button 
                                type="default" 
                                onClick={() => router.push(`/${slug}/dashboard/profile`)}
                                className="font-semibold rounded-lg flex items-center gap-1.5"
                                icon={<User className="w-4 h-4" />}
                            >
                                View My Profile
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Bulletin Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Announcements */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-blue-600" />
                        Recent Bulletin Board
                    </h2>

                    <div className="space-y-3">
                        {!stats?.announcements || stats.announcements.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs">No notifications or announcements posted recently.</p>
                            </div>
                        ) : (
                            stats.announcements.map((a) => (
                                <div key={a._id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Tag color={a.tag === "Urgent" ? "red" : "blue"} className="font-bold text-[9px] uppercase px-2 py-0.5 rounded-full">
                                            {a.tag}
                                        </Tag>
                                        <span className="text-[10px] text-slate-400">
                                            {moment(a.createdAt).format("MMM DD, YYYY [at] h:mm A")}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">{a.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{a.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* School Profile Card */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        School Information
                    </h2>
                    
                    <div className="space-y-4 text-xs">
                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold block">School Name</span>
                            <span className="font-bold text-slate-800 text-sm block">{stats?.schoolName}</span>
                        </div>

                        {stats?.schoolAddress && (
                            <div className="space-y-1">
                                <span className="text-slate-400 font-semibold flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    Location Address
                                </span>
                                <span className="font-semibold text-slate-700 block leading-relaxed">{stats.schoolAddress}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold block">Affiliation</span>
                            <span className="font-bold text-slate-700 block">CBSE Affiliated Registry</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Overview);
