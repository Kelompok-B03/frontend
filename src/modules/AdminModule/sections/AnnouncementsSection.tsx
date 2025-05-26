"use client";
import { useState, useEffect } from 'react';
import { getAnnouncements, deleteAnnouncement, Announcement } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function AnnouncementsSection() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : (data.content || []));
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError('Failed to load announcements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const success = await deleteAnnouncement(id);
      if (success) {
        setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
        // Use router here to refresh the page
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete announcement:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreate = () => {
    router.push('/admin/announcements/create');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading announcements...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}
        <button 
          onClick={() => fetchAnnouncements()} 
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>Announcements</h1>
          <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
            Manage platform-wide announcements.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 rounded text-white"
          style={{ backgroundColor: appColors.babyTurquoiseAccent }}
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Create New
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow">
          <p style={{ color: appColors.textDarkMuted }}>No announcements found. Create a new one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Created At</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium" style={{ color: appColors.textDark }}>{announcement.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: appColors.textDarkMuted }}>
                      {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      disabled={isDeleting === announcement.id}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      {isDeleting === announcement.id ? 'Deleting...' : <TrashIcon className="h-5 w-5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}