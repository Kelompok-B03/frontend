"use client";
import AdminModule from '@/modules/AdminModule';
import DashboardSection from '@/modules/AdminModule/sections/DashboardSection';

export default function AdminDashboardPage() {
  return (
    <AdminModule>
      <DashboardSection />
    </AdminModule>
  );
}