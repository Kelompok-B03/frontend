import React from 'react';
import TransactionItem from './TransactionItem';
import Link from 'next/link';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  createdAt: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  showViewAll?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, showViewAll = false }) => {
  if (transactions.length === 0) {
    return <p className="text-center py-4 text-gray-500">No transactions found</p>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {showViewAll ? 'Recent Transactions' : 'Transactions'}
        </h2>
        {showViewAll && (
          <Link href="/wallet/transactions" className="text-blue-600 text-sm">
            View All
          </Link>
        )}
      </div>
      
      <div className="space-y-3">
        {transactions.map(transaction => (
          <TransactionItem
            key={transaction.id}
            id={transaction.id}
            amount={transaction.amount}
            type={transaction.type}
            description={transaction.description}
            date={new Date(transaction.createdAt).toLocaleDateString()}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;