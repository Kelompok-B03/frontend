'use client';

import React, { useEffect, useState } from 'react';
import DonationCard from './DonationCard';
import { appColors } from '@/constants/colors';
import backendAxiosInstance from '@/utils/backendAxiosInstance'; // Pastikan path ini benar

type Donation = {
  donationId: string;
  stateName: string;
  createdAt: string;
  message: string;
  amount: number;
};

const DonationPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await backendAxiosInstance.get('/api/donations/self');
        setDonations(response.data);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setError('Gagal mengambil data donasi. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen px-4 py-6" style={{ backgroundColor: appColors.white }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: appColors.textDarkMuted }}>Your Donations</h1>
      {loading ? (
        <p style={{ color: appColors.textDarkMuted }}>Loading donations...</p>
      ) : error ? (
        <p style={{ color: appColors.errorRedText }}>{error}</p>
      ) : donations.length === 0 ? (
        <p style={{ color: appColors.textDarkMuted }}>You haven’t made any donations yet.</p>
      ) : (
        <div>
          {donations.map((donation) => (
            <DonationCard
              key={donation.donationId}
              stateName={donation.stateName}
              createdAt={donation.createdAt}
              message={donation.message}
              amount={donation.amount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationPage;
