import { notFound } from 'next/navigation';
import Link from 'next/link';

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

export default async function CampaignDetailSection({ params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:8080/api/campaign/${params.id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return notFound();
  }

  const campaign: Campaign = await res.json();
  const percentage = campaign.targetAmount > 0
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

        <Link href="/campaign">
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
