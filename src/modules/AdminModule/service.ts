import axios from 'axios';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:8080/api/admin';

const authHeader = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return {};
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    
    if (Date.now() >= expiry) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login?expired=true';
      return {};
    }
  } catch (error) {
    console.error('Error parsing token:', error);
    localStorage.removeItem('token');
    return {};
  }
  
  return { Authorization: `Bearer ${token}` };
};

export interface AdminStatistics {
  totalUsers: number;
  totalCampaigns: number;
  totalDonations: number;
  pendingCampaigns: number;
  totalAmount: number;
}

export const getAdminStatistics = async (): Promise<AdminStatistics> => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/dashboard/statistics`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    throw error;
  }
};


export const approveCampaign = async (campaignId: string) => {
  try {
    const response = await axios.post(
      `${ADMIN_API_URL}/campaigns/${campaignId}/approve`,
      {},
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving campaign:', error);
    throw error;
  }
};

export const rejectCampaign = async (campaignId: string, reason: string) => {
  try {
    const response = await axios.post(
      `${ADMIN_API_URL}/campaigns/${campaignId}/reject`,
      { reason },
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting campaign:', error);
    throw error;
  }
};

export const getUserList = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/users?page=${page}&size=${size}`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user list:', error);
    throw error;
  }
};


export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: string; 
}

export const getAnnouncements = async (page = 0, size = 5) => {
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/announcements/list?page=${page}&size=${size}`,
      { headers: authHeader() }
    );
    
    const announcements = Array.isArray(response.data) 
      ? response.data 
      : (response.data.content || []);
      
    return { content: announcements };
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

export const createAnnouncement = async (announcementData: { title: string; content: string }) => {
  try {
    const response = await axios.post(
      `${ADMIN_API_URL}/announcements/create`,
      announcementData,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string) => {
  try {
    const response = await axios.delete(
      `${ADMIN_API_URL}/announcements/${id}`,
      { headers: authHeader() }
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  phoneNumber: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
  walletId: number;
  active: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  role: string;
  status: string;
}

export const getUserDetails = async (userId: string) => {
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/users/${userId}`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const blockUser = async (userId: string, reason: string) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/users/${userId}/block?reason=${encodeURIComponent(reason)}`,
      {},
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

export const unblockUser = async (userId: string) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/users/${userId}/unblock`,
      {},
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};

export interface CampaignDTO {
  campaignId: string;
  title: string;
  description: string;
  fundraiserId: string;
  fundraiserName: string;
  targetAmount: number;
  fundsCollected: number;
  startDate: string;
  endDate: string | null;
  status: string;
  withdrawed: boolean;
  usageProofLink: string | null;
  createdAt?: string; // Mark as optional with ?
  updatedAt?: string; // Mark as optional with ?
  imageUrl?: string | null;
}

export interface FundUsageProofDTO {
  id: string;
  description: string;
  imageUrl: string;
  createdAt?: string; // Mark as optional with ?
}

export interface CampaignDetailResponse {
  campaign: CampaignDTO;
  proofs: FundUsageProofDTO[];
}

// Add these service functions to fetch campaigns
export const getCampaigns = async () => {
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/campaigns`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const getCampaignDetails = async (campaignId: string) => {
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/campaigns/${campaignId}`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign details:', error);
    throw error;
  }
};

export const rejectCampaignAndBlockUser = async (
  campaignId: string, 
  rejectionReason: string,
  blockReason: string
) => {
  try {
    const response = await axios.post(
      `${ADMIN_API_URL}/campaigns/${campaignId}/reject-with-block`,
      null,
      { 
        headers: authHeader(),
        params: { rejectionReason, blockReason }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting campaign and blocking user:', error);
    throw error;
  }
};