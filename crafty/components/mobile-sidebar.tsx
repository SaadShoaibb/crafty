"use-client"

import React from 'react'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'

type Props = {}

const MobileSidebar = (props: Props) => {
  return (
    <Button variant="ghost" size="icon" className='md:hidden'>
            <Menu/>
        </Button>
  )
}

export default MobileSidebar