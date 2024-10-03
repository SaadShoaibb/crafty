"use client"

import { Montserrat } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'
import { Code2, File, FileVideo2, ImageIcon, LayoutDashboard, MessageCircle, Music2, Settings, Speech, } from 'lucide-react'
import { usePathname } from 'next/navigation'

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-gray-500",
    },
    {
        label: "Chat",
        icon: MessageCircle,
        href: "/chat",
        color: "text-sky-500",
    },
    {
        label: "Generate Video",
        icon: FileVideo2,
        href: "/video",
        color: "text-green-500",
    },
    {
        label: "Generate Image",
        icon: ImageIcon,
        href: "/image",
        color: "text-pink-700",
    },
    {
        label: "Audio Transciption",
        icon: Speech,
        href: "/transcription",
        color: "text-purple-500",
    },
    {
        label: "Generate Music",
        icon: Music2,
        href: "/music",
        color: "text-red-700",
    },
    {
        label: "Generate Code",
        icon: Code2,
        href: "/code",
        color: "text-yellow-500",
    },
];

const Sidebar = () => {
    
    const pathname = usePathname();

    return (
        <div className='space-y-4 py-4 flex flex-col h-full bg-black text-white'>
            <div className='px-3 py-2 flex-1'>
                <Link href="/dashboard" className='flex items-center pl-3 mb-14'>
                    <div className='relative w-8 h-8 mr-4'>
                        <Image fill src="/logo.png" alt='logo' />
                    </div>
                    <h1 className={cn('text-2xl font-semibold', montserrat.className)}>Crafty AI</h1>
                </Link>
                <div className='space-y-1'>
                    {routes.map((route) => (
                        <Link href={route.href} key={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", 
                            pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                        )}>
                            <div className='flex items-center flex-1'>
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className='px-3 py-2'>
                <Link href="/settings" className='text-sm group flex p-3 w-full mt-52
                justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10
                rounded-lg transition'>
                    <div className='flex items-center flex-1 '>
                        <Settings className="h-5 w-5 mr-3 text-white" />
                        Settings
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;
