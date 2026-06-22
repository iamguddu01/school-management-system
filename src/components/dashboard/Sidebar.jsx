/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { authClient } from '@/config/authClient';
import { GraduationCap, LogOut, Megaphone, UploadCloud, UserRound, Users, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Sidebar = () => {
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();
    const slug = params?.id;
    const [role, setRole] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                let membership = localStorage.getItem("membership");
                membership = membership ? JSON.parse(membership) : null;
                setRole(membership?.roles || "");
            } catch (e) {
                console.error("Failed to parse membership role in sidebar", e);
            }
        }
    }, []);

    const navItems = useMemo(
        ()=>[
            {
                title: "Profile",
                href: `/${slug}/dashboard/profile`,
                icon: UserRound,
            },
            {
                title: "Announcements",
                href: `/${slug}/dashboard/announcements`,
                icon: Megaphone
            },
            {
                title: "Students",
                href: `/${slug}/dashboard/students`,
                icon: GraduationCap
            },
            {
                title: "Teachers",
                href: `/${slug}/dashboard/teachers`,
                icon: Users
            },
            {
                title: "Attendance",
                href: `/${slug}/dashboard/attendance`,
                icon: CheckSquare
            },
            {
                title: "My Attendance",
                href: `/${slug}/dashboard/my-attendance`,
                icon: CheckSquare
            },
            {
                title: "Add Bulk Users",
                href: `/${slug}/dashboard/add-bulk-users`,
                icon: UploadCloud
            },
        ],
        [slug]
    );

    const filteredNavItems = useMemo(() => {
        return navItems.filter(item => {
            if (role === "student") {
                return ["Profile", "Announcements", "My Attendance"].includes(item.title);
            }
            if (role === "teacher") {
                return ["Profile", "Announcements", "Students", "Attendance"].includes(item.title);
            }
            // Admin sees all except My Attendance (unless they want to, but it's meant for students)
            return item.title !== "My Attendance";
        });
    }, [navItems, role]);

    const handleLogout = useCallback(async () => {
        await authClient.signOut();
        localStorage.clear();
        router.push(`/${slug}/login`);
    }, [slug, router]);

    const displayRoleName = useMemo(() => {
        if (role === "admin") return "School Admin";
        if (role === "teacher") return "Teacher Panel";
        if (role === "student") return "Student Portal";
        return "Member Portal";
    }, [role]);

    return (
        <aside className="w-64 min-h-screen border-r border-slate-200 bg-white px-4 py-6 shadow-sm shrink-0">
            <div className="flex flex-col h-full justify-between">
                <div>
                    <div className="px-2 mb-8">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            Dashboard
                        </p>
                        <h1 className="text-xl font-extrabold text-slate-900 mt-1 capitalize leading-snug">
                            {displayRoleName}
                        </h1>
                    </div>
                    <nav className="space-y-1">
                        {filteredNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                pathname === item.href || pathname?.startsWith(`${item?.href}/`);
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors
                                        ${
                                            isActive 
                                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                                : "text-slate-600 hover:bg-slate-100 border-transparent"
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <button 
                    onClick={handleLogout}
                    className="mt-8 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-red-500 hover:border-red-100 hover:text-white transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
