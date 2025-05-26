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
  const [paymentPhone, setPaymentPhone] = useState<string>('');
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
    { value: 'GOPAY', label: 'GoPay', icon: '🟢' },
    { value: 'DANA', label: 'DANA', icon: '🔵' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseInt(amount) <= 0) {
      setError('Silakan masukkan jumlah yang valid');
      return;
    }
    
    if (!paymentMethod) {
      setError('Silakan pilih metode pembayaran');
      return;
    }

    if (!paymentPhone || !paymentPhone.match(/^08\d{8,11}$/)) {
      setError('Silakan masukkan nomor telepon yang valid (08xxxxxxxxx)');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (!user?.id) {
        throw new Error('User ID diperlukan');
      }
      
      await topUpWallet(user.id, parseInt(amount), paymentMethod, paymentPhone);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/wallet/balance');
      }, 1500);
    } catch (error: any) {
      console.error('Error processing top-up:', error);
      setError(error.response?.data?.message || 'Gagal memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">💳</span>
          <h2 className="text-xl font-bold" style={{ color: appColors.textDark }}>
            Top Up Saldo
          </h2>
        </div>
        <p className="text-sm mt-1" style={{ color: appColors.textDarkMuted }}>
          Tambahkan saldo ke wallet Anda untuk melakukan donasi
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>Top up berhasil! Mengalihkan ke wallet...</span>
            </div>
          </div>
        )}
        
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: appColors.textDark }}>
            💰 Pilih Jumlah
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {predefinedAmounts.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setAmount(option.value)}
                className={`py-3 px-4 text-sm font-medium rounded-xl border-2 transition-all duration-300 ${
                  amount === option.value
                    ? 'text-white shadow-md transform scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                style={{ 
                  backgroundColor: amount === option.value 
                    ? appColors.babyTurquoiseAccent 
                    : appColors.white,
                  borderColor: amount === option.value 
                    ? appColors.babyTurquoiseAccent 
                    : undefined,
                  color: amount === option.value 
                    ? appColors.white 
                    : appColors.textDark
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: appColors.textDark }}>
              Atau masukkan jumlah custom (Rp)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200"
              placeholder="Masukkan jumlah"
              min="1000"
              style={{ fontSize: '16px' }}
            />
          </div>
        </div>
        
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: appColors.textDark }}>
            💳 Metode Pembayaran
          </label>
          <div className="space-y-3">
            {paymentOptions.map((option) => (
              <div key={option.value} 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                  paymentMethod === option.value 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod(option.value)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={option.value}
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={option.value} className="ml-3 flex items-center space-x-2 cursor-pointer">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium" style={{ color: appColors.textDark }}>
                      {option.label}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: appColors.textDark }}>
            📱 Nomor Telepon untuk {paymentMethod || 'Pembayaran'}
          </label>
          <input
            type="tel"
            value={paymentPhone}
            onChange={(e) => setPaymentPhone(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200"
            placeholder="08xxxxxxxxx"
            pattern="^08\d{8,11}$"
            required
            style={{ fontSize: '16px' }}
          />
          <p className="text-xs mt-2" style={{ color: appColors.textDarkMuted }}>
            Masukkan nomor {paymentMethod || 'e-wallet'} Anda (dimulai dengan 08)
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:transform-none"
          style={{ backgroundColor: appColors.babyTurquoiseAccent }}
        >
          {isLoading ? '⏳ Memproses...' : '🚀 Lanjutkan ke Pembayaran'}
        </button>
      </form>
    </div>
  );
}