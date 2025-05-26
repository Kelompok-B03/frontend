import axios from 'axios';

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:8080/api/admin';

export interface AnnouncementDTO {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export const getPublicAnnouncements = async (): Promise<AnnouncementDTO[] | { content: AnnouncementDTO[] }> => {
  try {
    // Make the call to your backend endpoint
    const response = await axios.get(`${ADMIN_API_URL}/announcements/list`);
    
    console.log('Announcements API response:', response.data); // Debug log
    
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};