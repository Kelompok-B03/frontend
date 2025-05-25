// src/components/PublicProfileSection.tsx (Create this file)
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import axiosInstance from '@/utils/axiosInstance';
import { PublicUserProfile } from '@/types/PublicUserProfile';
import { appColors } from '@/constants/colors';

const ProfileDisplayField = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>{label}</dt>
    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2 whitespace-pre-wrap break-words" style={{ color: appColors.textDark }}>{value || '-'}</dd>
  </div>
);

const isValidHttpUrl = (string: string | undefined | null): boolean => {
  if (!string || !string.trim()) return false;
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

interface PublicProfileSectionProps {
  userId: string;
}

const PublicProfileSection: React.FC<PublicProfileSectionProps> = ({ userId }) => {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID is not provided.');
      setIsLoading(false);
      return;
    }

    const fetchPublicProfile = async () => {
      setIsLoading(true);
      setError(null);
      setProfile(null);
      try {
        // The controller is at /api/public/profiles/{userId}
        const response = await axiosInstance.get<PublicUserProfile>(`/api/public/profiles/${userId}`);
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to fetch public profile:', err);
        if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
          setError((err.response as { data: { message?: string } }).data.message || 'Failed to load profile.');
        } else if (err instanceof Error) {
          setError(err.message || 'Failed to load profile.');
        } else {
          setError('An unexpected error occurred while loading the profile.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]); // Re-fetch if userId changes

  if (isLoading) {
    return (
      <section style={{ backgroundColor: appColors.babyPinkLight }} className="min-h-screen flex items-center justify-center">
        <div style={{ color: appColors.textDark }} className="text-xl font-semibold">Loading profile...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ backgroundColor: appColors.babyPinkLight }} className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <h2 className="text-2xl font-bold mb-3" style={{color: appColors.errorRedText}}>Profile Error</h2>
          <p className="text-sm" style={{ color: appColors.textDarkMuted }}>{error}</p>
        </div>
      </section>
    );
  }

  if (!profile) {
    // This case might be redundant if error handling is robust, but good as a fallback
    return (
      <section style={{ backgroundColor: appColors.babyPinkLight }} className="min-h-screen flex items-center justify-center">
        <div style={{ color: appColors.textDarkMuted }}>Profile data could not be loaded.</div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: appColors.babyPinkLight }}
    >
      {/* Optional: Decorative background elements from your MyProfileSection */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse" style={{ backgroundColor: appColors.babyTurquoiseLight }}></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse-reverse" style={{ backgroundColor: appColors.babyPinkAccent }}></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold mb-8" style={{ color: appColors.textDark }}>
          {profile.name}&#39;s Profile
        </h2>

        <div className="shadow-2xl rounded-xl p-6 sm:p-8 md:p-10" style={{ backgroundColor: appColors.white }}>
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
            <div className="flex-shrink-0 mb-6 sm:mb-0 sm:w-1/3 flex justify-center sm:justify-start">
              {isValidHttpUrl(profile.profilePictureUrl) ? (
                <Image 
                  src={profile.profilePictureUrl!} 
                  alt={`${profile.name}'s Profile Photo`} 
                  width={160} 
                  height={160} 
                  className="rounded-lg object-cover h-40 w-40" 
                  unoptimized
                />
              ) : (
                <UserCircleIcon className="h-40 w-40" style={{ color: appColors.lightGrayBg }} />
              )}
            </div>
            
            <div className="w-full sm:w-2/3">
              <dl className="divide-y" style={{borderColor: appColors.lightGrayBg}}>
                <ProfileDisplayField label="Name" value={profile.name} />
                <ProfileDisplayField label="Bio" value={profile.bio} />
                <ProfileDisplayField 
                  label="Joined Since" 
                  value={profile.memberSince ? new Date(profile.memberSince).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} 
                />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicProfileSection;