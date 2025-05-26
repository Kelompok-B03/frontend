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
        setError('Failed to load transactions. Please try again later.');
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
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4">
        {transactions.length > 0 ? (
          <div className="divide-y">
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
          <p className="text-center py-6">No transactions found</p>
        )}
      </div>
      
      {/* Pagination */}
      {pageInfo.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(pageInfo.currentPage - 1)}
              disabled={pageInfo.currentPage === 0}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: pageInfo.totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`px-4 py-2 border rounded-md ${
                  pageInfo.currentPage === idx ? 'text-white' : ''
                }`}
                style={{ 
                  backgroundColor: pageInfo.currentPage === idx 
                    ? appColors.babyTurquoiseAccent 
                    : 'transparent' 
                }}
              >
                {idx + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pageInfo.currentPage + 1)}
              disabled={pageInfo.currentPage === pageInfo.totalPages - 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}