'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import backendAxiosInstance from '@/utils/backendAxiosInstance';

type Campaign = {
  campaignId: string;
  title: string;
  description: string;
  targetAmount: number;
  fundsCollected: number;
  startDate: string;
  endDate: string;
  fundraiserId: string;
  status: string;
};

const appColors = {
  babyPinkLight: '#FDECF0',
  babyTurquoiseLight: '#E0FCFA',
  lightGrayBg: '#F3F4F6',
  white: '#FFFFFF',
  textDark: '#374151',
  textDarkMuted: '#525E6C',
  babyPinkAccent: '#D94A7B',
  babyTurquoiseAccent: '#36A5A0',
};

export default function CampaignDetailSection({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await backendAxiosInstance.get(`/api/campaign/${campaignId}`);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        router.push('/not-found'); // redirect manual karena tidak bisa pakai notFound() di client
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, router]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!campaign) return null;

  const percentage =
    campaign.targetAmount > 0
      ? Math.min(100, Math.round((campaign.fundsCollected / campaign.targetAmount) * 100))
      : 0;

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: appColors.lightGrayBg }}>
      <div
        className="max-w-2xl mx-auto rounded-xl shadow-lg p-8"
        style={{ backgroundColor: appColors.white }}
      >
        <h1 className="text-3xl font-bold mb-4" style={{ color: appColors.textDark }}>
          {campaign.title}
        </h1>
        <p className="mb-6" style={{ color: appColors.textDarkMuted }}>
          {campaign.description}
        </p>

        <div className="mb-4">
          <div className="w-full rounded-full h-4 mb-2" style={{ backgroundColor: '#E5E7EB' }}>
            <div
              className="h-4 rounded-full"
              style={{ width: `${percentage}%`, backgroundColor: appColors.babyTurquoiseAccent }}
            ></div>
          </div>
          <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
            <strong style={{ color: appColors.babyTurquoiseAccent }}>
              Rp {campaign.fundsCollected.toLocaleString()}
            </strong>{' '}
            dari{' '}
            <strong>
              Rp {campaign.targetAmount.toLocaleString()}
            </strong>{' '}
            (
            <span style={{ color: appColors.babyTurquoiseAccent, fontWeight: 600 }}>
              {percentage}%
            </span>)
          </p>
        </div>

        <div className="text-sm mb-6" style={{ color: appColors.textDarkMuted }}>
          <p>🗓️ Periode: {campaign.startDate} sampai {campaign.endDate}</p>
          <p>👤 ID Fundraiser: {campaign.fundraiserId}</p>
          <p>📌 Status: {campaign.status}</p>
        </div>

        <Link href={`/campaigns/${campaignId}/donate`}>
          <button
            className="px-4 py-2 rounded transition mr-4"
            style={{
              backgroundColor: appColors.babyPinkAccent,
              color: appColors.white,
            }}
          >
            Donasi Sekarang
          </button>
        </Link>

        <Link href="/campaigns">
          <button
            className="mt-4 px-4 py-2 rounded transition"
            style={{
              backgroundColor: appColors.babyTurquoiseAccent,
              color: appColors.white,
            }}
          >
            ← Kembali ke daftar campaign
          </button>
        </Link>
      </div>
    </div>
  );
}
