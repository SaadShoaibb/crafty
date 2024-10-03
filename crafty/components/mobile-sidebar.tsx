"use-client"

import React from 'react'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import Sidebar from './Sidebar'

type Props = {}

const MobileSidebar = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className='md:hidden'>
            <Menu/>
        </Button>
        </SheetTrigger>
        <SheetContent side="left" className='p-0'>
          <Sidebar/>

        </SheetContent>
        </Sheet>
  )
}

export default MobileSidebar