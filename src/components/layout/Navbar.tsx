'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuIcon, XIcon, GatherLoveIcon } from '@/components/common/Icons';
import { appColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext'; 

// For better maintainability, define role constants
const ROLES = {
  DONOR: 'DONOR',
  FUNDRAISER: 'FUNDRAISER',
  ADMIN: 'ADMIN',
};

type NavLinkItem = {
  href: string;
  label: string;
  isButton?: boolean;
  isPrimaryButton?: boolean;
  onClick?: () => void;
  roles?: string[];
  hideWhenLoading?: boolean;
};


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  const baseNavLinks: NavLinkItem[] = [
    { href: '/#home', label: 'Beranda' },
    { href: '/campaigns', label: 'Kampanye' },
    { href: '/announcements', label: 'Pengumuman' },
  ];

  const dynamicUserLinks: NavLinkItem[] = [];
  let authActionLinks: NavLinkItem[] = [];

  if (!isLoading) {
    if (isAuthenticated && user) {
      // Links for all authenticated users
      dynamicUserLinks.push(
        { href: '/profile', label: 'Akun saya' },
        { href: '/wallet/balance', label: 'Dompet Saya' }
      );

      // Role-specific links
      if (user.roles.includes(ROLES.DONOR)) {
        dynamicUserLinks.push({ href: '/my-donations', label: 'Donasi Saya' });
      }
      if (user.roles.includes(ROLES.FUNDRAISER)) {
        dynamicUserLinks.push({ href: '/my-campaigns', label: 'Kampanye Saya' });
      }
      if (user.roles.includes(ROLES.ADMIN)) {
        dynamicUserLinks.push({ href: '/admin/dashboard', label: 'Dasbor Admin' });
      }

      authActionLinks = [
        { href: '#', label: `Log Out`, onClick: handleLogout, isButton: true, isPrimaryButton: false, hideWhenLoading: true },
      ];
    } else {
      // Links for guests (not authenticated)
      authActionLinks = [
        { href: '/auth/login', label: 'Log In', isButton: true, isPrimaryButton: true, hideWhenLoading: true },
        { href: '/auth/register', label: 'Sign Up', isButton: true, isPrimaryButton: false, hideWhenLoading: true },
      ];
    }
  }
  
  const combinedNavLinks = [...baseNavLinks, ...dynamicUserLinks];

  const renderNavLink = (link: NavLinkItem, isMobile = false) => {
    const commonLinkClasses = `text-sm font-medium transition-colors duration-300 hover:opacity-80`;
    const mobileLinkClasses = `block px-3 py-2 rounded-md text-base font-medium hover:opacity-80`;
    
    const buttonBaseClasses = `px-3 sm:px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-opacity duration-300 hover:opacity-90 whitespace-nowrap`;
    const mobileButtonBaseClasses = `block w-full mt-2 px-3 py-2 rounded-md text-base font-medium text-center shadow-sm transition-opacity duration-300 hover:opacity-90`;

    let style: React.CSSProperties = {};
    if (link.isButton) {
      if (link.isPrimaryButton) {
        style = { backgroundColor: appColors.babyTurquoiseAccent, color: appColors.white };
      } else {
        style = {
          backgroundColor: appColors.white,
          color: appColors.babyPinkAccent,
          borderColor: appColors.babyPinkAccent,
          borderWidth: '1px',
          borderStyle: 'solid',
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
          className={`${isMobile ? mobileButtonBaseClasses : buttonBaseClasses} ${isMobile && !link.isPrimaryButton && link.isButton ? 'mt-1' : ''}`}
          style={style}
        >
          {link.label}
        </button>
      );
    }

    return (
      <Link legacyBehavior href={link.href || '#'} key={link.label}>
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
                  className="h-8 w-8 sm:h-9 sm:w-9"
                />
                <span
                  className="font-bold text-xl sm:text-2xl tracking-tight"
                  style={{ color: appColors.babyTurquoiseAccent }}
                >
                  GatherLove
                </span>
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:ml-6">
            <div className="flex items-baseline space-x-3 lg:space-x-4"> {/* Adjusted spacing */}
              {combinedNavLinks.map((link) => renderNavLink(link, false))}
            </div>
            
            <div className="ml-3 lg:ml-4 flex items-center space-x-2 lg:space-x-3"> {/* Auth buttons container */}
              {isLoading && (!authActionLinks || authActionLinks.length === 0) ? (
                <>
                  <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-md hidden sm:block"></div>
                </>
              ) : (
                authActionLinks.map((link) => renderNavLink(link, false))
              )}
            </div>
            {isAuthenticated && user && !isLoading && (
              <span className="ml-3 lg:ml-4 text-sm hidden lg:block" style={{ color: appColors.textDarkMuted }}>
                Hi, <a href={`/profile/me`}>{user.name.split(' ')[0]}!</a>
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
              {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t" style={{ borderColor: appColors.lightGrayBg }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {combinedNavLinks.map((link) => renderNavLink(link, true))}
            
            <div className="mt-2 pt-2 border-t" style={{borderColor: appColors.lightGrayBg}}>
              {isLoading && (!authActionLinks || authActionLinks.length === 0) ? (
                 <div className="block w-full text-left px-3 py-2">
                    <div className="w-3/4 h-10 bg-gray-200 animate-pulse rounded-md mx-auto"></div>
                 </div>
              ) : (
                authActionLinks.map((link) => renderNavLink(link, true))
              )}
            </div>
            {isAuthenticated && user && !isLoading && (
              <div className="px-3 py-3 text-base font-medium border-t" style={{ color: appColors.textDarkMuted, borderColor: appColors.lightGrayBg }}>
                Hi, {user.name.split(' ')[0]}!
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;