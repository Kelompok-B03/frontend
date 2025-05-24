"use client";
import React from 'react';
import WalletNav from '@/components/wallet/WalletNav';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface WalletModuleProps {
  children: React.ReactNode;
}

const WalletModule: React.FC<WalletModuleProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect from the useEffect
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <WalletNav />
      {children}
    </div>
  );
};

export default WalletModule;