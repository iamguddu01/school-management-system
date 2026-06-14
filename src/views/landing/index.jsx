"use client";
import React, { memo, useCallback } from 'react'
import Image from "next/image";
import { UserLock, UserPen, UserStar } from "lucide-react"
import Link from "next/link";   
import { useRouter } from 'next/navigation';
const Landing = () => {

    const router=useRouter();
    const onGetStarted = useCallback(()=>{
        router.push("/register")
    },[router])

  return (
    <div className="flex flex-col self-stretch min-h-screen h-screen min-w-screen bg-[#f3f2fe] overflow-x-hidden overflow-y-auto md:flex-row md:overflow-hidden">
      <div className="flex-1 flex self-stretch max-h-75 md:max-h-[unset]">
        <Image
          src="/landing.png"
          alt="landing"
          width={1000}
          height={1000}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div className="flex flex-1 self-stretch flex-col justify-between p-4 md:p-12 md:overflow-y-auto">
          <span className="text-[32px] text-[#111] font-bold">
            Transforming Education: School Management System
          </span>

          <span className="text-[24px] text-[#00002e]">
            Discover our innovative platform designed to streamline school
            operations, enhance learning, and foster seamless communication.
          </span>

          <div className="flex flex-col gap-5 self-stretch">
            <div className="flex flex-col gap-3 self-stretch">
              <UserPen size={40} color="#2e4df2" />
              <span className="text-[24px] text-[#111] font-bold">For Students</span>
              <span className="text-[#00002e] text-[16px]">Empowering academic journey</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 self-stretch">
            <div className="flex flex-col gap-3 self-stretch">
              <UserLock size={40} color="#2e4df2" />
              <span className="text-[24px] text-[#111] font-bold">For Teachers</span>
              <span className="text-[#00002e] text-[16px]">Simplify daily tasks</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 self-stretch">
            <div className="flex flex-col gap-3 self-stretch">
              <UserStar size={40} color="#2e4df2" />
              <span className="text-[24px] text-[#111] font-bold">For Administration</span>
              <span className="text-[#00002e] text-[16px]">Optimising school management</span>
            </div>
          </div>

          <Link href={"/register"} className="mt-5 bg-[#223edd] px-8 py-3 rounded-2xl text-center cursor-pointer text-[16px] font-bold text-white hover:-translate-y-0.75 transition-all duration-300 ease-in-out">
            Get Started
          </Link>

          <span className="text-center text-[16px] text-[#6b7280]">
            Register your school and start evolving education.
          </span>
      </div>
    </div>
  )
}

export default memo(Landing)
