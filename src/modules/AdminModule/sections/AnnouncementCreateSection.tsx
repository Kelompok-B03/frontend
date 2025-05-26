"use client";
import { useState } from 'react';
import { createAnnouncement } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import { useRouter } from 'next/navigation';

export default function AnnouncementCreateSection() {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() === '' || content.trim() === '') {
      setError('Title and content are required.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await createAnnouncement({
        title: title.trim(),
        content: content.trim()
      });
      
      // Redirect to announcements page after successful creation
      router.push('/admin/announcements');
      router.refresh();
    } catch (err: unknown) {
      const errorResponse = err as { 
        response?: { 
          data?: { 
            message?: string 
          } 
        } 
      };
      setError(errorResponse.response?.data?.message || 'Failed to create announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>Create Announcement</h1>
        <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
          Create a new platform-wide announcement for all users.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1" style={{ color: appColors.textDark }}>
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Announcement Title"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium mb-1" style={{ color: appColors.textDark }}>
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 min-h-[200px]"
              placeholder="Announcement content..."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white rounded"
              style={{ backgroundColor: loading ? '#9CA3AF' : appColors.babyTurquoiseAccent }}
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}