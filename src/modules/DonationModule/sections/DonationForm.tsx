'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appColors } from '@/constants/colors';

interface DonationFormProps {
  campaignId: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ campaignId }) => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const intAmount = parseInt(amount, 10);
    if (isNaN(intAmount) || intAmount < 1000 || intAmount > 10000000) {
      setErrorMessage('Jumlah donasi harus antara 1.000 hingga 10.000.000');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId,
          amount: intAmount,
          message,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      router.push('/donation/success');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4" style={{ color: appColors.textDark }}>
        Buat Donasi
      </h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium" style={{ color: appColors.textDark }}>
          Jumlah Donasi (Rp)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2 text-sm font-medium" style={{ color: appColors.textDark }}>
          Pesan (opsional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full py-2 text-white font-bold rounded"
          style={{ backgroundColor: appColors.babyPinkAccent }}
          disabled={isLoading}
        >
          Konfirmasi
        </button>

        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </form>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-lg font-semibold" style={{ color: appColors.textDark }}>
              Memproses pembayaran...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationForm;
