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

    if (!window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
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
      alert('Gagal menghapus transaksi. Silakan coba lagi.');
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
        return 'Donasi';
      case 'WITHDRAWAL':
        return 'Dana Kampanye';
      default:
        return 'Transaksi';
    }
  };

  const getTransactionBadgeColor = () => {
    switch (originalType) {
      case 'TOP_UP':
        return { bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'DONATION':
        return { bg: 'bg-pink-50', text: 'text-pink-700' };
      case 'WITHDRAWAL':
        return { bg: 'bg-green-50', text: 'text-green-700' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700' };
    }
  };

  const badgeColors = getTransactionBadgeColor();

  return (
    <div className="hover:bg-gray-50 transition-colors duration-200">
      <Link href={`/wallet/transactions/${id}`} className="block">
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4 flex-1">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: appColors.babyTurquoiseLight }}
            >
              {getTransactionIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="font-semibold" style={{ color: appColors.textDark }}>
                  {getTransactionLabel()}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColors.bg} ${badgeColors.text}`}>
                  {originalType?.replace('_', ' ')}
                </span>
                {campaignId && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full" style={{ color: appColors.textDarkMuted }}>
                    #{campaignId}
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
                {date}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className={`font-bold text-lg ${
                type === 'DEPOSIT' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {type === 'DEPOSIT' ? '+' : '-'} Rp {Math.abs(amount).toLocaleString()}
              </p>
            </div>
            
            {/* Show delete button only for TOP_UP transactions */}
            {originalType === 'TOP_UP' && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                title="Hapus transaksi"
              >
                {isDeleting ? '⏳' : '🗑️'}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TransactionItem;