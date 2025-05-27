import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CampaignSection from './sections/CampaignSections'


const index = () => {
  return (
    <div className="font-sans bg-baby-pink-light">
      <Navbar />
      <main>
        <CampaignSection />
      </main>
      <Footer />
    </div>
  );
}

export default index