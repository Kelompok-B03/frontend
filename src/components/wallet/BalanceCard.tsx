import React from 'react';
import Link from 'next/link';
import { appColors } from '@/constants/colors';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm" style={{ color: appColors.textDarkMuted }}>Current Balance</h2>
          <p className="text-3xl font-bold" style={{ color: appColors.textDark }}>
            Rp {balance.toLocaleString()}
          </p>
        </div>
        <Link 
          href="/wallet/topup" 
          className="py-2 px-4 rounded text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: appColors.babyTurquoiseAccent }}
        >
          Top Up
        </Link>
      </div>
    </div>
  );
};

export default BalanceCard;