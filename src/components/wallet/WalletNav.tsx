"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appColors } from "@/constants/colors";

export default function WalletNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/wallet/balance") {
      return pathname === path;
    } else if (path === "/wallet/topup") {
      return pathname === path;
    } else if (path === "/wallet/transactions") {
      return pathname.includes(path);
    }
    return false;
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-1 shadow-sm">
        <div className="flex space-x-1">
          <Link
            href="/wallet/balance"
            className={`flex-1 py-3 px-6 text-center rounded-xl font-medium transition-all duration-300 ${
              isActive("/wallet/balance")
                ? "text-white shadow-md transform scale-105"
                : "hover:bg-white/50 transition-colors duration-200"
            }`}
            style={{ 
              backgroundColor: isActive("/wallet/balance") 
                ? appColors.babyTurquoiseAccent 
                : "transparent",
              color: isActive("/wallet/balance") ? appColors.white : appColors.textDark
            }}
          >
            💰 Balance
          </Link>
          <Link
            href="/wallet/topup"
            className={`flex-1 py-3 px-6 text-center rounded-xl font-medium transition-all duration-300 ${
              isActive("/wallet/topup")
                ? "text-white shadow-md transform scale-105"
                : "hover:bg-white/50 transition-colors duration-200"
            }`}
            style={{ 
              backgroundColor: isActive("/wallet/topup") 
                ? appColors.babyTurquoiseAccent 
                : "transparent",
              color: isActive("/wallet/topup") ? appColors.white : appColors.textDark
            }}
          >
            💳 Top Up
          </Link>
          <Link
            href="/wallet/transactions"
            className={`flex-1 py-3 px-6 text-center rounded-xl font-medium transition-all duration-300 ${
              isActive("/wallet/transactions")
                ? "text-white shadow-md transform scale-105"
                : "hover:bg-white/50 transition-colors duration-200"
            }`}
            style={{ 
              backgroundColor: isActive("/wallet/transactions") 
                ? appColors.babyTurquoiseAccent 
                : "transparent",
              color: isActive("/wallet/transactions") ? appColors.white : appColors.textDark
            }}
          >
            📋 Transactions
          </Link>
        </div>
      </div>
    </div>
  );
}