"use client";
import { useEffect, useState } from 'react';
import { getAdminStatistics, AdminStatistics, getAnnouncements, Announcement } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import { ChartBarIcon, UserGroupIcon, GlobeAltIcon, ClockIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardSection() {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [announcementsLoading, setAnnouncementsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const data = await getAdminStatistics();
        setStatistics(data);
      } catch (err) {
        console.error("Failed to fetch admin statistics:", err);
        setError('Failed to load admin statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      setAnnouncementsLoading(true);
      try {
        const response = await getAnnouncements();
        setAnnouncements(response.content || []);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setAnnouncementsLoading(false);
      }
    };

    fetchStatistics();
    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading statistics...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: statistics?.totalUsers || 0,
      icon: UserGroupIcon,
      color: appColors.babyPinkAccent,
      bgColor: appColors.babyPinkLight
    },
    {
      title: 'Total Campaigns',
      value: statistics?.totalCampaigns || 0,
      icon: GlobeAltIcon,
      color: appColors.babyTurquoiseAccent,
      bgColor: appColors.babyTurquoiseLight
    },
    {
      title: 'Total Donations',
      value: statistics?.totalDonations || 0,
      icon: ChartBarIcon,
      color: '#6366F1', // indigo
      bgColor: '#EEF2FF' // indigo-50
    },
    {
      title: 'Pending Campaigns',
      value: statistics?.pendingCampaigns || 0,
      icon: ClockIcon,
      color: '#F59E0B', // amber-500
      bgColor: '#FEF3C7' // amber-50
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>Admin Dashboard</h1>
        <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
          Welcome to the admin dashboard. Here's an overview of your platform's status.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>{stat.title}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: appColors.textDark }}>{stat.value.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: stat.bgColor }}>
                <stat.icon className="h-8 w-8" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Announcements Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: appColors.babyPinkLight }}>
              <MegaphoneIcon className="h-6 w-6" style={{ color: appColors.babyPinkAccent }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: appColors.textDark }}>Announcements</h2>
          </div>
          
          <Link 
            href="/admin/announcements/create" 
            className="px-4 py-2 rounded text-sm font-medium"
            style={{ 
              backgroundColor: appColors.babyTurquoiseAccent,
              color: appColors.white 
            }}
          >
            Create New
          </Link>
        </div>

        {announcementsLoading ? (
          <div className="py-8 text-center" style={{ color: appColors.textDarkMuted }}>
            Loading announcements...
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium" style={{ color: appColors.textDark }}>{announcement.title}</h3>
                  <span className="text-xs" style={{ color: appColors.textDarkMuted }}>
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-sm" style={{ color: appColors.textDarkMuted }}>
                  {announcement.content}
                </p>
              </div>
            ))}
            
            <div className="mt-4 text-right">
              <Link 
                href="/admin/announcements" 
                className="text-sm font-medium"
                style={{ color: appColors.babyTurquoiseAccent }}
              >
                View All Announcements →
              </Link>
            </div>
          </div>
        ) : (
          <div 
            className="py-12 text-center border border-dashed rounded-lg"
            style={{ borderColor: appColors.lightGrayBg }}
          >
            <p style={{ color: appColors.textDarkMuted }}>
              No announcements have been created yet.
            </p>
            <Link 
              href="/admin/announcements/create" 
              className="mt-2 inline-block text-sm font-medium"
              style={{ color: appColors.babyTurquoiseAccent }}
            >
              Create your first announcement
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}