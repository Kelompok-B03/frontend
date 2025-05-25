'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { appColors } from '@/constants/colors';

type Campaign = {
  campaignId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

const CampaignDetail = () => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/campaign/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch campaign detail');
        }
        const data = await res.json();
        setCampaign(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white min-h-screen px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{campaign?.title}</h1>
      <p className="text-gray-700 mb-4">{campaign?.description}</p>
      <p className="text-gray-600 mb-1">
        <strong>Start Date:</strong> {campaign?.startDate}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>End Date:</strong> {campaign?.endDate}
      </p>
      <button className="bg-[color:var(--tw-prose-bold)] px-4 py-2 rounded text-white font-semibold" style={{ backgroundColor: appColors.babyTurquoiseAccent }}>
        Buat Donasi
      </button>
    </div>
  );
};

export default CampaignDetail;

