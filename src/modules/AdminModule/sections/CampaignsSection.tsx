"use client";
import { useState, useEffect } from 'react';
import { getCampaigns, CampaignDTO } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import { EyeIcon, ArrowTrendingUpIcon, CheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CampaignsSection() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<{
    activeCampaigns: CampaignDTO[];
    completedCampaigns: CampaignDTO[];
  }>({ activeCampaigns: [], completedCampaigns: [] });
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getCampaigns();
      setCampaigns({
        activeCampaigns: data.activeCampaigns || [],
        completedCampaigns: data.completedCampaigns || []
      });
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setError('Failed to load campaigns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (campaignId: string) => {
    router.push(`/admin/campaigns/${campaignId}`);
  };

  const getProgressPercentage = (targetAmount: number, fundsCollected: number) => {
    if (targetAmount <= 0) return 0;
    const percentage = (fundsCollected / targetAmount) * 100;
    return Math.min(percentage, 100);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading campaigns...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}
        <button 
          onClick={() => fetchCampaigns()} 
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayedCampaigns = activeTab === 'active' 
    ? campaigns.activeCampaigns 
    : campaigns.completedCampaigns;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>Campaigns</h1>
        <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
          Monitor all fundraising campaigns on the platform.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'active' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Campaigns ({campaigns.activeCampaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'completed' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed Campaigns ({campaigns.completedCampaigns.length})
          </button>
        </div>

        {displayedCampaigns.length === 0 ? (
          <div className="p-8 text-center">
            <p style={{ color: appColors.textDarkMuted }}>No {activeTab} campaigns found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Campaign</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Fundraiser</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Goal / Raised</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedCampaigns.map((campaign) => (
                  <tr key={campaign.campaignId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16 rounded bg-gray-100 overflow-hidden">
                          {campaign.imageUrl ? (
                            <Image src={campaign.imageUrl} alt={campaign.title} width={80} height={60} className="object-cover h-full w-full" unoptimized />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full">
                              <ArrowTrendingUpIcon className="h-6 w-6" style={{ color: appColors.textDarkMuted }} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium" style={{ color: appColors.textDark }}>{campaign.title}</div>
                          <div className="text-xs" style={{ color: appColors.textDarkMuted }}>
                            Created: {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: appColors.textDark }}>{campaign.fundraiserName}</div>
                      <div className="text-xs" style={{ color: appColors.textDarkMuted }}>ID: {campaign.fundraiserId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: appColors.textDark }}>
                        Rp {campaign.fundsCollected?.toLocaleString() || '0'} / Rp {campaign.targetAmount?.toLocaleString() || '0'}
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${getProgressPercentage(campaign.targetAmount || 0, campaign.fundsCollected || 0)}%`,
                            backgroundColor: appColors.babyTurquoiseAccent
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activeTab === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {activeTab === 'completed' ? (
                          <>
                            <CheckIcon className="h-4 w-4 mr-1" /> Completed
                          </>
                        ) : campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(campaign.campaignId)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-5 w-5 inline mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}