// filepath: c:\MyFolders\Kuliah\Sem4\Adpro\GatherLove\frontend\src\app\wallet\balance\page.tsx
"use client";
import WalletModule from '@/modules/WalletModule';
import BalanceSection from '@/modules/WalletModule/sections/BalanceSection';

export default function BalancePage() {
  return (
    <WalletModule>
      <BalanceSection />
    </WalletModule>
  );
}