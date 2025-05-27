
import React, { use } from 'react';
import DonationForm from '@/modules/DonationModule/sections/DonationForm';
import DonationModule from '@/modules/DonationModule';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DonationFormPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <DonationModule>
      <div className="min-h-screen py-12 px-6 bg-gray-100">
        <DonationForm campaignId={id} />
      </div>
    </DonationModule>
  );
}
