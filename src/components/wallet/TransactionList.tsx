import React from 'react';
import TransactionItem from './TransactionItem';
import Link from 'next/link';
import { appColors } from '@/constants/colors';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  createdAt: string;
  originalType?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  showViewAll?: boolean;
  onTransactionDeleted?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  showViewAll = false, 
  onTransactionDeleted 
}) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: appColors.textDark }}>
          Belum Ada Transaksi
        </h3>
        <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
          Mulai dengan melakukan top-up untuk transaksi pertama Anda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📋</span>
            <h2 className="text-xl font-bold" style={{ color: appColors.textDark }}>
              {showViewAll ? 'Transaksi Terbaru' : 'Semua Transaksi'}
            </h2>
          </div>
          {showViewAll && (
            <Link 
              href="/wallet/transactions" 
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: appColors.babyTurquoiseAccent }}
            >
              Lihat Semua →
            </Link>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {transactions.map(transaction => (
          <TransactionItem
            key={transaction.id}
            id={transaction.id}
            amount={transaction.amount}
            type={transaction.type}
            description={transaction.description}
            date={new Date(transaction.createdAt).toLocaleDateString()}
            originalType={transaction.originalType}
            onTransactionDeleted={onTransactionDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;