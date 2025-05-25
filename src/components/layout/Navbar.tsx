'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuIcon, XIcon, GatherLoveIcon } from '@/components/common/Icons';
import { appColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const staticNavLinks = [
    { href: '/#home', label: 'Beranda' },
    { href: '/#tentang', label: 'Tentang Kami' },
  ];

  // Dynamic links based on auth state
  let authNavLinks: { href: string; label: string; isButton?: boolean; isPrimaryButton?: boolean; onClick?: () => void }[] = [];
  let userSpecificLinks: { href: string; label: string; isButton?: boolean; isPrimaryButton?: boolean; onClick?: () => void }[] = [];


  const handleLogout = async () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  if (!isLoading) {
    if (isAuthenticated && user) {
      userSpecificLinks = [
        { href: '/wallet', label: 'Wallet' },
      ];
      authNavLinks = [
        { href: '/', label: `Log Out`, onClick: handleLogout, isButton: true, isPrimaryButton: false },
      ];
    } else {
      authNavLinks = [
        { href: '/auth/login', label: 'Log In', isButton: true, isPrimaryButton: true },
        { href: '/auth/register', label: 'Sign Up', isButton: true, isPrimaryButton: false },
      ];
    }
  }
  
  const allNavLinks = [...staticNavLinks, ...userSpecificLinks];


  type NavLink = {
    href: string;
    label: string;
    isButton?: boolean;
    isPrimaryButton?: boolean;
    onClick?: () => void;
  };

  const renderNavLink = (link: NavLink, isMobile = false) => {
    const commonLinkClasses = `text-sm font-medium transition-colors duration-300 hover:opacity-80`;
    const mobileLinkClasses = `block px-3 py-2 rounded-md text-base font-medium hover:opacity-80`;

    const buttonBaseClasses = `px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-opacity duration-300 hover:opacity-90`;
    const mobileButtonBaseClasses = `block w-full mt-2 px-3 py-2 rounded-md text-base font-medium text-center shadow-sm transition-opacity duration-300 hover:opacity-90`;

    let style = {};
    if (link.isButton) {
      if (link.isPrimaryButton) {
        style = { backgroundColor: appColors.babyTurquoiseAccent, color: appColors.white };
      } else {
        style = {
          backgroundColor: appColors.white,
          color: appColors.babyPinkAccent,
          borderColor: appColors.babyPinkAccent,
          borderWidth: '1px',
        };
      }
    } else {
      style = { color: appColors.textDark };
    }

    if (link.onClick) {
      return (
        <button
          key={link.label}
          onClick={() => {
            if (link.onClick) link.onClick();
            if (isMobile) setIsOpen(false);
          }}
          className={`${isMobile ? mobileButtonBaseClasses : buttonBaseClasses} ${isMobile && !link.isPrimaryButton ? 'mt-1' : ''}`}
          style={style}
        >
          {link.label}
        </button>
      );
    }

    return (
      <Link legacyBehavior href={link.href} key={link.label}>
        <a
          onClick={() => {if (isMobile) setIsOpen(false);}}
          className={link.isButton ? (isMobile ? mobileButtonBaseClasses : buttonBaseClasses) : (isMobile ? mobileLinkClasses : commonLinkClasses)}
          style={style}
        >
          {link.label}
        </a>
      </Link>
    );
  };


  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link legacyBehavior href="/">
              <a className="flex items-center space-x-2">
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
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4"> {/* Reduced space-x for more items */}
            {allNavLinks.map((link) => renderNavLink(link, false))}
            
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-md"></div> // Placeholder for auth buttons
            ) : (
              authNavLinks.map((link) => (
                <div key={link.label} className="ml-2">{renderNavLink(link, false)}</div>
              ))
            )}
             {isAuthenticated && user && (
                <span className="ml-4 text-sm" style={{ color: appColors.textDarkMuted }}>
                  Hi, {user.name}!
                </span>
              )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset"
              style={{ color: appColors.textDark }}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden border-t"
          style={{ borderColor: appColors.lightGrayBg }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {allNavLinks.map((link) => renderNavLink(link, true))}
            
            <div className="mt-2 pt-2 border-t" style={{borderColor: appColors.lightGrayBg}}>
              {isLoading ? (
                 <div className="block w-full text-left px-3 py-2">
                    <div className="w-24 h-6 bg-gray-200 animate-pulse rounded-md mx-auto"></div>
                 </div>
              ) : (
                authNavLinks.map((link) => renderNavLink(link, true))
              )}
            </div>
            {isAuthenticated && user && (
                <div className="px-3 py-2 text-base font-medium" style={{ color: appColors.textDarkMuted }}>
                  Hi, {user.name}!
                </div>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;