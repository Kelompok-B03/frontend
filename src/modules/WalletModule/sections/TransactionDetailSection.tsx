"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTransactionById, deleteTransaction } from '@/modules/WalletModule/service'; 
import { appColors } from '@/constants/colors';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  createdAt: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentMethod?: string;
  reference?: string;
  campaignId?: string;
  originalType?: string;
}

interface TransactionDetailProps {
  transactionId: string;
}

export default function TransactionDetailSection({ transactionId }: TransactionDetailProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id && transactionId) {
      const fetchTransactionDetails = async () => {
        setLoading(true);
        try {
          const data = await getTransactionById(user.id, transactionId);
          setTransaction(data);
        } catch (err) {
          console.error("Failed to fetch transaction details:", err);
          setError('Gagal memuat detail transaksi. Silakan coba lagi nanti.');
        } finally {
          setLoading(false);
        }
      };

      fetchTransactionDetails();
    }
  }, [user, transactionId]);

  const handleDeleteTransaction = async () => {
    if (!user?.id || !transaction?.id) return;
    
    if (!window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteTransaction(user.id, parseInt(transaction.id));
      router.push('/wallet/transactions');
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError('Gagal menghapus transaksi. Top-up yang sudah diproses tidak dapat dihapus.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getTransactionTypeDisplay = () => {
    switch (transaction?.originalType) {
      case 'TOP_UP':
        return { label: 'Top-up', icon: '💳' };
      case 'DONATION':
        return { label: 'Donasi', icon: '❤️' };
      case 'WITHDRAWAL':
        return { label: 'Penarikan Dana Kampanye', icon: '💰' };
      default:
        return { 
          label: transaction?.type === 'DEPOSIT' ? 'Deposit' : 'Penarikan', 
          icon: '💰' 
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: appColors.babyTurquoiseAccent }}></div>
            <p style={{ color: appColors.textDarkMuted }}>Memuat detail transaksi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: appColors.textDark }}>
            Terjadi Kesalahan
          </h3>
          <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: appColors.textDark }}>
            Transaksi Tidak Ditemukan
          </h3>
          <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
            Transaksi yang Anda cari tidak dapat ditemukan
          </p>
        </div>
      </div>
    );
  }

  const typeDisplay = getTransactionTypeDisplay();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{typeDisplay.icon}</span>
            <h2 className="text-xl font-bold" style={{ color: appColors.textDark }}>
              {typeDisplay.label}
            </h2>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
            transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {transaction.status === 'COMPLETED' ? '✅ Selesai' :
             transaction.status === 'PENDING' ? '⏳ Pending' : 
             '❌ Gagal'}
          </span>
        </div>
      </div>
      
      {/* Transaction Details */}
      <div className="p-6">
        <dl className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <dt className="font-medium" style={{ color: appColors.textDarkMuted }}>Jumlah</dt>
            <dd className={`font-bold text-xl ${transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'DEPOSIT' ? '+' : '-'} Rp {Math.abs(transaction.amount).toLocaleString()}
            </dd>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <dt className="font-medium" style={{ color: appColors.textDarkMuted }}>Tanggal</dt>
            <dd style={{ color: appColors.textDark }}>{new Date(transaction.createdAt).toLocaleString('id-ID')}</dd>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <dt className="font-medium" style={{ color: appColors.textDarkMuted }}>Jenis</dt>
            <dd style={{ color: appColors.textDark }}>{typeDisplay.label}</dd>
          </div>
          
          {transaction.reference && (
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <dt className="font-medium" style={{ color: appColors.textDarkMuted }}>ID Referensi</dt>
              <dd className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg" style={{ color: appColors.textDark }}>
                {transaction.reference}
              </dd>
            </div>
          )}
          
          {transaction.paymentMethod && (
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <dt className="font-medium" style={{ color: appColors.textDarkMuted }}>Metode Pembayaran</dt>
              <dd className="flex items-center space-x-2">
                <span>{transaction.paymentMethod === 'GOPAY' ? '🟢' : '🔵'}</span>
                <span style={{ color: appColors.textDark }}>{transaction.paymentMethod}</span>
              </dd>
            </div>
          )}
          
          {transaction.campaignId && (
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <dt className="font-medium" style={{ color: appColors.textDarkMuted }}>ID Kampanye</dt>
              <dd className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                #{transaction.campaignId}
              </dd>
            </div>
          )}

          <div className="flex justify-between items-start py-3">
            <dt className="font-medium" style={{ color: appColors.textDarkMuted }}>Deskripsi</dt>
            <dd className="text-right max-w-xs" style={{ color: appColors.textDark }}>
              {transaction.description}
            </dd>
          </div>
        </dl>
      </div>
      
      {/* Delete Button for TOP_UP transactions */}
      {transaction.originalType === 'TOP_UP' && (
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleDeleteTransaction}
            disabled={isDeleting}
            className="w-full text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: appColors.babyPinkAccent }}
          >
            {isDeleting ? '⏳ Menghapus...' : '🗑️ Hapus Transaksi'}
          </button>
          <p className="text-xs text-center mt-2" style={{ color: appColors.textDarkMuted }}>
            Hanya transaksi top-up yang dapat dihapus
          </p>
        </div>
      )}
    </div>
  );
}