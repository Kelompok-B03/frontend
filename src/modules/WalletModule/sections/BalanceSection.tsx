"use client";
import { useEffect, useState } from 'react';
import { getWalletBalance, getRecentTransactions } from '@/modules/WalletModule/service'; 
import { useAuth } from '@/contexts/AuthContext';
import BalanceCard from '@/components/wallet/BalanceCard';
import TransactionList from '@/components/wallet/TransactionList';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  createdAt: string;
  originalType?: string;
}

export default function BalanceSection() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchData = async () => {
    if (user?.id) {
      try {
        setLoading(true);
        // Fetch wallet balance
        const balanceData = await getWalletBalance(user.id);
        setBalance(balanceData.balance);
        
        // Fetch recent transactions (5)
        const transactionsData = await getRecentTransactions(user.id, 5);
        setRecentTransactions(transactionsData);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to load wallet data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleTransactionDeleted = () => {
    // Refresh data when a transaction is deleted
    fetchData();
  };

  if (loading) {
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
          className="text-white py-2 px-4 rounded hover:opacity-90"
          style={{ backgroundColor: "#36A5A0" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <BalanceCard balance={balance} />
      <TransactionList 
        transactions={recentTransactions} 
        showViewAll={true} 
        onTransactionDeleted={handleTransactionDeleted}
      />
    </div>
  );
}