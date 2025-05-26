"use client";
import React from 'react';
import WalletNav from '@/components/wallet/WalletNav';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { appColors } from '@/constants/colors';

interface WalletModuleProps {
  children: React.ReactNode;
}

const WalletModule: React.FC<WalletModuleProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: appColors.lightGrayBg }}>
        <div className="flex justify-center items-center py-32">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: appColors.babyTurquoiseAccent }}></div>
            <p style={{ color: appColors.textDarkMuted }}>Memuat dompet Anda...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ backgroundColor: appColors.lightGrayBg }}>
      {/* Wallet Header */}
      <div 
        className="relative overflow-hidden py-16"
        style={{
          background: `linear-gradient(135deg, ${appColors.babyTurquoiseAccent} 0%, ${appColors.babyPinkAccent} 100%)`
        }}
      >
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: appColors.white }}>
            💼 Dompet Saya
          </h1>
          <p className="text-lg opacity-90" style={{ color: appColors.white }}>
            Kelola saldo dan transaksi Anda dengan mudah
          </p>
          {user && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-sm font-medium" style={{ color: appColors.white }}>
                Selamat datang, {user.name.split(' ')[0]}! 👋
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8 -mt-8 relative z-10 mb-12">
        <WalletNav />
        {children}
      </div>
    </div>
  );
};

export default WalletModule;