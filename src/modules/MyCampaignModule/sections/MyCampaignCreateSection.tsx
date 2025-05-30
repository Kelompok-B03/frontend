'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import backendAxiosInstance from '@/utils/backendAxiosInstance';

const appColors = {
  white: '#FFFFFF',
  lightGrayBg: '#F3F4F6',
  babyTurquoiseAccent: '#36A5A0',
  babyPinkAccent: '#D94A7B',
  textDark: '#374151',
  textMuted: '#6B7280',
};

export default function CreateCampaignPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await backendAxiosInstance.post('/api/campaign', {
        ...form,
        targetAmount: parseInt(form.targetAmount),
        fundraiserId: user.id,
        status: 'MENUNGGU_VERIFIKASI',
        fundsCollected: 0,
      });

      alert('Campaign berhasil dibuat!');
      router.push(`/my-campaign/${response.data.campaignId}`);
    } catch (err) {
      alert('Terjadi kesalahan saat membuat campaign.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isAuthenticated) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen px-6 py-10" style={{ backgroundColor: appColors.lightGrayBg }}>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow" style={{ backgroundColor: appColors.white }}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: appColors.textDark }}>
          ➕ Buat Campaign Baru
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Judul</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Donasi (Rp)</label>
            <input
              name="targetAmount"
              type="number"
              value={form.targetAmount}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-md"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-md text-white text-sm"
              style={{
                backgroundColor: isSubmitting
                  ? appColors.babyPinkAccent
                  : appColors.babyTurquoiseAccent,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
