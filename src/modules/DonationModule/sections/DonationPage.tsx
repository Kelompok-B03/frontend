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
            Authentication: `Bearer ${token}`
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
    <div className="min-h-screen bg-white px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Donations</h1>
      {loading ? (
        <p className="text-gray-500">Loading donations...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : donations.length === 0 ? (
        <p className="text-gray-500">You haven’t made any donations yet.</p>
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
