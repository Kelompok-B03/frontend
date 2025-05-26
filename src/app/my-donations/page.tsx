import React from 'react'
import DonationPage from '@/modules/DonationModule/sections/DonationPage';
import DonationModule from '@/modules/DonationModule';

export default function DonationsRoute() {
  return (
    <div>
        <DonationModule>
          <DonationPage />
        </DonationModule>
    </div>
  );
}