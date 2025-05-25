'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const appColors = {
  white: '#FFFFFF',
  lightGrayBg: '#F3F4F6',
  babyTurquoiseAccent: '#36A5A0',
  babyPinkAccent: '#D94A7B',
  textDark: '#374151',
  textMuted: '#6B7280',
};

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

export default function MyCampaignEditSection() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/campaign/${id}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCampaign(data);
        setForm({
          title: data.title,
          description: data.description,
          targetAmount: data.targetAmount.toString(),
          startDate: data.startDate,
          endDate: data.endDate,
        });
      } catch (err) {
        alert('Gagal memuat data campaign.');
        router.replace('/not-found');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCampaign();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/campaign/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campaign,
          ...form,
          targetAmount: parseInt(form.targetAmount),
        }),
      });

      if (!res.ok) throw new Error('Update failed');
      alert('Campaign berhasil diperbarui.');
      router.push(`/my-campaign/${id}`);
    } catch (err) {
      alert('Terjadi kesalahan saat memperbarui campaign.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Memuat data campaign...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ backgroundColor: appColors.lightGrayBg }}>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow" style={{ backgroundColor: appColors.white }}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: appColors.textDark }}>
          ✏️ Edit Campaign
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

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => router.push(`/my-campaign/${id}`)}
              className="px-5 py-2 rounded-md text-sm border text-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md text-white text-sm"
              style={{ backgroundColor: appColors.babyTurquoiseAccent }}
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
