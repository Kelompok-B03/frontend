"use client";
import Link from 'next/link';
import WalletModule from '@/modules/WalletModule';
import TransactionsSection from '@/modules/WalletModule/sections/TransactionsSection';

export default function TransactionsPage() {
  return (
    <WalletModule>
      <div className="mb-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet/balance" className="text-blue-600 mr-2">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold">Transaction History</h1>
        </div>
        <TransactionsSection />
      </div>
    </WalletModule>
  );
}