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
  const [messageFieldError, setMessageFieldError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const invalidChars = /[<>=]/;

    if (invalidChars.test(value)) {
      setMessageFieldError('Pesan tidak boleh mengandung karakter khusus seperti <, >, atau =.');
    } else {
      setMessageFieldError('');
      setMessage(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const intAmount = parseInt(amount, 10);
    if (isNaN(intAmount) || intAmount < 1000 || intAmount > 10000000) {
      setErrorMessage('Jumlah donasi harus antara 1.000 hingga 10.000.000');
      return;
    }

    // Show loading pop-up
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
          campaignId: campaignId,
          amount: intAmount,
          message: message,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      // Show success pop-up
      setIsSuccess(true);

    } catch (err) {
      if (err instanceof Error){
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan pada sistem.');
      }
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
          onChange={handleMessageChange}
          className="w-full p-2 border rounded mb-2"
        />

        {messageFieldError && (
          <p className="text-sm text-red-600 mb-4">{messageFieldError}</p>
        )}

        <button
          type="submit"
          className="w-full py-2 text-white font-bold rounded"
          style={{ backgroundColor: appColors.babyPinkAccent }}
          disabled={isLoading || !!messageFieldError}
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

      {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center" style={{ backgroundColor: appColors.white }}>
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
        </div>
      )}
    </div>
  );
};

export default DonationForm;
