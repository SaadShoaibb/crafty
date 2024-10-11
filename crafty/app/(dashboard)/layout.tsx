import Navbar from '@/components/navbar'
import Sidebar from '@/components/Sidebar'
import { getApiLimitCount } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const DashboardLayout = async ({ children }: Props) => {

  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className='h-full relative'>
      <div className='hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0  bg-black'>
        <div>
          <Sidebar isPro = {isPro} apiLimitCount = {apiLimitCount}/>
        </div>
      </div>
      <main className='md:pl-72'>
        <Navbar/>
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
