'use client';

import React from 'react';
import Link from 'next/link';
import { appColors } from '@/constants/colors';
import { ArrowRightIcon, HeartIcon, MegaphoneIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const FundraisingSection = () => {
  const features = [
    {
      icon: MegaphoneIcon,
      title: 'Wujudkan Visi Anda',
      description: 'Buat kampanye personal untuk tujuan yang berarti bagi Anda. Ceritakan kisah Anda dan inspirasi kedermawanan.',
    },
    {
      icon: HeartIcon,
      title: 'Galang Komunitas Anda',
      description: 'Bagikan kampanye Anda dengan mudah dan gerakkan jaringan Anda untuk berkontribusi dan menyebarkan berita.',
    },
    {
      icon: ChartBarIcon,
      title: 'Lihat Dampak Anda',
      description: 'Pantau donasi secara real-time dan saksikan kekuatan kolektif dalam memberi membuat perbedaan.',
    },
  ];

  return (
    <section
      id="jadi-fundraiser-cta"
      className="py-20 sm:py-28 relative overflow-hidden"
      style={{ backgroundColor: appColors.babyTurquoiseLight }}
    >
      <div
        className="absolute top-1/4 -right-1/4 w-1/2 h-3/4 rounded-full opacity-20 filter blur-3xl animate-blob-pulse"
        style={{ backgroundColor: appColors.babyPinkLight, animationDuration: '12s' }}
      ></div>
       <div
        className="absolute bottom-1/4 -left-1/4 w-1/2 h-3/4 rounded-full opacity-20 filter blur-3xl animate-blob-pulse-reverse"
        style={{ backgroundColor: appColors.babyTurquoiseAccent, animationDuration: '15s' }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <MegaphoneIcon className="mx-auto h-16 w-16 mb-6" style={{color: appColors.babyPinkAccent}} />
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          style={{ color: appColors.textDark }}
        >
          Siap Memperjuangkan Tujuan Mulia?
        </h2>
        <p
          className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl mb-12"
          style={{ color: appColors.textDarkMuted }}
        >
          Bergabunglah dengan GatherLove sebagai Fundraiser dan ubah semangat Anda menjadi aksi nyata. Buat, bagikan, dan kelola kampanye yang berdampak dengan mudah.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-16 text-left">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{backgroundColor: appColors.white}}
            >
              <feature.icon className="h-10 w-10 mb-4" style={{color: appColors.babyPinkAccent}} />
              <h3 className="text-xl font-semibold mb-2" style={{color: appColors.textDark}}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{color: appColors.textDarkMuted}}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <Link href="/auth/upgrade" legacyBehavior>
          <a
            className="inline-flex items-center justify-center py-3.5 px-8 border border-transparent text-lg font-semibold rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 group"
            style={{
              backgroundColor: appColors.babyPinkAccent,
              color: appColors.white
            }}
          >
            Jadi Fundraiser Sekarang
            <ArrowRightIcon className="ml-3 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Link>
      </div>
    </section>
  );
};

export default FundraisingSection;
