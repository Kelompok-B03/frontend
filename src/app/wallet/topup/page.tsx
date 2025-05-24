"use client";
import Link from 'next/link';
import WalletModule from '@/modules/WalletModule';
import TopUpSection from '@/modules/WalletModule/sections/TopUpSection';

export default function TopUpPage() {
  return (
    <WalletModule>
      <div className="mb-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet/balance" className="text-blue-600 mr-2">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold">Top Up Wallet</h1>
        </div>
        <TopUpSection />
      </div>
    </WalletModule>
  );
}