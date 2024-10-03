import Image from 'next/image'
import React from 'react'



export const Loader = () => {
  return (
    <div className='flex flex-col h-full gap-y-4 items-center justify-center'>
        <div className='w-10 h-10 relative animate-spin'>
            <Image
            alt='logo'
            fill 
            src="/logo.png"
            />
        </div>
        <p className='text-sm text-muted-foreground'>
            Crafting your request...
        </p>
    </div>
  )
}