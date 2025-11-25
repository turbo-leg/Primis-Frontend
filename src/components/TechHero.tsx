'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookOpen, Settings, BarChart, GraduationCap, Cpu, Network, Share2 } from 'lucide-react';
import PrimisLogo from '@/components/PrimisLogo';

export default function TechHero() {
  const t = useTranslations();

  return (
    <div className="relative min-h-[85vh] w-full bg-[#0a101f] overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/about-us.jpg" 
          alt="Primis Background" 
          fill
          className="object-cover opacity-20 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-[#0a101f]/80" />
      </div>

      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a3a5f]/30 via-[#0a101f] to-[#0a101f]" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
             backgroundSize: '50px 50px' 
           }} 
      />

      {/* Circuit Lines (Decorative) */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M100,100 L200,100 L200,200" fill="none" stroke="#4f46e5" strokeWidth="2" className="animate-pulse" />
          <path d="M800,100 L700,100 L700,300" fill="none" stroke="#0ea5e9" strokeWidth="2" className="animate-pulse delay-75" />
          <path d="M100,800 L200,800 L200,600" fill="none" stroke="#6366f1" strokeWidth="2" className="animate-pulse delay-150" />
          <path d="M900,800 L800,800 L800,600" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-pulse delay-300" />
          
          {/* Connecting lines to center */}
          <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#1e293b" strokeWidth="1" />
          <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#1e293b" strokeWidth="1" />
          <line x1="20%" y1="70%" x2="50%" y2="50%" stroke="#1e293b" strokeWidth="1" />
          <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="#1e293b" strokeWidth="1" />
        </svg>
      </div>

      {/* Floating Tech Icons */}
      <div className="hidden md:block absolute top-1/4 left-1/4 animate-bounce duration-[3000ms]">
        <BookOpen className="w-12 h-12 text-blue-400/60 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
      </div>
      <div className="hidden md:block absolute top-1/4 right-1/4 animate-bounce duration-[4000ms] delay-500">
        <BarChart className="w-12 h-12 text-cyan-400/60 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      </div>
      <div className="hidden md:block absolute bottom-1/4 left-1/4 animate-bounce duration-[3500ms] delay-200">
        <GraduationCap className="w-12 h-12 text-indigo-400/60 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
      </div>
      <div className="hidden md:block absolute bottom-1/4 right-1/4 animate-bounce duration-[4500ms] delay-700">
        <Settings className="w-12 h-12 text-sky-400/60 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
      </div>

      {/* "1.0" Digital Effect */}
      <div className="absolute top-10 right-4 md:top-20 md:right-20 opacity-20 select-none pointer-events-none">
        <div className="text-[6rem] md:text-[12rem] font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent leading-none tracking-tighter">
          1.0
        </div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] mix-blend-overlay" /> 
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
        
        {/* Logo Section */}
        <div className="mb-8 sm:mb-12 relative z-10 transform scale-75 sm:scale-100 origin-center">
           <PrimisLogo variant="light" size="lg" showTagline={true} />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
            {t('home.hero.title')}
          </span>
        </h1>

        <div className="relative mb-8 sm:mb-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>
          <p className="relative text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-200 tracking-wide drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
            {t('home.hero.subtitle')}
          </p>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-[1px]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0">
          <Link href="/register" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto min-w-[200px] h-12 sm:h-14 text-base sm:text-lg bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300"
            >
              {t('home.hero.beginJourney')}
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto min-w-[200px] h-12 sm:h-14 text-base sm:text-lg bg-transparent border-blue-500/30 text-blue-100 hover:bg-blue-500/10 hover:text-white hover:border-blue-400/50 transition-all duration-300 backdrop-blur-sm"
            >
              {t('home.hero.signIn')}
            </Button>
          </Link>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-12 sm:mt-16 md:mt-24 text-blue-400/40 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase">
          1.0 www.primiseducare.com
        </div>
      </div>
    </div>
  );
}
