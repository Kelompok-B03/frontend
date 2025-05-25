'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { appColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/utils/axiosInstance';
import { SparklesIcon, UserGroupIcon, PresentationChartLineIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ROLES = {
  DONOR: 'DONOR',
  FUNDRAISER: 'FUNDRAISER',
  ADMIN: 'ADMIN',
};

const UpgradeToFundraiserSection = () => {
  const { user, fetchUser, token, isLoading: authIsLoading } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [hasUpgradedInSession, setHasUpgradedInSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push('/auth/login?redirect=/upgrade-akun'); // Alihkan ke login jika belum terautentikasi
    }
  }, [authIsLoading, user, router]);

  const isAlreadyFundraiserOrAdmin = user?.roles.includes(ROLES.FUNDRAISER) || user?.roles.includes(ROLES.ADMIN);

  const handleUpgrade = async () => {
    if (!token || isAlreadyFundraiserOrAdmin || hasUpgradedInSession) return;

    setIsUpgrading(true);
    setStatusMessage(null);

    try {
      const response = await axiosInstance.post('/auth/upgrade');

      if (response.data && response.data.status === 'success') {
        setStatusMessage({ type: 'success', text: response.data.message || 'Akun Anda berhasil ditingkatkan menjadi Fundraiser!' });
        setHasUpgradedInSession(true);
        await fetchUser(); // Refresh user data to reflect new roles
      } else {
        throw new Error(response.data.message || 'Peningkatan akun gagal. Silakan coba lagi.');
      }
    } catch (err: unknown) {
      let errorMessage = 'Terjadi kesalahan tak terduga saat proses peningkatan.';
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err.response as { data?: { message?: string } };
        if (errorResponse.data && errorResponse.data.message) {
          errorMessage = errorResponse.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setStatusMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUpgrading(false);
    }
  };

  if (authIsLoading) {
    return (
      <section
        style={{ backgroundColor: appColors.babyPinkLight }}
        className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div style={{ color: appColors.textDark }} className="text-xl font-semibold">Memuat data pengguna...</div>
      </section>
    );
  }
  
  if (!user && !authIsLoading) {
    // Kasus ini idealnya ditangani oleh redirect useEffect,
    // tapi ini sebagai fallback atau ketika redirect belum terjadi.
    return (
      <section
        style={{ backgroundColor: appColors.babyPinkLight }}
        className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div style={{ color: appColors.textDark }} className="text-xl font-semibold">Silakan masuk untuk mengakses halaman ini.</div>
      </section>
    );
  }

  const benefits = [
    {
      icon: SparklesIcon,
      title: 'Luncurkan Kampanye Anda',
      description: 'Buat dan sesuaikan halaman penggalangan dana dengan mudah untuk menceritakan kisah Anda dan menginspirasi dukungan.',
    },
    {
      icon: UserGroupIcon,
      title: 'Galang Komunitas Anda',
      description: 'Bagikan kampanye Anda ke media sosial dan gerakkan jaringan Anda untuk berkontribusi dan menyebarkan berita.',
    },
    {
      icon: PresentationChartLineIcon,
      title: 'Pantau Kemajuan Anda',
      description: 'Monitor donasi secara real-time dan lihat dampak langsung dari upaya Anda.',
    },
  ];

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: appColors.babyPinkLight }}
    >
      {/* Animated Blobs */}
      <div
        className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse"
        style={{ backgroundColor: appColors.babyTurquoiseLight }}
      ></div>
      <div
        className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse-reverse"
        style={{ backgroundColor: appColors.babyPinkAccent }}
      ></div>

      {/* Content Card */}
      <div className="relative z-10 w-full max-w-2xl space-y-8 text-center">
        <div
          className="p-8 sm:p-10 rounded-xl shadow-2xl"
          style={{ backgroundColor: appColors.white }}
        >
          <UserGroupIcon className="mx-auto h-16 w-16 mb-6" style={{color: appColors.babyTurquoiseAccent}} />
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ color: appColors.textDark }}
          >
            {hasUpgradedInSession || isAlreadyFundraiserOrAdmin 
              ? "Status Akun Fundraiser Anda" 
              : "Jadi Fundraiser GatherLove!"}
          </h2>

          {statusMessage && (
            <div
              className={`p-4 mb-6 rounded-md text-sm text-center ${
                statusMessage.type === 'success' ? 'bg-green-100' : statusMessage.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
              }`}
              style={{
                color: statusMessage.type === 'success' ? appColors.successGreen : statusMessage.type === 'error' ? appColors.babyPinkAccent : appColors.textDark,
                backgroundColor: statusMessage.type === 'success' ? appColors.successGreenLight : statusMessage.type === 'error' ? '#FEE2E2' : appColors.babyTurquoiseLight
              }}
            >
              {statusMessage.text}
            </div>
          )}

          {isAlreadyFundraiserOrAdmin && !hasUpgradedInSession && (
            <div className="p-4 mb-6 rounded-md text-base" style={{backgroundColor: appColors.successGreenLight, color: appColors.successGreen}}>
              <CheckCircleIcon className="h-6 w-6 inline mr-2" />
              Anda sudah menjadi seorang {user?.roles.includes(ROLES.ADMIN) ? 'Administrator' : 'Fundraiser'}! Anda memiliki akses ke semua fitur fundraiser.
              <div className="mt-4">
                <Link href="/my-campaigns" legacyBehavior>
                  <a className="font-semibold hover:underline" style={{color: appColors.babyTurquoiseAccent}}>
                    Buka Dashboard Fundraiser Anda
                  </a>
                </Link>
              </div>
            </div>
          )}

          {hasUpgradedInSession && (
             <div className="p-4 mb-6 rounded-md text-base text-center" style={{backgroundColor: appColors.successGreenLight, color: appColors.successGreen}}>
              <CheckCircleIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="font-semibold text-lg">Peningkatan Berhasil!</p>
              <p className="mt-1">Akun Anda kini telah menjadi Fundraiser. Mulai buat kampanye dan sebarkan kebaikan!</p>
              <div className="mt-6">
                <Link href="/dashboard-fundraiser" legacyBehavior>
                  <a
                    className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: appColors.babyTurquoiseAccent,
                      color: appColors.white
                    }}
                  >
                    Buka Dashboard Fundraiser
                  </a>
                </Link>
              </div>
            </div>
          )}

          {!isAlreadyFundraiserOrAdmin && !hasUpgradedInSession && (
            <>
              <p className="text-lg mb-8" style={{ color: appColors.textDarkMuted }}>
                Siap membuat dampak yang lebih besar? Tingkatkan akun Anda menjadi Fundraiser untuk meluncurkan dan mengelola kampanye penggalangan dana Anda sendiri.
              </p>

              <div className="space-y-6 text-left mb-10 px-4 sm:px-0">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start space-x-3">
                    <benefit.icon className="h-7 w-7 flex-shrink-0" style={{color: appColors.babyTurquoiseAccent}} />
                    <div>
                      <h3 className="text-lg font-semibold" style={{color: appColors.textDark}}>{benefit.title}</h3>
                      <p style={{color: appColors.textDarkMuted}}>{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            
              <button
                onClick={handleUpgrade}
                disabled={isUpgrading || authIsLoading}
                className="w-full sm:w-auto group relative flex justify-center py-3 px-8 border border-transparent text-lg font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-105"
                style={{
                  backgroundColor: appColors.babyTurquoiseAccent,
                  color: appColors.white
                }}
              >
                {isUpgrading ? 'Sedang Memproses...' : 'Tingkatkan ke Akun Fundraiser'}
              </button>
              <p className="mt-6 text-xs" style={{color: appColors.textDarkMuted}}>
                Dengan mengeklik &quot;Tingkatkan&quot;, Anda menyetujui syarat dan ketentuan GatherLove untuk Fundraiser.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpgradeToFundraiserSection;