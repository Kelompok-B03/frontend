import React, { useState } from 'react';
import Link from 'next/link';
import { appColors } from '@/constants/colors';
import { deleteTransaction } from '@/modules/WalletModule/service';
import { useAuth } from '@/contexts/AuthContext';

interface TransactionItemProps {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  date: string;
  originalType?: string;
  campaignId?: string;
  onTransactionDeleted?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  id, amount, type, description, date, originalType, campaignId, onTransactionDeleted
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setIsDeleting(true);
    try {
      if (user?.id) {
        await deleteTransaction(user.id, parseInt(id));
        if (onTransactionDeleted) {
          onTransactionDeleted();
        }
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getTransactionIcon = () => {
    switch (originalType) {
      case 'TOP_UP':
        return '💳';
      case 'DONATION':
        return '❤️';
      case 'WITHDRAWAL':
        return '💰';
      default:
        return '💰';
    }
  };

  const getTransactionLabel = () => {
    switch (originalType) {
      case 'TOP_UP':
        return 'Top-up';
      case 'DONATION':
        return 'Donation';
      case 'WITHDRAWAL':
        return 'Campaign Funds';
      default:
        return 'Transaction';
    }
  };

  return (
    <div className="border-b pb-3 hover:bg-gray-50 p-2 rounded">
      <Link href={`/wallet/transactions/${id}`} className="block">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 flex-1">
            <span className="text-2xl">{getTransactionIcon()}</span>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium" style={{ color: appColors.textDark }}>
                  {getTransactionLabel()}
                </p>
                {campaignId && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded" style={{ color: appColors.textDarkMuted }}>
                    #{campaignId}
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: appColors.textDarkMuted }}>{date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p className={`font-semibold ${
              type === 'DEPOSIT' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {type === 'DEPOSIT' ? '+' : '-'} Rp {Math.abs(amount).toLocaleString()}
            </p>
            {/* Show delete button only for TOP_UP transactions */}
            {originalType === 'TOP_UP' && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1"
                title="Delete transaction"
              >
                {isDeleting ? '...' : '🗑️'}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TransactionItem;