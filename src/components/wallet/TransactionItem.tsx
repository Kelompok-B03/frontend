import React from 'react';
import Link from 'next/link';
import { appColors } from '@/constants/colors';

interface TransactionItemProps {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  date: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  id, amount, type, description, date 
}) => {
  return (
    <Link href={`/wallet/transactions/${id}`}>
      <div className="border-b pb-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium" style={{ color: appColors.textDark }}>{description}</p>
            <p className="text-sm" style={{ color: appColors.textDarkMuted }}>{date}</p>
          </div>
          <p className={`font-semibold ${
            type === 'DEPOSIT' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {type === 'DEPOSIT' ? '+' : '-'} Rp {Math.abs(amount).toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TransactionItem;