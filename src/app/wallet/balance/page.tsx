// filepath: c:\MyFolders\Kuliah\Sem4\Adpro\GatherLove\frontend\src\app\wallet\balance\page.tsx
"use client";
import WalletModule from '@/modules/WalletModule';
import BalanceSection from '@/modules/WalletModule/sections/BalanceSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function BalancePage() {
  return (
    <>
      <Navbar />
      <WalletModule>
        <BalanceSection />
      </WalletModule>
      <Footer />
    </>
  );
}