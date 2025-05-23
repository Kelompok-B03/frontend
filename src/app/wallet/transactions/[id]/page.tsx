"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTransactionById, deleteTransaction } from '@/services/walletService';

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

export default function TransactionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/wallet/transactions/${id}`);
      return;
    }

    if (user?.id && id) {
      const fetchTransactionDetails = async () => {
        setLoading(true);
        try {
          const data = await getTransactionById(user.id, id as string);
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
  }, [id, user, isAuthenticated, authLoading, router]);

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

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Link href="/wallet/transactions" className="text-blue-600">
            &larr; Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-yellow-50 text-yellow-600 p-4 rounded">
          Transaction not found
        </div>
        <div className="mt-4">
          <Link href="/wallet/transactions" className="text-blue-600">
            &larr; Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/wallet/transactions" className="text-blue-600 mr-2">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold">Transaction Details</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-lg font-medium">{transaction.description}</h2>
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
            <dt className="text-gray-600">Amount</dt>
            <dd className={`font-semibold ${transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'DEPOSIT' ? '+' : '-'} Rp {Math.abs(transaction.amount).toLocaleString()}
            </dd>
          </div>
          
          <div className="py-3 flex justify-between">
            <dt className="text-gray-600">Date</dt>
            <dd>{new Date(transaction.createdAt).toLocaleString()}</dd>
          </div>
          
          <div className="py-3 flex justify-between">
            <dt className="text-gray-600">Type</dt>
            <dd>{transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}</dd>
          </div>
          
          {transaction.reference && (
            <div className="py-3 flex justify-between">
              <dt className="text-gray-600">Reference ID</dt>
              <dd className="font-mono">{transaction.reference}</dd>
            </div>
          )}
          
          {transaction.paymentMethod && (
            <div className="py-3 flex justify-between">
              <dt className="text-gray-600">Payment Method</dt>
              <dd>{transaction.paymentMethod}</dd>
            </div>
          )}
          
          {transaction.campaignId && (
            <div className="py-3 flex justify-between">
              <dt className="text-gray-600">Campaign ID</dt>
              <dd>{transaction.campaignId}</dd>
            </div>
          )}
          
          {transaction.campaignName && (
            <div className="py-3 flex justify-between">
              <dt className="text-gray-600">Campaign</dt>
              <dd>{transaction.campaignName}</dd>
            </div>
          )}
        </dl>
        
        {/* Only show delete button for DEPOSIT transactions */}
        {transaction.type === 'DEPOSIT' && transaction.status !== 'COMPLETED' && (
          <div className="mt-6 pt-4 border-t">
            <button
              onClick={handleDeleteTransaction}
              disabled={isDeleting}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Transaction'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}