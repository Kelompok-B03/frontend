// file: /app/campaigns/[id]/donate/page.tsx

import DonationForm from '@/modules/DonationModule/sections/DonationForm';
import DonationModule from '@/modules/DonationModule';

type Props = {
  params: { id: string };
};

export default function DonationFormPage({ params }: Props) {
  return (
    <DonationModule>
      <div className="min-h-screen py-12 px-6 bg-gray-100">
        <DonationForm campaignId={params.id} />
      </div>
    </DonationModule>
  );
}
