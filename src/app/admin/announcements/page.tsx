"use client";
import AdminModule from '@/modules/AdminModule';
import AnnouncementsSection from '@/modules/AdminModule/sections/AnnouncementsSection';

export default function AnnouncementsPage() {
  return (
    <AdminModule>
      <AnnouncementsSection />
    </AdminModule>
  );
}