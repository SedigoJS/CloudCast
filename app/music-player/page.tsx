import React from 'react'
import MusicPlayer from './Music-page'
import Navbar from '../Navbar'
import { ThemeProvider } from 'next-themes'

const music = () => {
  return (
    <>  
        <ThemeProvider attribute="class">
            <Navbar />
            <MusicPlayer />
        </ThemeProvider>
    </>
  )
}

export default music