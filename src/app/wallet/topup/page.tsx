"use client";
import Link from 'next/link';
import WalletModule from '@/modules/WalletModule';
import TopUpSection from '@/modules/WalletModule/sections/TopUpSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { appColors } from '@/constants/colors';

export default function TopUpPage() {
  return (
    <>
      <Navbar />
      <WalletModule>
        <div className="mb-6">
          <div className="flex items-center mb-6">
            <Link 
              href="/wallet/balance" 
              className="mr-2 py-1 px-3 rounded-lg transition-colors duration-300 hover:bg-gray-100"
              style={{ color: appColors.babyTurquoiseAccent }}
            >
              ← Kembali
            </Link>
            <h1 
              className="text-2xl font-bold"
              style={{ color: appColors.textDark }}
            >
              Top Up Wallet
            </h1>
          </div>
          <TopUpSection />
        </div>
      </WalletModule>
      <Footer />
    </>
  );
}