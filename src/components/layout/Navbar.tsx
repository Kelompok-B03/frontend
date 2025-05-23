'use client';

import React, { useState } from 'react';
import { MenuIcon, XIcon, GatherLoveIcon } from '@/components/common/Icons'; // Ensure this path is correct
import { appColors } from '@/constants/colors'; // Adjust path if necessary

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Updated navigation links
  const navLinks = [
    { href: '#home', label: 'Beranda' },
    { href: '#tentang', label: 'Tentang Kami' },
  ];

  // Handler for closing mobile menu on link click
  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Nama Brand */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center space-x-2">
              <GatherLoveIcon
                className="h-9 w-9"
              />
              <span
                className="font-bold text-2xl tracking-tight"
                style={{ color: appColors.babyTurquoiseAccent }}
              >
                GatherLove
              </span>
            </a>
          </div>

          {/* Link Navigasi Desktop & Login Button */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <div className="flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
                  style={{ color: appColors.textDark }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            {/* Desktop Log In Button */}
            <a
              href="/login" // Assuming a login page route
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-opacity duration-300 hover:opacity-90"
              style={{
                backgroundColor: appColors.babyTurquoiseAccent,
                color: appColors.white,
              }}
            >
              Log In
            </a>
          </div>

          {/* Tombol Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset"
              style={{
                color: appColors.textDark,
              }}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Buka menu utama</span>
              {isOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div
          className="md:hidden border-t"
          style={{ borderColor: appColors.lightGrayBg }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleMobileLinkClick}
                className="block px-3 py-2 rounded-md text-base font-medium hover:opacity-80"
                style={{ color: appColors.textDark }}
              >
                {link.label}
              </a>
            ))}
            {/* Mobile Log In Button/Link */}
            <a
              href="/login" // Assuming a login page route
              onClick={handleMobileLinkClick}
              className="block w-full mt-2 px-3 py-2 rounded-md text-base font-medium text-center shadow-sm transition-opacity duration-300 hover:opacity-90"
              style={{
                backgroundColor: appColors.babyTurquoiseAccent,
                color: appColors.white,
              }}
            >
              Log In
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;