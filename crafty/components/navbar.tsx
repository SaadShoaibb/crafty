import React from 'react'
import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './mobile-sidebar'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <div className='flex items-center p-4'>
      <MobileSidebar/>
        <div className='flex w-full justify-end'>
        <UserButton
        appearance={{
          elements: {
            footer: {
              display: 'none',},},}} />
        </div>

    </div>
  )
}

export default Navbar