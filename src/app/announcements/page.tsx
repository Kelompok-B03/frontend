"use client";
import { useState, useEffect } from 'react';
import { getPublicAnnouncements, AnnouncementDTO } from '@/services/announcementService';
import { appColors } from '@/constants/colors';
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const data = await getPublicAnnouncements();
        setAnnouncements(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
        setError('Gagal memuat pengumuman. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>
            Pengumuman
          </h1>
          <p className="mt-2 text-lg" style={{ color: appColors.textDarkMuted }}>
            Informasi dan pengumuman terbaru dari GatherLove
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: appColors.babyTurquoiseAccent }}></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm underline text-red-600"
            >
              Coba lagi
            </button>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MegaphoneIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium" style={{ color: appColors.textDark }}>
              Tidak ada pengumuman
            </h3>
            <p className="mt-1" style={{ color: appColors.textDarkMuted }}>
              Saat ini tidak ada pengumuman yang tersedia.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className="bg-white p-6 rounded-lg shadow-md border-l-4" 
                style={{ borderLeftColor: appColors.babyTurquoiseAccent }}
              >
                <h2 className="text-xl font-semibold mb-2" style={{ color: appColors.textDark }}>
                  {announcement.title}
                </h2>
                <div 
                  className="prose prose-sm max-w-none mt-4"
                  style={{ color: appColors.textDark }}
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
                <div className="mt-4 text-sm" style={{ color: appColors.textDarkMuted }}>
                  {new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}