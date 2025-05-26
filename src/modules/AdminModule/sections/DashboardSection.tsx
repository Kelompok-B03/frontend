"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminStatistics, AdminStatistics, getAnnouncements, Announcement } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import { ChartBarIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardSection() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStatistics>({
    totalUsers: 0,
    totalCampaigns: 0,
    totalDonations: 0,
    pendingCampaigns: 0,
    totalAmount: 0
  });
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Check if token exists
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        setError('No authentication token found. Please login to continue.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
        return;
      }
      
      const statsData = await getAdminStatistics();
      // Make sure all properties have default values if they're missing
      setStats({
        totalUsers: statsData?.totalUsers || 0,
        totalCampaigns: statsData?.totalCampaigns || 0,
        totalDonations: statsData?.totalDonations || 0,
        pendingCampaigns: statsData?.pendingCampaigns || 0,
        totalAmount: statsData?.totalAmount || 0
      });
      
      const announcementsData = await getAnnouncements();
      const announcementsList = Array.isArray(announcementsData) 
        ? announcementsData 
        : (announcementsData?.content || []);
      
      // Get the latest 5 announcements
      setAnnouncements(announcementsList.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}
        <button 
          onClick={() => fetchDashboardData()} 
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>Dashboard</h1>
        <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
          Welcome to the admin dashboard. Here&apos;s an overview of your platform&apos;s status.
        </p>
      </div>

      {/* Stats Grid - Changed to 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
        {/* Users stat card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm" style={{ color: appColors.textDarkMuted }}>Total Users</p>
              <h2 className="text-2xl font-bold" style={{ color: appColors.textDark }}>{stats.totalUsers || 0}</h2>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: '#FEE2E2' }}>
              <UserGroupIcon className="h-6 w-6" style={{ color: '#EF4444' }} />
            </div>
          </div>
          <Link href="/admin/users" className="text-sm underline" style={{ color: appColors.textDarkMuted }}>
            View all users
          </Link>
        </div>

        {/* Campaigns stat card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm" style={{ color: appColors.textDarkMuted }}>Total Campaigns</p>
              <h2 className="text-2xl font-bold" style={{ color: appColors.textDark }}>{stats.totalCampaigns || 0}</h2>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: '#DBEAFE' }}>
              <GlobeAltIcon className="h-6 w-6" style={{ color: '#3B82F6' }} />
            </div>
          </div>
          <Link href="/admin/campaigns" className="text-sm underline" style={{ color: appColors.textDarkMuted }}>
            View all campaigns
          </Link>
        </div>

        {/* Donations stat card - Removed Total Amount text */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm" style={{ color: appColors.textDarkMuted }}>Total Donations</p>
              <h2 className="text-2xl font-bold" style={{ color: appColors.textDark }}>{stats.totalDonations || 0}</h2>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: '#D1FAE5' }}>
              <ChartBarIcon className="h-6 w-6" style={{ color: '#10B981' }} />
            </div>
          </div>
        </div>

        {/* Removed the Pending Approval card */}
      </div>

      {/* Recent announcements */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold" style={{ color: appColors.textDark }}>Recent Announcements</h2>
          <Link href="/admin/announcements" className="text-sm underline" style={{ color: appColors.textDarkMuted }}>
            View all
          </Link>
        </div>

        {announcements.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p style={{ color: appColors.textDarkMuted }}>No announcements have been created yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {announcements.map((announcement, index) => (
              <div 
                key={announcement?.id || index} 
                className={`p-4 ${index !== announcements.length - 1 ? 'border-b' : ''}`}
              >
                <p className="font-medium" style={{ color: appColors.textDark }}>{announcement?.title || 'No Title'}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: appColors.textDarkMuted }}>
                    {announcement?.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}