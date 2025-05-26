"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appColors } from "@/constants/colors";
import { HomeIcon, UserGroupIcon, DocumentTextIcon, ClockIcon, ChartBarIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import { GatherLoveIcon } from '@/components/common/Icons';

export default function AdminNav() {
  const pathname = usePathname();
  
  const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/users", label: "Users", icon: UserGroupIcon },
  { href: "/admin/campaigns", label: "Campaigns", icon: DocumentTextIcon },
  { href: "/admin/pending", label: "Pending Verification", icon: ClockIcon },
  { href: "/admin/announcements", label: "Announcements", icon: MegaphoneIcon },
  { href: "/admin/reports", label: "Reports", icon: ChartBarIcon },
];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <GatherLoveIcon className="h-8 w-8" />
          <div>
            <span className="font-bold text-xl" style={{ color: appColors.babyTurquoiseAccent }}>
              GatherLove
            </span>
            <span className="block text-xs" style={{ color: appColors.textDarkMuted }}>
              Admin Panel
            </span>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-md transition-colors ${
                  isActive(item.href) ? "text-white" : "hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: isActive(item.href) ? appColors.babyTurquoiseAccent : "transparent",
                  color: isActive(item.href) ? appColors.white : appColors.textDark,
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <Link
          href="/"
          className="flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors"
          style={{ color: appColors.textDarkMuted }}
        >
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  );
}