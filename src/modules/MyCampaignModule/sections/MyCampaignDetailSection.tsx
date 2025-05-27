'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import backendAxiosInstance from '@/utils/backendAxiosInstance';

type CampaignStatus = 'MENUNGGU_VERIFIKASI' | 'SEDANG_BERLANGSUNG' | 'SELESAI' | 'WITHDRAWED';

type Campaign = {
  campaignId: string;
  title: string;
  description: string;
  targetAmount: number;
  fundsCollected: number;
  startDate: string;
  endDate: string;
  fundraiserId: string;
  status: CampaignStatus | { name: CampaignStatus } | string;
  withdrawed?: boolean;
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

export default function MyCampaignDetailSection() {
  const router = useRouter();
  const params = useParams();
  const campaignId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaign = async () => {
      try {
        const res = await backendAxiosInstance.get(`/api/campaign/${campaignId}`);
        setCampaign(res.data);
      } catch {
        router.replace('/not-found');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, router]);

  const handleDelete = async () => {
    if (!campaignId || !confirm('Yakin ingin menghapus campaign ini?')) return;

    try {
      await backendAxiosInstance.delete(`/api/campaign/${campaignId}`);
      alert('Campaign berhasil dihapus.');
      router.push('/my-campaign');
    } catch {
      alert('Terjadi kesalahan saat menghapus campaign.');
    }
  };

  const handleCompleteCampaign = async () => {
    if (!campaignId || !confirm('Tandai campaign sebagai selesai?')) return;

    try {
      await backendAxiosInstance.post(`/api/campaign/${campaignId}/complete`);
      alert('Campaign berhasil ditandai selesai.');
      router.push('/my-campaign');
    } catch {
      alert('Terjadi kesalahan saat menandai campaign.');
    }
  };

  const handleWithdraw = async () => {
    if (!campaignId || !confirm('Tarik dana dari campaign ini?')) return;

    try {
      await backendAxiosInstance.post(`/api/campaign/${campaignId}/withdraw`);
      alert('Dana berhasil ditarik.');
      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              status: 'WITHDRAWED',
              withdrawed: true,
            }
          : prev,
      );
    } catch {
      alert('Terjadi kesalahan saat melakukan withdraw.');
    }
  };

  const handleUploadProof = () => {
    router.push(`/my-campaign/${campaignId}/upload-proof`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Memuat detail campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 font-semibold">Campaign tidak ditemukan.</p>
      </div>
    );
  }

  const percentage =
    campaign.targetAmount > 0
      ? Math.min(100, Math.round((campaign.fundsCollected / campaign.targetAmount) * 100))
      : 0;

  const statusText =
    typeof campaign.status === 'string'
      ? campaign.status.replace(/_/g, ' ')
      : campaign.status?.name?.replace(/_/g, ' ') || 'Tidak diketahui';

  const isSelesai =
    typeof campaign.status === 'string'
      ? campaign.status === 'SELESAI'
      : campaign.status?.name === 'SELESAI';

  const isWithdrawed =
    campaign.withdrawed ||
    (typeof campaign.status === 'string'
      ? campaign.status === 'WITHDRAWED'
      : campaign.status?.name === 'WITHDRAWED');

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: appColors.lightGrayBg }}>
      <div className="max-w-2xl mx-auto rounded-xl shadow-lg p-8" style={{ backgroundColor: appColors.white }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: appColors.textDark }}>
          {campaign.title}
        </h1>
        <p className="mb-6" style={{ color: appColors.textDarkMuted }}>
          {campaign.description}
        </p>

        <div className="mb-4">
          <div className="w-full rounded-full h-4 mb-2" style={{ backgroundColor: '#E5E7EB' }}>
            <div
              className="h-4 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%`, backgroundColor: appColors.babyTurquoiseAccent }}
            />
          </div>
          <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
            <strong style={{ color: appColors.babyTurquoiseAccent }}>
              Rp {campaign.fundsCollected.toLocaleString()}
            </strong>{' '}
            dari{' '}
            <strong>Rp {campaign.targetAmount.toLocaleString()}</strong>{' '}
            (
            <span style={{ color: appColors.babyTurquoiseAccent, fontWeight: 600 }}>
              {percentage}%
            </span>
            )
          </p>
        </div>

        <div className="text-sm mb-6" style={{ color: appColors.textDarkMuted }}>
          <p>🗓️ Periode: {campaign.startDate} sampai {campaign.endDate}</p>
          <p>👤 ID Fundraiser: {campaign.fundraiserId}</p>
          <p>📌 Status: {statusText}</p>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Link
            href={`/my-campaign/edit/${campaign.campaignId}`}
            className={`px-5 py-2 rounded-md text-white font-medium text-sm transition ${
              isWithdrawed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              backgroundColor: appColors.babyTurquoiseAccent,
              pointerEvents: isWithdrawed ? 'none' : 'auto',
            }}
          >
            ✏️ Edit Campaign
          </Link>

          <button
            onClick={handleCompleteCampaign}
            disabled={isWithdrawed}
            className={`px-5 py-2 rounded-md text-white font-medium text-sm transition ${
              isWithdrawed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: appColors.babyTurquoiseAccent }}
          >
            ✅ Tandai Selesai
          </button>

          <button
            onClick={handleDelete}
            disabled={isWithdrawed}
            className={`px-5 py-2 rounded-md text-white font-medium text-sm transition ${
              isWithdrawed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: appColors.babyPinkAccent }}
          >
            🗑️ Hapus Campaign
          </button>

          <button
            onClick={handleWithdraw}
            disabled={isWithdrawed || !isSelesai}
            className={`px-5 py-2 rounded-md text-white font-medium text-sm transition ${
              isWithdrawed || !isSelesai ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: appColors.babyPinkAccent }}
          >
            💰 Withdraw Dana
          </button>

          {isSelesai && (
            <button
              onClick={handleUploadProof}
              className="px-5 py-2 rounded-md text-white font-medium text-sm transition"
              style={{ backgroundColor: appColors.babyTurquoiseAccent }}
            >
              📤 Upload Bukti Penggunaan Dana
            </button>
          )}

          <Link href="/my-campaign">
            <button
              className="px-5 py-2 rounded-md text-sm transition border"
              style={{ color: appColors.textDarkMuted, borderColor: appColors.textDarkMuted }}
            >
              ← Kembali ke daftar saya
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
