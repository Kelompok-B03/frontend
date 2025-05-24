import React from 'react'
import DonationPage from '@/modules/DonationModule/DonationPage';
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function DonationsRoute() {
  return (
    <div>
        <Navbar />
        <DonationPage />
        <Footer />
    </div>
  );
}