import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';
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

export const getPendingCampaigns = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/campaigns/pending?page=${page}&size=${size}`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching pending campaigns:', error);
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
  updatedAt: string;
}

export const getAnnouncements = async (page = 0, size = 5) => {
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/announcements/list`,
      { headers: authHeader() }
    );
    return response.data;
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