"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAnnouncement } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import Link from 'next/link';
import { MegaphoneIcon } from '@heroicons/react/24/outline';

export default function AnnouncementCreateSection() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  }; // Added closing brace and semicolon here

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>Create Announcement</h1>
        <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
          Create a new announcement that will be visible to all users.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: appColors.babyPinkLight }}>
            <MegaphoneIcon className="h-6 w-6" style={{ color: appColors.babyPinkAccent }} />
          </div>
          <h2 className="text-xl font-semibold" style={{ color: appColors.textDark }}>New Announcement</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium mb-1"
              style={{ color: appColors.textDark }}
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter announcement title"
              style={{ borderColor: appColors.lightGrayBg }}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label 
              htmlFor="content" 
              className="block text-sm font-medium mb-1"
              style={{ color: appColors.textDark }}
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded"
              rows={6}
              placeholder="Enter announcement content"
              style={{ borderColor: appColors.lightGrayBg }}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/announcements"
              className="px-4 py-2 rounded text-sm font-medium border"
              style={{ 
                borderColor: appColors.lightGrayBg,
                color: appColors.textDark 
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 rounded text-sm font-medium"
              style={{ 
                backgroundColor: appColors.babyTurquoiseAccent,
                color: appColors.white 
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}