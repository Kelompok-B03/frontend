import React from 'react';
import { GatherLoveIcon } from '@/components/common/Icons';
import { appColors } from '@/constants/colors';

const Footer = () => {
  return (
    <footer
      className="py-12 border-t"
      style={{
        backgroundColor: appColors.white,
        borderColor: appColors.babyTurquoiseAccent,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 flex justify-center">
          <a href="#home" className="flex items-center space-x-2">
            <GatherLoveIcon
              className="h-10 w-10"
            />
            <span
              className="font-bold text-xl"
              style={{ color: appColors.babyTurquoiseAccent }}
            >
              GatherLove
            </span>
          </a>
        </div>
        <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
          &copy; {new Date().getFullYear()} GatherLove. Hak Cipta Dilindungi.
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: appColors.textDarkMuted, opacity: 0.8 }}
        >
          Platform Donasi Pilihan Anda untuk Kebaikan Bersama
        </p>
        <div className="mt-6 space-x-6">
          <a
            href="#"
            className="text-xs hover:opacity-80 transition-opacity"
            style={{ color: appColors.textDarkMuted }}
          >
            Kebijakan Privasi
          </a>
          <a
            href="#"
            className="text-xs hover:opacity-80 transition-opacity"
            style={{ color: appColors.textDarkMuted }}
          >
            Syarat & Ketentuan
          </a>
          <a
            href="#"
            className="text-xs hover:opacity-80 transition-opacity"
            style={{ color: appColors.textDarkMuted }}
          >
            Bantuan
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;