import React from 'react';
import DonationForm from '@/modules/DonationModule/sections/DonationForm';
import DonationModule from '@/modules/DonationModule';

type Props = {
  params: { id: string };
};

const DonationFormPage = async ({ params }: Props) => {
  return (
    <DonationModule>
        <div className="min-h-screen py-12 px-6 bg-gray-100">
            <DonationForm campaignId={params.id} />
        </div>
    </DonationModule>
  );
};

export default DonationFormPage;