import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HomeSection from './sections/HomeSection'
import AboutSection from './sections/AboutSection'
import { appColors } from '@/constants/colors'


const page = () => {
  return (
    <div className="font-sans" style={{ backgroundColor:  appColors.babyPinkLight}}>
      <Navbar />
      <main>
        <HomeSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}

export default page