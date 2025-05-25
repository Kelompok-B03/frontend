'use client'

import React, { useEffect, useState } from 'react';
import CampaignCard from '@/modules/CampaignViewModule/sections/CampaignCard';
import Layout from './layout';
import { appColors } from '@/constants/colors';

interface Campaign {
  campaignId: string;
  title: string;
  description: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/campaign/status/SEDANG_BERLANGSUNG');
        if (!response.ok) throw new Error('Failed to fetch campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
      <div className="bg-white min-h-screen p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Campaigns</h1>
        {loading && <p>Loading campaigns...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.campaignId} {...campaign} />
          ))}
        </div>
      </div>
  );
}
