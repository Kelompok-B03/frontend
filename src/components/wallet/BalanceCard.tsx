import React from 'react';
import Link from 'next/link';
import { appColors } from '@/constants/colors';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  return (
    <div 
      className="rounded-2xl p-8 mb-8 shadow-lg relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${appColors.babyTurquoiseAccent} 0%, ${appColors.babyPinkAccent} 100%)`
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 translate-y-4 -translate-x-4"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">💰</span>
              <h2 className="text-lg font-medium opacity-90" style={{ color: appColors.white }}>
                Saldo Saat Ini
              </h2>
            </div>
            <p className="text-4xl font-bold mb-1" style={{ color: appColors.white }}>
              Rp {balance.toLocaleString()}
            </p>
            <p className="text-sm opacity-75" style={{ color: appColors.white }}>
              Tersedia untuk donasi dan penarikan
            </p>
          </div>
          <Link 
            href="/wallet/topup" 
            className="py-3 px-6 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              backgroundColor: appColors.white, 
              color: appColors.babyTurquoiseAccent
            }}
          >
            💳 Top Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;