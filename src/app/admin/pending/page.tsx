"use client";
import { useEffect, useState } from 'react';
import { getPendingCampaigns, approveCampaign, rejectCampaign } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  createdAt: string;
  fundraiserName: string;
  fundraiserId: string;
  status: string;
}

interface PageInfo {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export default function PendingCampaignsSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    totalElements: 0,
    totalPages: 1,
    currentPage: 0,
    size: 10
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [campaignToReject, setCampaignToReject] = useState<string | null>(null);
  const [processingCampaignId, setProcessingCampaignId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingCampaigns();
  }, [pageInfo.currentPage]);

  const fetchPendingCampaigns = async () => {
    setLoading(true);
    try {
      const response = await getPendingCampaigns(pageInfo.currentPage, pageInfo.size);
      
      setCampaigns(response.content);
      setPageInfo({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number,
        size: response.size
      });
    } catch (err) {
      console.error("Failed to fetch pending campaigns:", err);
      setError('Failed to load pending campaigns. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= pageInfo.totalPages) return;
    setPageInfo(prev => ({ ...prev, currentPage: page }));
  };

  const handleApprove = async (campaignId: string) => {
    setProcessingCampaignId(campaignId);
    try {
      await approveCampaign(campaignId);
      // Remove the approved campaign from the list
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
      // Update the total count
      setPageInfo(prev => ({ ...prev, totalElements: prev.totalElements - 1 }));
    } catch (err) {
      console.error("Failed to approve campaign:", err);
      alert('Failed to approve campaign. Please try again.');
    } finally {
      setProcessingCampaignId(null);
    }
  };

  const openRejectModal = (campaignId: string) => {
    setCampaignToReject(campaignId);
    setRejectionReason('');
  };

  const handleReject = async () => {
    if (!campaignToReject || !rejectionReason.trim()) return;
    
    setProcessingCampaignId(campaignToReject);
    try {
      await rejectCampaign(campaignToReject, rejectionReason);
      // Remove the rejected campaign from the list
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignToReject));
      // Update the total count
      setPageInfo(prev => ({ ...prev, totalElements: prev.totalElements - 1 }));
      // Close the modal
      setCampaignToReject(null);
    } catch (err) {
      console.error("Failed to reject campaign:", err);
      alert('Failed to reject campaign. Please try again.');
    } finally {
      setProcessingCampaignId(null);
    }
  };

  if (loading && campaigns.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading campaigns...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}
        <button 
          onClick={() => fetchPendingCampaigns()} 
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>Pending Campaigns</h1>
        <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
          Review and verify campaigns before they go live.
        </p>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-lg" style={{ color: appColors.textDarkMuted }}>
            No pending campaigns to verify.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fundraiser</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium" style={{ color: appColors.textDark }}>{campaign.title}</div>
                    <div className="text-xs" style={{ color: appColors.textDarkMuted }}>ID: {campaign.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: appColors.textDark }}>{campaign.fundraiserName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: appColors.textDark }}>Rp {campaign.goal.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: appColors.textDarkMuted }}>
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleApprove(campaign.id)}
                      disabled={processingCampaignId === campaign.id}
                      className="text-green-600 hover:text-green-900 mx-2 disabled:opacity-50"
                    >
                      <CheckCircleIcon className="h-6 w-6 inline" /> Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(campaign.id)}
                      disabled={processingCampaignId === campaign.id}
                      className="text-red-600 hover:text-red-900 mx-2 disabled:opacity-50"
                    >
                      <XCircleIcon className="h-6 w-6 inline" /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {pageInfo.totalPages > 1 && (
            <div className="px-6 py-4 flex justify-center border-t">
              <nav className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pageInfo.currentPage - 1)}
                  disabled={pageInfo.currentPage === 0}
                  className="px-3 py-1 rounded text-sm border disabled:opacity-50"
                  style={{
                    borderColor: appColors.lightGrayBg,
                    color: appColors.textDarkMuted
                  }}
                >
                  Previous
                </button>
                
                {Array.from({ length: pageInfo.totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx)}
                    className={`px-3 py-1 rounded text-sm ${
                      pageInfo.currentPage === idx ? 'text-white' : 'border'
                    }`}
                    style={{ 
                      backgroundColor: pageInfo.currentPage === idx 
                        ? appColors.babyTurquoiseAccent 
                        : 'transparent',
                      borderColor: pageInfo.currentPage === idx 
                        ? appColors.babyTurquoiseAccent 
                        : appColors.lightGrayBg,
                    }}
                  >
                    {idx + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pageInfo.currentPage + 1)}
                  disabled={pageInfo.currentPage === pageInfo.totalPages - 1}
                  className="px-3 py-1 rounded text-sm border disabled:opacity-50"
                  style={{
                    borderColor: appColors.lightGrayBg,
                    color: appColors.textDarkMuted
                  }}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Rejection Modal */}
      {campaignToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4" style={{ color: appColors.textDark }}>Reject Campaign</h3>
            <p className="mb-4 text-sm" style={{ color: appColors.textDarkMuted }}>
              Please provide a reason for rejection. This will be sent to the fundraiser.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-2 border rounded mb-4"
              rows={4}
              style={{ borderColor: appColors.lightGrayBg }}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setCampaignToReject(null)}
                className="px-4 py-2 border rounded"
                style={{
                  borderColor: appColors.lightGrayBg,
                  color: appColors.textDark
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || processingCampaignId === campaignToReject}
                className="px-4 py-2 rounded text-white disabled:opacity-50"
                style={{ backgroundColor: appColors.babyPinkAccent }}
              >
                {processingCampaignId === campaignToReject ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}