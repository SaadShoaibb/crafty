import Navbar from '@/components/navbar'
import Sidebar from '@/components/Sidebar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className='h-full relative'>
      <div className='hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-black'>
        <div>
          <Sidebar/>
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
