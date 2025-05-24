"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import WalletModule from '@/modules/WalletModule';
import TransactionDetailSection from '@/modules/WalletModule/sections/TransactionDetailSection';

export default function TransactionDetailPage() {
  const { id } = useParams() as { id: string };
  
  return (
    <WalletModule>
      <div className="mb-6">
        <div className="flex items-center mb-6">
          <Link href="/wallet/transactions" className="text-blue-600 mr-2">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        
        <TransactionDetailSection transactionId={id} />
      </div>
    </WalletModule>
  );
}