'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import backendAxiosInstance from '@/utils/backendAxiosInstance';

export default function UploadProofPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [usageProofLink, setUsageProofLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usageProofLink) return alert('Link tidak boleh kosong');

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await backendAxiosInstance.post(
        `/campaign/${campaignId}/usage-proof`,
        { usageProofLink },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      alert('Bukti penggunaan dana berhasil diunggah!');
      router.push(`/my-campaign/${campaignId}`);
    } catch (error) {
      alert('Terjadi kesalahan saat upload bukti.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          📤 Upload Bukti Penggunaan Dana
        </h1>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Masukkan link bukti (Google Drive, YouTube, dll):
        </label>
        <input
          type="text"
          value={usageProofLink}
          onChange={(e) => setUsageProofLink(e.target.value)}
          placeholder="https://drive.google.com/..."
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
        >
          {loading ? 'Mengunggah...' : 'Upload'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 w-full border text-gray-700 py-2 px-4 rounded-md"
        >
          Batal
        </button>
      </form>
    </div>
  );
}
