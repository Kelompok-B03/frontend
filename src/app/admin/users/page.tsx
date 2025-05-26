"use client";
import AdminModule from '@/modules/AdminModule';
import UsersSection from '@/modules/AdminModule/sections/UsersSection';

export default function UsersPage() {
  return (
    <AdminModule>
      <UsersSection />
    </AdminModule>
  );
}