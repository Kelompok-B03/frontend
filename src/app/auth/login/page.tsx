import Navbar from '@/components/layout/Navbar'
import LoginSection from '@/modules/AuthModule/sections/LoginSection'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar />
      <LoginSection />
    </div>
  )
}

export default page