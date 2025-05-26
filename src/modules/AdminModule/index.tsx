"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

interface AdminModuleProps {
  children: React.ReactNode;
}

const ROLES = {
  ADMIN: 'ADMIN',
};

const AdminModule: React.FC<AdminModuleProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const isAdmin = user?.roles?.includes(ROLES.ADMIN);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(`/auth/login?redirect=${pathname}`);
      } else if (!isAdmin) {
        router.push('/'); // Redirect non-admins to home page
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect from the useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminModule;