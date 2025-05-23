// filepath: c:\MyFolders\Kuliah\Sem4\Adpro\GatherLove\frontend\src\app\wallet\balance\page.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getWalletBalance, getRecentTransactions } from '@/services/walletService';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  createdAt: string;
}

export default function BalancePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/wallet/balance');
      return;
    }

    if (user?.id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Fetch wallet balance
          const balanceData = await getWalletBalance(user.id);
          setBalance(balanceData.balance);
          
          // Fetch recent transactions (5)
          const transactionsData = await getRecentTransactions(user.id, 5);
          setRecentTransactions(transactionsData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching wallet data:', err);
          setError('Failed to load wallet data. Please try again later.');
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [user, isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Wallet</h1>
      
      {/* Balance Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm text-gray-500">Current Balance</h2>
            <p className="text-3xl font-bold">Rp {balance.toLocaleString()}</p>
          </div>
          <Link href="/wallet/top-up" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Top Up
          </Link>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Link href="/wallet/transactions" className="text-blue-600 text-sm">
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <Link key={transaction.id} href={`/wallet/transactions/${transaction.id}`}>
                <div className="border-b pb-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
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
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">No recent transactions</p>
          )}
        </div>
      </div>
    </div>
  );
}