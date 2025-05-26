"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCampaignDetails, CampaignDTO, FundUsageProofDTO } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import { ArrowLeftIcon, UserCircleIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface CampaignDetailSectionProps {
  campaignId: string;
}

export default function CampaignDetailSection({ campaignId }: CampaignDetailSectionProps) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<CampaignDTO | null>(null);
  const [proofs, setProofs] = useState<FundUsageProofDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchCampaignDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCampaignDetails(campaignId);
      setCampaign(data.campaign);
      setProofs(data.proofs || []);
    } catch (err) {
      console.error('Failed to fetch campaign details:', err);
      setError('Failed to load campaign details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails();
    }
  }, [campaignId, fetchCampaignDetails]);

  const getProgressPercentage = (targetAmount: number, fundsCollected: number) => {
    if (targetAmount <= 0) return 0;
    const percentage = (fundsCollected / targetAmount) * 100;
    return Math.min(percentage, 100);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading campaign details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}
        <button 
          onClick={() => fetchCampaignDetails()} 
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded">
        Campaign not found.
      </div>
    );
  }

  return (
    <div>
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-sm font-medium mb-6"
        style={{ color: appColors.babyTurquoiseAccent }}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to Campaigns
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>
          Campaign Details
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Campaign Header */}
        <div className="relative h-48 bg-gray-200">
          {campaign.imageUrl ? (
            <Image 
              src={campaign.imageUrl} 
              alt={campaign.title} 
              fill 
              className="object-cover" 
              unoptimized 
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <span className="text-gray-400">No Image Available</span>
            </div>
          )}
        </div>

        {/* Campaign Info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: appColors.textDark }}>
            {campaign.title}
          </h2>
          
          <div className="flex items-center mb-4">
            <span className="px-2 py-1 text-xs font-semibold rounded-full" style={{
              backgroundColor: campaign.status === 'COMPLETED' ? '#D1FAE5' : '#DBEAFE',
              color: campaign.status === 'COMPLETED' ? '#065F46' : '#1E40AF'
            }}>
              {campaign.status}
            </span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="flex items-center text-sm" style={{ color: appColors.textDarkMuted }}>
              <ClockIcon className="h-4 w-4 mr-1" />
              Created on {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          
          <div className="mt-6 mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium" style={{ color: appColors.textDark }}>
                Rp {campaign.fundsCollected?.toLocaleString() || '0'} raised
                </span>
                <span className="text-sm" style={{ color: appColors.textDarkMuted }}>
                {getProgressPercentage(campaign.targetAmount || 0, campaign.fundsCollected || 0).toFixed(0)}% of Rp {campaign.targetAmount?.toLocaleString() || '0'}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                className="h-2.5 rounded-full" 
                style={{ 
                    width: `${getProgressPercentage(campaign.targetAmount || 0, campaign.fundsCollected || 0)}%`,
                    backgroundColor: appColors.babyTurquoiseAccent
                }}
                ></div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2" style={{ color: appColors.textDark }}>
              Fundraiser Information
            </h3>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <UserCircleIcon className="h-8 w-8" style={{ color: appColors.textDarkMuted }} />
              </div>
              <div>
                <div className="font-medium" style={{ color: appColors.textDark }}>
                  {campaign.fundraiserName}
                </div>
                <div className="text-sm" style={{ color: appColors.textDarkMuted }}>
                  ID: {campaign.fundraiserId}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2" style={{ color: appColors.textDark }}>
              Campaign Description
            </h3>
            <p className="text-sm whitespace-pre-line" style={{ color: appColors.textDark }}>
              {campaign.description}
            </p>
          </div>
          
          {/* Campaign Fund Usage Proofs */}
          {proofs.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: appColors.textDark }}>
                Fund Usage Proof
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proofs.map((proof) => (
                  <div key={proof.id} className="border rounded-lg overflow-hidden">
                    <div className="h-48 relative">
                      {proof.imageUrl ? (
                        <Image 
                          src={proof.imageUrl} 
                          alt={proof.description} 
                          fill 
                          className="object-cover" 
                          unoptimized 
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-100">
                          <CurrencyDollarIcon className="h-12 w-12" style={{ color: appColors.textDarkMuted }} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm" style={{ color: appColors.textDark }}>
                        {proof.description}
                      </p>
                      <p className="text-xs mt-2" style={{ color: appColors.textDarkMuted }}>
                        {/* Added null check to fix build error */}
                        Added: {proof.createdAt ? new Date(proof.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}