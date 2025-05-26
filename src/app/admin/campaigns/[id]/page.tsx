"use client";
import { useParams } from 'next/navigation';
import AdminModule from '@/modules/AdminModule';
import CampaignDetailSection from '@/modules/AdminModule/sections/CampaignDetailSection';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  return (
    <AdminModule>
      <CampaignDetailSection campaignId={campaignId} />
    </AdminModule>
  );
}