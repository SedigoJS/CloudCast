'use client'

import { CloudSun, Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const route = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <nav className="bg-blue-200 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 shadow-md p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <CloudSun className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">CloudCast</span>
        </div>
        <div className='flex items-center gap-5'>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button className="p-2 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white"
            onClick={() => route.push('/')}
          >
            <LogOut />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar