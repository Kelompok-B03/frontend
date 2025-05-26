"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUserDetails, UserDTO } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface UserDetailsSectionProps {
  userId: string;
}

export default function UserDetailsSection({ userId }: UserDetailsSectionProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Define fetchUserDetails BEFORE using it in useEffect
  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserDetails(userId);
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setError('Failed to load user details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Now we can use it in useEffect
  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId, fetchUserDetails]);

  return (
      <div>
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-sm font-medium mb-6"
          style={{ color: appColors.babyTurquoiseAccent }}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Users
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>
            User Details
          </h1>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 flex justify-center">
            <div>Loading user details...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded">
            {error}
            <button onClick={fetchUserDetails} className="ml-2 underline">
              Retry
            </button>
          </div>
        ) : user ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  {user.profilePictureUrl ? (
                    <Image 
                      src={user.profilePictureUrl} 
                      alt={user.name || ''} 
                      width={80} 
                      height={80} 
                      className="rounded-full" 
                      unoptimized 
                    />
                  ) : (
                    <UserCircleIcon 
                      className="h-16 w-16" 
                      style={{ color: appColors.textDarkMuted }} 
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold" style={{ color: appColors.textDark }}>
                    {user.name || 'No Name'}
                  </h2>
                  <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="border-t" style={{ borderColor: appColors.lightGrayBg }}>
                <dl className="divide-y" style={{ borderColor: appColors.lightGrayBg }}>
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
                      User ID
                    </dt>
                    <dd className="text-sm col-span-2" style={{ color: appColors.textDark }}>
                      {user.id}
                    </dd>
                  </div>
                  
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
                      Status
                    </dt>
                    <dd className="text-sm col-span-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? 'Active' : 'Blocked'}
                      </span>
                    </dd>
                  </div>
                  
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
                      Phone Number
                    </dt>
                    <dd className="text-sm col-span-2" style={{ color: appColors.textDark }}>
                      {user.phoneNumber || '-'}
                    </dd>
                  </div>
                  
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
                      Bio
                    </dt>
                    <dd className="text-sm col-span-2" style={{ color: appColors.textDark }}>
                      {user.bio || '-'}
                    </dd>
                  </div>
                  
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
                      Roles
                    </dt>
                    <dd className="text-sm col-span-2" style={{ color: appColors.textDark }}>
                      {user.roles?.join(', ') || user.role || '-'}
                    </dd>
                  </div>
                  
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
                      Wallet ID
                    </dt>
                    <dd className="text-sm col-span-2" style={{ color: appColors.textDark }}>
                      {user.walletId || '-'}
                    </dd>
                  </div>
                  
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
                      Joined Date
                    </dt>
                    <dd className="text-sm col-span-2" style={{ color: appColors.textDark }}>
                      {new Date(user.createdAt).toLocaleString()}
                    </dd>
                  </div>
                  
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium" style={{ color: appColors.textDarkMuted }}>
                      Last Updated
                    </dt>
                    <dd className="text-sm col-span-2" style={{ color: appColors.textDark }}>
                      {new Date(user.updatedAt).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded">
            User not found.
          </div>
        )}
      </div>
  );
}