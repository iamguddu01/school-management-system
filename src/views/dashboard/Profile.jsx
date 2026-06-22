/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";

import { authClient } from "@/config/authClient";
import { nameShortner } from "@/helpers/index.js";
import { Edit3, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const baseFields = [
    {label: "Name", key: "name", icon: UserRound, editable: true},
    {label: "Email", key: "email", icon: Mail, editable: false},
    {label: "Role", key: "role", icon: ShieldCheck, editable: false, fallbackKey: "designation"},
]

const ProfilePage = () =>{
    const params = useParams()
    const router = useRouter()
    const slug = params?.id;
    const [info, setInfo] = useState({
        name:"",
        email: "",
        role: "",
        isEditing: false,
    })

    useEffect(()=>{
        getStoredUser()
    },[])

    const getStoredUser = useCallback(()=>{
        if(typeof window === "undefined") return null;
        try {
            let stored = localStorage.getItem("user");
            let roles = localStorage.getItem("membership")
            stored = stored ? JSON.parse(stored) : null;
            roles = roles ? JSON.parse(roles) : null;
            const { roles: role="" } = roles || {};
            const { name = "", email = "" } = stored || {};
            setInfo((prev)=>({...prev, name, email, role:role.toUpperCase()}))
        } catch (error) {
            console.log("Failed to parse user from storage", error)
            return null
        }
    }, []);

    const handleChange = (key , value) => {
        setInfo((prev)=>({...prev, [key]: value}))
    };

    const handleSave = () => {
        setInfo((prev)=>({...prev, isEditing: false}))
    };

    const handleLogout=useCallback(async()=>{
            await authClient.signOut();
            localStorage.clear();
            router.push(`/${slug}/login`)
    }, [slug, router])

    const renderField = (field) => {
        const value = info?.[field.key] || info[field.fallbackKey] || "";
        const editable = info?.isEditing && field.editable !== false;

        return (
            <label
                key={field.key}
                className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-3"
            >
                <span className="text-xs uppercase tracking-[0.18em]">
                    {field.icon && <field.icon className="h-4 w-4 text-slate-400"/>}
                    {field.label}
                </span>
                {editable ? (
                    <input 
                        type="text"
                        value={value}
                        onChange={(e)=>handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                    />
                ):(
                    <p className="text-base font-semibold text-slate-900 break-all">
                        {value || field.placeholder || "Not provided"}
                    </p>
                )}
            </label>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
                        {nameShortner(info?.name || "")}
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            User Profile
                        </p>
                        <h1 className="text-2xl font-bold text-slate-900 leading-snug">
                            {info?.name || "Unnamed account"}
                        </h1>
                        <p className="text-sm text-slate-600">
                            {info?.role || "Role not set"}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={()=>
                            setInfo((prev)=>({...prev, isEditing: !prev.isEditing}))
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-300"
                    >
                        <Edit3 className="h-4 w-4"/>
                        {info?.isEditing ? "Cancel Edit" : "Edit Profile"}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-semibold hover:bg-red-600"
                    >
                        <LogOut className="w-4 h-4"/>
                        Log out
                    </button>
                </div>
            </header>
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Account Details
                        </p>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Core Information
                        </h2>
                    </div>
                    {info?.isEditing && (
                        <button
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white font-semibold text-xs py-2 px-2"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {baseFields.map((field) => renderField(field))}
                </div>
            </section>
        </div>
    )
}   
export default ProfilePage