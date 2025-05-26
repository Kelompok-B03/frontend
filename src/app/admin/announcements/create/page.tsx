"use client";
import AdminModule from '@/modules/AdminModule';
import AnnouncementCreateSection from '@/modules/AdminModule/sections/AnnouncementCreateSection';

export default function CreateAnnouncementPage() {
  return (
    <AdminModule>
      <AnnouncementCreateSection />
    </AdminModule>
  );
}