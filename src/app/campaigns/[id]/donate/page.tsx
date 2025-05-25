'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { appColors } from '@/constants/colors';

const DonationFormPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            campaignId: id,
            amount: parseInt(amount),
            message: message.trim() !== '' ? message : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process donation');
      }

      router.push('/donation/success');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: appColors.white }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: appColors.textDark }}>
          Buat Donasi
        </h1>

        <label className="block mb-2 text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
            Jumlah Donasi (Rp)
        </label>
        <input
            type="number"
            required
            min={1000}
            max={10000000}
            step={1}
            value={amount}
            onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) setAmount(value); // Only allow digits
            }}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2 text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
          Pesan (Opsional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        ></textarea>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded"
          style={{ backgroundColor: appColors.babyPinkAccent, color: appColors.white }}
        >
          Konfirmasi
        </button>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow text-center">
              <p style={{ color: appColors.textDark }}>Memproses pembayaran...</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default DonationFormPage;
