'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { appColors } from '@/constants/colors';

const DonationSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6" style={{ backgroundColor: appColors.white }}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: appColors.textDark }}>
        Pembayaran Berhasil
      </h1>
      <p className="text-lg mb-6" style={{ color: appColors.textDarkMuted }}>
        Terima kasih telah menyumbangkan donasi.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 rounded"
          style={{ backgroundColor: appColors.babyTurquoiseAccent, color: appColors.white }}
        >
          Kembali ke Beranda
        </button>
        <button
          onClick={() => router.push('/my-donations')}
          className="px-6 py-2 rounded"
          style={{ backgroundColor: appColors.babyPinkAccent, color: appColors.white }}
        >
          Lihat Donasi Saya
        </button>
      </div>
    </div>
  );
};

export default DonationSuccessPage;
