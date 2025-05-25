'use client';

import React from 'react';
import { appColors } from '@/constants/colors';

type DonationCardProps = {
  stateName: string;
  createdAt: string;
  message: string;
  amount: number;
};

const DonationCard: React.FC<DonationCardProps> = ({ stateName, createdAt, message, amount }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4 border" style={{ borderColor: appColors.lightGrayBg }}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</span>
        <span className="text-sm font-semibold text-pink-600">{stateName}</span>
      </div>
      <p className="text-base text-gray-700 mb-2">{message}</p>
      <div className="text-right text-lg font-bold text-teal-600">Rp {amount.toLocaleString('id-ID')}</div>
    </div>
  );
};

export default DonationCard;
