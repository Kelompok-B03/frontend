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
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="flex p-1">
        <Link
          href="/wallet/balance"
          className={`flex-1 py-2 px-4 text-center rounded ${
            isActive("/wallet/balance")
              ? "text-white font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          style={{ 
            backgroundColor: isActive("/wallet/balance") 
              ? appColors.babyTurquoiseAccent 
              : "transparent"
          }}
        >
          Balance
        </Link>
        <Link
          href="/wallet/topup"
          className={`flex-1 py-2 px-4 text-center rounded ${
            isActive("/wallet/topup")
              ? "text-white font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          style={{ 
            backgroundColor: isActive("/wallet/topup") 
              ? appColors.babyTurquoiseAccent 
              : "transparent"
          }}
        >
          Top Up
        </Link>
        <Link
          href="/wallet/transactions"
          className={`flex-1 py-2 px-4 text-center rounded ${
            isActive("/wallet/transactions")
              ? "text-white font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          style={{ 
            backgroundColor: isActive("/wallet/transactions") 
              ? appColors.babyTurquoiseAccent 
              : "transparent"
          }}
        >
          Transactions
        </Link>
      </div>
    </div>
  );
}