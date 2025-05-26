"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import WalletModule from '@/modules/WalletModule';
import TransactionDetailSection from '@/modules/WalletModule/sections/TransactionDetailSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { appColors } from '@/constants/colors';

export default function TransactionDetailPage() {
  const { id } = useParams() as { id: string };
  
  return (
    <>
      <Navbar />
      <WalletModule>
        <div className="mb-6">
          <div className="flex items-center mb-6">
            <Link 
              href="/wallet/transactions" 
              className="mr-2 py-1 px-3 rounded-lg transition-colors duration-300 hover:bg-gray-100"
              style={{ color: appColors.babyTurquoiseAccent }}
            >
              ← Kembali
            </Link>
            <h1 
              className="text-2xl font-bold"
              style={{ color: appColors.textDark }}
            >
              Detail Transaksi
            </h1>
          </div>
          
          <TransactionDetailSection transactionId={id} />
        </div>
      </WalletModule>
      <Footer />
    </>
  );
}