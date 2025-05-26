'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { appColors } from '@/constants/colors';

interface DonationModuleProps {
  children: ReactNode;
}

const DonationModule: React.FC<DonationModuleProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
        <div className="min-h-screen px-4 py-6" style={{ backgroundColor: appColors.white }}>
            <p style={{ color: appColors.textDarkMuted }}>Loading...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Prevent rendering until redirect happens
  }

  return (
    <>
      <Navbar />
        <main>{children}</main>
      <Footer />
    </>
  );
};

export default DonationModule;
