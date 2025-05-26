"use client";
import AdminModule from '@/modules/AdminModule';
import PendingCampaignsSection from '@/modules/AdminModule/sections/PendingCampaignsSection';

export default function PendingCampaignsPage() {
  return (
    <AdminModule>
      <PendingCampaignsSection />
    </AdminModule>
  );
}