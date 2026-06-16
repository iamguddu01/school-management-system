/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useCallback, useState } from 'react'
import {message, Spin} from "antd"
import Link from 'next/link'
import { MoveLeft, Upload, X } from 'lucide-react'
import api from '@/service';
import {cloudinaryConfig} from "@/config" 

const availableClasses = ["Nursery", "LKG", "UKG", "CLASS 1", "CLASS 2", "CLASS 3", "CLASS 4", "CLASS 5", "CLASS 6", "CLASS 7", "CLASS 8", "CLASS 9", "CLASS 10", "CLASS 11", "CLASS 12 ",]

const SchoolInformation = () => {

    const [info, setInfo] = useState({
        schoolName: "",
        location: "",
        classes: [],
        logo: null,
        logoPreview: null,
        logoUrl:null,
        uploadingLogo: false
    })

    const handleSelectClasses = useCallback(
        (e, className) => {
            e?.preventDefault();
            setInfo((prev) => {
                const existingClasses = [...(prev?.classes || [])];
                const index = existingClasses.indexOf(className);
                if (index === -1) {
                    existingClasses.push(className);
                } else {
                    existingClasses.splice(index, 1);
                }
                return { ...prev, classes: existingClasses };
            });
        },
        []
    )

    const handleImgUpload = useCallback(async(event)=>{
        const file = event?.target?.files?.[0];
        if(file){
            const fileSize = file?.size;
            if(fileSize > 5*1024*1024){
                return message.error("File size is exceeding 5 MB")
            }
            setInfo((prev)=>({...prev,  logo: file}))

            const reader = new FileReader();
            reader.onloadend=()=>{
                setInfo((prev)=>({...prev, logoPreview: reader.result}))
            };
            reader.readAsDataURL(file)

            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", cloudinaryConfig?.uploadPreset)
            try {
                setInfo((prev)=>({
                    ...prev,
                    uploadingLogo: true
                }))
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig?.cloudName}/image/upload`, {
                    method: "POST",
                    body: form
                });
                const data = await response.json();
                if(data?.secure_url){
                    setInfo((prev)=>({...prev, logoUrl: data?.secure_url, uploadingLogo: false}));
                    message.success("Logo uploaded successfully")
                }
            } catch (error) {
                
            }
        }
    },
    [])

    const removeImageHandler = useCallback((e)=>{
        e?.preventDefault()
        setInfo((prev)=>({...prev, logoPreview: null, logo: null}))
    },[])


  return (
    <div className='w-screen min-h-screen bg-slate-100 flex justify-center items-center p-4 overflow-y-auto'>
        <div className='w-full max-w-2xl rounded-2xl overflow-hidden bg-white shadow-md'>
            <div className='p-6 '>
                <Link href={"/"} className='flex items-center text-sm text-slate-500 hover:text-slate-900 gap-2'><MoveLeft/> Back</Link>
                <h1 className='mt-4 font-semibold text-2xl text-slate-900'>Complete your school setup</h1>

                <p className='text-sm text-slate-500 mt-1'>
                    Please provide your school information to get started
                </p>

                <form className='mt-6'>
                    <div className='flex flex-col mb-5'>
                        <label className='text-sm mt-1 text-slate-700 font-medium'>
                            School Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                            value={info.schoolName} 
                            onChange={(e)=>setInfo((prev)=>({...prev, schoolName: e.target.value}))}
                            type="text" 
                            placeholder='Enter your school name' 
                            className='w-full rounded-lg outline-none border border-slate-300 px-3 py-2 text-sm focus:border-slate-500'
                        />
                    </div>

                    <div className='flex flex-col mb-5'>
                        <label className='text-sm mt-1 text-slate-700 font-medium'>
                            Location / Address <span className='text-red-500'>*</span>
                        </label>
                        <textarea 
                            value={info.location} 
                            onChange={(e)=>setInfo((prev)=>({...prev, location: e.target.value}))}
                            rows={3}
                            type="text" 
                            placeholder='Enter your school address' 
                            className='resize-none w-full rounded-lg outline-none border border-slate-300 px-3 py-2 text-sm focus:border-slate-500'
                        />
                    </div>

                    <div className='flex flex-col mb-5'>
                        <label className='text-sm mt-1 text-slate-700 font-medium'>
                            Available Classes <span className='text-red-500'>*</span>
                        </label>
                        <p className='text-xs text-slate-500 mb-3'>
                            Please select all the classes available in the school
                        </p>

                        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2'>
                            {availableClasses?.map((className, index)=>(
                                <button 
                                    className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-medium border transition-all
                                    ${info?.classes?.includes(className) ? "bg-blue-500 text-white border-blue-600" : "bg-white text-slate-700 border-slate-500"}
                                    `}
                                    key={`${index}-${className}`} 
                                    onClick={(e)=>handleSelectClasses(e,className)}>
                                    {className}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='flex flex-col mb-5'>
                        <label className='text-sm mt-1 text-slate-700 font-medium'>
                            School Logo
                        </label>
                        <p className='text-xs text-slate-500 mb-3'>
                            Upload your school logo (PNG, JPG or JPEF format and max of 5 MB)
                        </p>
                        {!info?.logo ? (<label className='cursor-pointer w-full border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center transition-all hover:border-slate-500'>
                            <Upload />
                            <p className='text-sm text-slate-600 font-medium mt-2'>Click to uplaod logo</p>
                            <p className='text-xs text-slate-600 mt-1'>Max of 5 MB (PNG or JPG)</p>
                            <input type="file" accept='image/*' className='hidden' onChange={handleImgUpload}/>
                        </label>) : (
                            <div className='relative cursor-pointer w-full border-2 border-slate-300 rounded-lg p-8 flex items-center gap-4'>
                                <div className='w-20 h-20 rounded-lg overflow-hidden border border-slate-300'>
                                    <img src={info.logoPreview} alt="logoPreview" className='w-full h-full object-contain'/>
                                </div>
                                <div className='flex-1 flex-col'>
                                    <p className='text-sm text-slate-700 font-medium'>{info?.logo?.name}</p>
                                    <p className='text-xs text-slate-500'>{(info?.logo?.size/(1024*1024)).toFixed(2)} MB</p>
                                </div>
                                {info?.uploadingLogo?<Spin/>:<button className='cursor-pointer' onClick={removeImageHandler}>
                                    <X />
                                </button>}
                            </div>
                        )}
                    </div>
                </form>

                <button className='w-full rounded-lg bg-blue-600 px-4 py-2.5 cursor-pointer text-sm text-white font-medium hover:bg-blue-700'>Complete Setup</button>
            </div>
        </div>
    </div>
  )
}

export default SchoolInformation
