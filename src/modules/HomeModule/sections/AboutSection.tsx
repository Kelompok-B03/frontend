'use client';

import React from 'react';
import Image from 'next/image';
import { appColors } from '@/constants/colors';

const AboutSection = () => {
  return (
    <div
      id="tentang"
      className="py-20 sm:py-28"
      style={{ backgroundColor: appColors.white }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6"
              style={{ color: appColors.babyPinkAccent }}
            >
              Tentang GatherLove
            </h2>
            <p
              className="text-lg sm:text-xl mb-6 leading-relaxed"
              style={{ color: appColors.textDark, opacity: 0.9 }}
            >
              GatherLove adalah platform yang didedikasikan untuk memfasilitasi penggalangan dana secara online dengan mengutamakan transparansi, keamanan, dan kemudahan bagi semua pengguna, baik Fundraiser maupun Donatur.
            </p>
            <p
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: appColors.textDark, opacity: 0.9 }}
            >
              Kami percaya setiap bantuan berarti dan bersama kita bisa membuat perbedaan nyata dalam kehidupan banyak orang. Bergabunglah dengan kami dalam menyebarkan kebaikan.
            </p>
            <div className="mt-10">
              <a
                href="#kontak"
                className="text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md transform transition-all duration-300 ease-in-out hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: appColors.babyPinkAccent }}
              >
                Jadi Bagian dari Kami
              </a>
            </div>
          </div>
          <div
            className="mt-12 lg:mt-0 p-8 rounded-xl relative overflow-hidden"
            style={{ backgroundColor: appColors.babyTurquoiseLight }}
          >
            <Image
              src={`https://images.unsplash.com/photo-1609139003551-ee40f5f73ec0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
              alt="Ilustrasi GatherLove"
              width={600}
              height={400}
              className="rounded-lg shadow-md mx-auto"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/cccccc/333333?text=Image+Error'; }}
              unoptimized
            />
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 filter blur-2xl"
              style={{ backgroundColor: appColors.babyPinkAccent }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;