import React from 'react'
import MyProfileSection from '@/modules/ProfileModule/sections/MyProfileSection'
import Navbar from '@/components/layout/Navbar'

const page = () => {
  return (
    <div>
        <Navbar />
        <MyProfileSection />
    </div>
  )
}

export default page