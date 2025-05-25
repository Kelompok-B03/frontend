'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const [form, setForm] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          targetAmount: parseInt(form.targetAmount),
          fundraiserId: 'user-001', // ← Ganti dengan ID user dari auth
          status: 'MENUNGGU_VERIFIKASI',
          fundsCollected: 0,
        }),
      });

      if (!res.ok) throw new Error('Gagal membuat campaign');

      const data = await res.json();
      alert('Campaign berhasil dibuat!');
      router.push(`/my-campaign/${data.campaignId}`);
    } catch (err) {
      alert('Terjadi kesalahan saat membuat campaign.');
    }
  };

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
              className="px-5 py-2 rounded-md text-white text-sm"
              style={{ backgroundColor: appColors.babyTurquoiseAccent }}
            >
              Simpan Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
