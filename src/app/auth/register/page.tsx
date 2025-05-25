import RegisterSection from '@/modules/AuthModule/sections/RegisterSection'
import React from 'react'
import Navbar from '@/components/layout/Navbar'

const page = () => {
  return (
    <div>
      <Navbar />
      <div><RegisterSection /></div>
    </div>
  )
}

export default page