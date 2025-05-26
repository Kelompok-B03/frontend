"use client";
import { useEffect, useState } from 'react';
import { getAllTransactions } from '@/modules/WalletModule/service'; 
import { useAuth } from '@/contexts/AuthContext';
import TransactionItem from '@/components/wallet/TransactionItem';
import { appColors } from '@/constants/colors';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  createdAt: string;
  originalType?: string;
  campaignId?: string;
}

interface PageInfo {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export default function TransactionsSection() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    totalElements: 0,
    totalPages: 1,
    currentPage: 0,
    size: 10
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchTransactions = async () => {
    if (user?.id) {
      setLoading(true);
      try {
        const response = await getAllTransactions(user.id, pageInfo.currentPage, pageInfo.size);
        
        setTransactions(response.content);
        setPageInfo({
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          size: response.size
        });
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError('Gagal memuat transaksi. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, pageInfo.currentPage, pageInfo.size]);

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= pageInfo.totalPages) return;
    setPageInfo(prev => ({ ...prev, currentPage: page }));
  };

  const handleTransactionDeleted = () => {
    fetchTransactions();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: appColors.babyTurquoiseAccent }}></div>
            <p style={{ color: appColors.textDarkMuted }}>Memuat transaksi...</p>
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
          <p className="text-sm mb-4" style={{ color: appColors.textDarkMuted }}>
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="py-2 px-6 rounded-xl font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: appColors.babyTurquoiseAccent }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-bold" style={{ color: appColors.textDark }}>
                Semua Transaksi
              </h2>
            </div>
            <div className="text-sm" style={{ color: appColors.textDarkMuted }}>
              {pageInfo.totalElements} transaksi
            </div>
          </div>
        </div>

        {/* Transactions */}
        {transactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id}
                id={transaction.id}
                amount={transaction.amount}
                type={transaction.type}
                description={transaction.description}
                date={new Date(transaction.createdAt).toLocaleDateString()}
                originalType={transaction.originalType}
                campaignId={transaction.campaignId}
                onTransactionDeleted={handleTransactionDeleted}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: appColors.textDark }}>
              Belum Ada Transaksi
            </h3>
            <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
              Mulai dengan melakukan top-up untuk transaksi pertama Anda
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {pageInfo.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 bg-white rounded-2xl shadow-lg p-2">
            <button
              onClick={() => handlePageChange(pageInfo.currentPage - 1)}
              disabled={pageInfo.currentPage === 0}
              className="px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              style={{ color: appColors.textDark }}
            >
              ← Sebelumnya
            </button>
            
            {Array.from({ length: pageInfo.totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  pageInfo.currentPage === idx ? 'text-white shadow-md' : 'hover:bg-gray-50'
                }`}
                style={{ 
                  backgroundColor: pageInfo.currentPage === idx 
                    ? appColors.babyTurquoiseAccent 
                    : 'transparent',
                  color: pageInfo.currentPage === idx 
                    ? appColors.white 
                    : appColors.textDark
                }}
              >
                {idx + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pageInfo.currentPage + 1)}
              disabled={pageInfo.currentPage === pageInfo.totalPages - 1}
              className="px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              style={{ color: appColors.textDark }}
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      )}
    </>
  );
}