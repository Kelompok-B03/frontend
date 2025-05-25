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
  campaignName?: string;
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
          setError('Failed to load transaction details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchTransactionDetails();
    }
  }, [user, transactionId]);

  const handleDeleteTransaction = async () => {
    if (!user?.id || !transaction?.id) return;
    
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteTransaction(user.id, parseInt(transaction.id));
      router.push('/wallet/transactions');
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError('Failed to delete transaction. Top-ups that have been processed cannot be deleted.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded">
        Transaction not found
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-lg font-medium" style={{ color: appColors.textDark }}>
          {transaction.description}
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm ${
          transaction.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
          transaction.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' : 
          'bg-red-50 text-red-700'
        }`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1).toLowerCase()}
        </span>
      </div>
      
      <dl className="divide-y">
        <div className="py-3 flex justify-between">
          <dt style={{ color: appColors.textDarkMuted }}>Amount</dt>
          <dd className={`font-semibold ${transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.type === 'DEPOSIT' ? '+' : '-'} Rp {Math.abs(transaction.amount).toLocaleString()}
          </dd>
        </div>
        
        <div className="py-3 flex justify-between">
          <dt style={{ color: appColors.textDarkMuted }}>Date</dt>
          <dd style={{ color: appColors.textDark }}>{new Date(transaction.createdAt).toLocaleString()}</dd>
        </div>
        
        <div className="py-3 flex justify-between">
          <dt style={{ color: appColors.textDarkMuted }}>Type</dt>
          <dd style={{ color: appColors.textDark }}>{transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}</dd>
        </div>
        
        {transaction.reference && (
          <div className="py-3 flex justify-between">
            <dt style={{ color: appColors.textDarkMuted }}>Reference ID</dt>
            <dd className="font-mono" style={{ color: appColors.textDark }}>{transaction.reference}</dd>
          </div>
        )}
        
        {transaction.paymentMethod && (
          <div className="py-3 flex justify-between">
            <dt style={{ color: appColors.textDarkMuted }}>Payment Method</dt>
            <dd style={{ color: appColors.textDark }}>{transaction.paymentMethod}</dd>
          </div>
        )}
        
        {transaction.campaignId && (
          <div className="py-3 flex justify-between">
            <dt style={{ color: appColors.textDarkMuted }}>Campaign ID</dt>
            <dd style={{ color: appColors.textDark }}>{transaction.campaignId}</dd>
          </div>
        )}
        
        {transaction.campaignName && (
          <div className="py-3 flex justify-between">
            <dt style={{ color: appColors.textDarkMuted }}>Campaign</dt>
            <dd style={{ color: appColors.textDark }}>{transaction.campaignName}</dd>
          </div>
        )}
      </dl>
      
      {/* Only show delete button for DEPOSIT transactions */}
      {transaction.type === 'DEPOSIT' && transaction.status !== 'COMPLETED' && (
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={handleDeleteTransaction}
            disabled={isDeleting}
            className="w-full text-white py-2 px-4 rounded hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#D94A7B" }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Transaction'}
          </button>
        </div>
      )}
    </div>
  );
}