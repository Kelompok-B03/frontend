"use client";
import AdminModule from '@/modules/AdminModule';
import CampaignsSection from '@/modules/AdminModule/sections/CampaignsSection';

export default function CampaignsPage() {
  return (
    <AdminModule>
      <CampaignsSection />
    </AdminModule>
  );
}