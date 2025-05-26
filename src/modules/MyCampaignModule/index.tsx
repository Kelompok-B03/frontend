import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MyCampaignSections from './sections/MyCampaignSections'


const index = () => {
  return (
    <div className="font-sans bg-baby-pink-light">
      <Navbar />
      <main>
        <MyCampaignSections />
      </main>
      <Footer />
    </div>
  );
}

export default index