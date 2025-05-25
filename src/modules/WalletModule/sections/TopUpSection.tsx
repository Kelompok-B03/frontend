"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { topUpWallet } from '@/modules/WalletModule/service'; 
import { appColors } from '@/constants/colors';

export default function TopUpSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

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
      }, 1500);
    } catch (error: unknown) {
      console.error('Error processing top-up:', error);
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof (error.response.data as { message: unknown }).message === 'string'
      ) {
        setError((error.response.data as { message: string }).message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during top-up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
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
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: appColors.textDark }}>
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
                  ? 'text-white'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              style={{ 
                backgroundColor: amount === option.value 
                  ? appColors.babyTurquoiseAccent 
                  : 'transparent'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: appColors.textDark }}>
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
        <label className="block text-sm font-medium mb-2" style={{ color: appColors.textDark }}>
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
              <label htmlFor={option.value} className="ml-2 text-sm" style={{ color: appColors.textDark }}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || success}
        className="w-full text-white py-2 px-4 rounded hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: appColors.babyTurquoiseAccent }}
      >
        {isLoading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  );
}