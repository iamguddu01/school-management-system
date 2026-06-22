/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";
import React, { memo, useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MoveLeft } from 'lucide-react'
import { FcGoogle } from "react-icons/fc";
import { message, Spin } from 'antd';
import { login } from '@/service/auth.js';
import { useParams, useRouter } from 'next/navigation';

const Login = () => {
    const params = useParams()
    const router = useRouter()
    const slug = params?.id;
    const [info, setInfo] = useState({
        email:"",
        password: "",
        loading: false 
    })
    const handleOnChange = useCallback(async(e, key)=>{
        setInfo((prev)=>({...prev, [key]:e.target.value}))
    }, [])
    const handleSubmit = useCallback(async()=>{
        try {
            if(!info?.email || !info?.password){
            return message.error("Please fill all the required values.")
            }
            const payload = {
                email: info?.email,
                password: info?.password
            }
            setInfo((prev)=>({...prev, loading:true}))
            const response = await login(slug, payload);
            const { data, membership } = response || {};
            const { token, user  } = data;
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("membership", JSON.stringify(membership))
            router.push(`/${slug}/dashboard/profile`)
            setInfo((prev)=>({...prev, loading:false}))
        } catch (error) {
            console.log("Error => handleSubmit", error)
            setInfo((prev)=>({...prev, loading:false}))
        }
    },[slug, info?.email, info?.password, router])
  return (
    <div className='w-screen min-h-screen bg-slate-100 flex justify-center items-center p-4 overflow-y-auto'>
        <div className='w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-md'>
            <div className='w-full h-40'>
                <Image 
                    src={"/banner.png"}
                    alt='banner'
                    width={1000}
                    height={400}
                    className='w-full h-full object-cover'
                />
            </div>
            <div className='p-6 '>
                <Link href={"/"} className='flex items-center text-sm text-slate-500 hover:text-slate-900 gap-2'><MoveLeft/> Back</Link>
                <h1 className='mt-4 font-semibold text-2xl text-slate-900'>Login</h1>
                <button className='w-full cursor-pointer border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 font-bold flex items-center gap-3 justify-center hover:bg-slate-50 mt-5'>
                    <span className='mt-0.75'><FcGoogle/></span>
                    Login with Google
                </button>

                <div className='my-5 text-center text-slate-500'>or</div>

                <div className='flex flex-col'>
                    <label className='text-sm mb-1 text-slate-700'>Email</label>
                    <input 
                        value={info?.email}
                        onChange={(e)=>handleOnChange(e, "email")}
                        type="email" 
                        placeholder='Enter your email' 
                        className='w-full rounded-lg outline-none border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 mb-5'
                    />
                </div>
                <div className='flex flex-col'>
                    <label className='text-sm mb-1 text-slate-700'>Password</label>
                    <input 
                        value={info?.password}
                        onChange={(e)=>handleOnChange(e, "password")}
                        type="password" 
                        placeholder='Enter your password' 
                        className='w-full rounded-lg outline-none border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 mb-5'
                    />
                </div>
                <button 
                    className='w-full rounded-lg bg-blue-600 px-4 py-2.5 cursor-pointer text-sm text-white font-medium hover:bg-blue-700'
                    onClick={handleSubmit}
                    >
                        {info?.loading ? <Spin/> : "Login"}
                </button>
            </div>
        </div>
    </div>
  )
}

export default memo(Login)
