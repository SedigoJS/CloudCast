'use client'

import { CloudSun, Moon, Sun, LogOut, Music, CloudFog } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const linkClasses = (path: string) =>
    `flex items-center space-x-2 p-2 rounded-xl ${
      pathname === path ? 'bg-blue-300 dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
    } text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors`

  return (
    <nav className="bg-blue-200 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-evenly items-center">
        <div className="flex items-center">
          <CloudSun className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">CloudCast</span>
        </div>


        <Link href="/music-player" className={linkClasses('/music-player')}>
          <Music className="h-5 w-5" />
          <span className="hidden sm:inline">Music Player</span>
        </Link>
        <Link href="/dashboard" className={linkClasses('/dashboard')}>
          <CloudFog className="h-5 w-5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button 
            className="p-2 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            onClick={() => router.push('/')}
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
