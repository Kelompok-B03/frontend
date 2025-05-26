'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Campaign = {
  campaignId: string;
  title: string;
  description: string;
  targetAmount: number;
  fundsCollected: number;
  startDate: string;
  endDate: string;
  fundraiserId: string;
  status: 'MENUNGGU_VERIFIKASI' | 'SEDANG_BERLANGSUNG' | 'SELESAI';
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
  orangeAccent: '#F59E0B',
  grayMuted: '#9CA3AF',
  greenAccent: '#10B981',
};

function getStatusBadge(status: Campaign['status']) {
  switch (status) {
    case 'MENUNGGU_VERIFIKASI':
      return { text: 'Menunggu Verifikasi', color: appColors.orangeAccent };
    case 'SEDANG_BERLANGSUNG':
      return { text: 'Sedang Berlangsung', color: appColors.babyTurquoiseAccent };
    case 'SELESAI':
      return { text: 'Selesai', color: appColors.greenAccent };
    default:
      return { text: 'Tidak Diketahui', color: appColors.grayMuted };
  }
}

export default function MyCampaignSections() {
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        const res = await fetch(`http://localhost:8080/api/campaign/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Gagal mengambil data');
        }

        const data = await res.json();
        setMyCampaigns(data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && isAuthenticated) {
      fetchData();
    }
  }, [user, isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return <p className="p-8 text-center text-gray-500">Memuat...</p>;
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: appColors.lightGrayBg }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>
          🧑‍💼 Campaign Saya
        </h1>
        <Link
          href="/my-campaign/create"
          className="px-4 py-2 text-sm font-medium rounded-md text-white"
          style={{ backgroundColor: appColors.babyTurquoiseAccent }}
        >
          ➕ Buat Campaign Baru
        </Link>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : myCampaigns.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada campaign yang kamu buat.</p>
      ) : (
        <div className="space-y-6">
          {myCampaigns.map((item) => {
            const percentage = item.targetAmount > 0
              ? Math.min(100, Math.round((item.fundsCollected / item.targetAmount) * 100))
              : 0;

            const statusInfo = getStatusBadge(item.status);

            return (
              <Link
                key={item.campaignId}
                href={`/my-campaign/${item.campaignId}`}
                className="block rounded-xl shadow bg-white hover:shadow-md transition duration-200"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6">
                  <div className="flex-1 space-y-2 md:space-y-0 md:mr-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h2 className="text-lg font-semibold" style={{ color: appColors.textDark }}>
                        {item.title}
                      </h2>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: statusInfo.color + '22',
                          color: statusInfo.color,
                        }}
                      >
                        {statusInfo.text}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>

                    <div className="w-full rounded-full h-3 bg-gray-200">
                      <div
                        className="h-3 rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: appColors.babyTurquoiseAccent }}
                      ></div>
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium text-teal-600">Rp {item.fundsCollected.toLocaleString()}</span>
                      <span> / Rp {item.targetAmount.toLocaleString()}</span>
                    </div>

                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full mt-1 inline-block"
                      style={{
                        backgroundColor: appColors.babyTurquoiseLight,
                        color: appColors.babyTurquoiseAccent,
                      }}
                    >
                      {percentage}% Terkumpul
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
