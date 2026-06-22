/* eslint-disable react-hooks/immutability */
"use client"
import { authClient } from '@/config/authClient.js'
import { useParams, useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useRef } from 'react'

const ProtectedLayout = ({children}) => {
    const { data, isPending, refetch } = authClient.useSession();
    const params = useParams()
    const router = useRouter()
    const checkRef = useRef(false)
    const slug = params?.id
    useEffect(()=>{
      handleAuthCheck();
    })

    const handleAuthCheck = useCallback(async()=>{
      if(!isPending && !data){
          if(checkRef.current){
            router.push(`/${slug}/login`)
          }else{
            await refetch();
            checkRef.current=true 
          }
        }
      },[router, slug, refetch, isPending, data])
  return (
    <>
        {children}
    </>
  )
}

export default memo(ProtectedLayout)
