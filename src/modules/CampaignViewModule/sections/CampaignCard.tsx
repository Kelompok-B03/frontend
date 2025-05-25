'use client';

import React from 'react';
import Link from 'next/link';
import { appColors } from '@/constants/colors';

interface CampaignCardProps {
  campaignId: string;
  title: string;
  description: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaignId, title, description }) => {
  return (
    <Link href={`/campaigns/${campaignId}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition duration-200 cursor-pointer">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
};

export default CampaignCard;
