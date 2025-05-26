"use client";
import { useParams } from 'next/navigation';
import AdminModule from '@/modules/AdminModule';
import UserDetailsSection from '@/modules/AdminModule/sections/UserDetailsSection';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  
  return (
    <AdminModule>
      <UserDetailsSection userId={userId} />
    </AdminModule>
  );
}