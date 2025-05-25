import React from 'react';
import PublicProfileSection from '@/modules/ProfileModule/sections/PublicProfileSection';
import Navbar from '@/components/layout/Navbar';

interface UserProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;

  if (!userId) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">User ID is missing.</div>
      </section>
    );
  }

  return (
    <div>
      <Navbar />
      <PublicProfileSection userId={userId} />
    </div>
  );
}