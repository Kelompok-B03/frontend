"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getAllTransactions } from '@/services/walletService';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  createdAt: string;
}

interface PageInfo {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export default function TransactionsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    totalElements: 0,
    totalPages: 1,
    currentPage: 0,
    size: 10
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/wallet/transactions');
      return;
    }

    if (user?.id) {
      const fetchTransactions = async () => {
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
      };

      fetchTransactions();
    }
  }, [user, isAuthenticated, authLoading, router, pageInfo.currentPage, pageInfo.size]);

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= pageInfo.totalPages) return;
    setPageInfo(prev => ({ ...prev, currentPage: page }));
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/wallet/balance" className="text-blue-600 mr-2">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold">Transaction History</h1>
      </div>
      
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded">
          {error}
          <button 
            onClick={() => window.location.reload()} 
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg p-4">
            {transactions.length > 0 ? (
              <div className="divide-y">
                {transactions.map((transaction) => (
                  <Link key={transaction.id} href={`/wallet/transactions/${transaction.id}`}>
                    <div className="py-4 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className={`font-semibold ${transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'} Rp {Math.abs(transaction.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
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
                      pageInfo.currentPage === idx ? 'bg-blue-600 text-white' : ''
                    }`}
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
      )}
    </div>
  );
}