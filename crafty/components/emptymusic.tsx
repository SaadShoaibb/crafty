import Image from 'next/image';
import React from 'react'
interface EmptyProps{
    label:string;
}


export const EmptyMusic = ({
    label
}:EmptyProps) => {
  return (
    <div className='h-full p-20 flex flex-col items-center justify-center'>
        <div className ='relative h-80 w-80'>
            <Image
            alt='Empty'
            fill
            src="/emptymusic.png"
            />
        </div>
        <p className='text-muted-foreground text-red-600 text-sm text-center'>
            {label}
        </p>
        
    </div>
  )
}