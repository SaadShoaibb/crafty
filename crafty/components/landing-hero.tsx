"use client"

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Typewriter } from 'react-simple-typewriter';
import { Button } from './ui/button';

export const LandingHero = () => {

    const {isSignedIn} = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1> CraftyAI is a Powerful Tool That Can </h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-400">
          <Typewriter
            words={['Chat.', 'Generate Photos.', 'Generate Music.', 'Generate Code.', 'Generate Videos.', 'Transcribe Audio.']}
            loop={true}
            cursor
            cursorStyle='_'
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </div>
      </div>
      <div className='text-sm md:text-xl font-light text-zinc-400'>
        Create AI based content to save your precious time!
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
        <Button variant="premium" className='md:text-lg p-4 md:p-6 rounded-full font-semibold'>
            Start For Free
        </Button>
        </Link>
      </div>
      <div className='text-zinc-400 text-xs md:text-sm font-normal'>
        No Credit Card Needed!

      </div>
    </div>
  );
};
