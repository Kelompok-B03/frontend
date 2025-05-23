"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { topUpWallet } from '@/services/walletService';

export default function TopUpPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/login?redirect=/wallet/top-up');
    return null;
  }

  const predefinedAmounts = [
    { value: '50000', label: 'Rp 50,000' },
    { value: '100000', label: 'Rp 100,000' },
    { value: '250000', label: 'Rp 250,000' },
    { value: '500000', label: 'Rp 500,000' },
    { value: '1000000', label: 'Rp 1,000,000' },
  ];

  const paymentOptions = [
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'E_WALLET', label: 'E-Wallet' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseInt(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      
      await topUpWallet(user.id, parseInt(amount), paymentMethod);
      
      setSuccess(true);
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/wallet/balance');
      }, 2000);
    } catch (error: any) {
      console.error('Error processing top-up:', error);
      setError(error.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/wallet/balance" className="text-blue-600 mr-2">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold">Top Up Wallet</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
          Top up successful! Redirecting to wallet...
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {predefinedAmounts.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setAmount(option.value)}
                className={`py-2 px-3 text-sm rounded border ${
                  amount === option.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Or enter custom amount (Rp)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter amount"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="space-y-2">
            {paymentOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name="paymentMethod"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={() => setPaymentMethod(option.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor={option.value} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
}