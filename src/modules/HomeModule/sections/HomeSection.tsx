import React from 'react';
import { appColors } from '@/constants/colors';

const HomeSection = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: appColors.babyPinkLight }}
    >
      <div
        className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full opacity-50 filter blur-3xl animate-blob-pulse"
        style={{ backgroundColor: appColors.babyTurquoiseLight }}
      ></div>
      <div
        className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 rounded-full opacity-50 filter blur-3xl animate-blob-pulse-reverse"
        style={{ backgroundColor: appColors.babyPinkAccent }}
      ></div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
          style={{ color: appColors.textDark }}
        >
          <span className="block">Selamat Datang di</span>
          <span
            className="block mt-2"
            style={{
              background: `linear-gradient(to right, ${appColors.babyTurquoiseAccent}, ${appColors.babyPinkAccent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            GatherLove
          </span>
        </h1>
        <p
          className="mt-6 max-w-xl mx-auto text-lg sm:text-xl mb-10"
          style={{ color: appColors.textDark, opacity: 0.9 }}
        >
          Platform penggalangan dana online yang memberdayakan Fundraiser untuk membuat kampanye dan Donatur untuk berbagi kebaikan. Transparan, aman, dan mudah digunakan.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a
            href="#fitur"
            className="text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md transform transition-all duration-300 ease-in-out hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: appColors.babyTurquoiseAccent }}
          >
            Pelajari Lebih Lanjut
          </a>
          <a
            href="#kontak"
            className="font-semibold py-3 px-8 rounded-lg text-lg shadow-md transform transition-all duration-300 ease-in-out hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: appColors.white,
              color: appColors.babyPinkAccent,
              borderColor: appColors.babyPinkAccent,
              borderWidth: '2px'
            }}
          >
            Donasi Sekarang
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;