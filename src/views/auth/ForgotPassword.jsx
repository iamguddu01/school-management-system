// "use client";
import React, { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MoveLeft } from 'lucide-react'
import { FcGoogle } from "react-icons/fc";

const ForgotPassword = () => {
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
                <h1 className='mt-4 mb-4 font-semibold text-2xl text-slate-900'>Forgot Password</h1>

                <div className='flex flex-col'>
                    <label className='text-sm mb-1 text-slate-700'>Old Password</label>
                    <input type="password" placeholder='Enter your old password' className='w-full rounded-lg outline-none border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 mb-5'/>
                </div>
                <div className='flex flex-col'>
                    <label className='text-sm mb-1 text-slate-700'>New Password</label>
                    <input type="password" placeholder='Enter your new password' className='w-full rounded-lg outline-none border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 mb-5'/>
                </div>
                <div className='flex flex-col'>
                    <label className='text-sm mb-1 text-slate-700'>Confirm Password</label>
                    <input type="password" placeholder='Confirm your new password' className='w-full rounded-lg outline-none border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 mb-5'/>
                </div>

                <button className='w-full rounded-lg bg-blue-600 px-4 py-2.5 cursor-pointer text-sm text-white font-medium hover:bg-blue-700'>Change Password</button>
            </div>
        </div>
    </div>
  )
}

export default memo(ForgotPassword)
