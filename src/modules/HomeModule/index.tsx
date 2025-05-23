import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HomeSection from './sections/HomeSection'
import AboutSection from './sections/AboutSection'


const index = () => {
  return (
    <div className="font-sans bg-baby-pink-light">
      <Navbar />
      <main>
        <HomeSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}

export default index