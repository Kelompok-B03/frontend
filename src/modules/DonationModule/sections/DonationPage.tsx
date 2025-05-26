'use client';

import React, { useEffect, useState } from 'react';
import DonationCard from './DonationCard';
import { appColors } from '@/constants/colors';

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
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8080/api/donations/self', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
          setDonations(data);
        } catch (error) {
          console.error('Error fetching donations:', error);
          setError('Failed to connect to the server. Please try again later.');
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
