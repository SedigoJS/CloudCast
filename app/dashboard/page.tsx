import React from 'react'
import Dashboard from './dashboard'
import Navbar from '../Navbar'
import { ThemeProvider } from 'next-themes'

const home = () => {
  return (
    <>
      <ThemeProvider attribute="class">
          <Navbar />
          <Dashboard />
      </ThemeProvider>
    </>
  )
}

export default home