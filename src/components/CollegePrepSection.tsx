'use client';

import { useTranslations } from 'next-intl';
import { GraduationCap, Award } from 'lucide-react';
import ScrollAnimation from '@/components/ScrollAnimation';

export default function CollegePrepSection() {
  const t = useTranslations();
  
  // Safely cast the raw object to string array
  const universities = Object.values(t.raw('home.programs.collegePrep.universities')) as string[];

  return (
    <section className="relative py-24 bg-[#0f172a] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[100px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
               backgroundSize: '30px 30px' 
             }} 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <ScrollAnimation animation="fade-up">
            <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
              <GraduationCap className="w-6 h-6 text-blue-400 mr-2" />
              <span className="text-blue-200 font-medium tracking-wide uppercase text-sm">
                World Class Education
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
              {t('home.programs.collegePrep.title')}
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 backdrop-blur-md shadow-2xl">
                <p className="text-2xl md:text-3xl font-light text-blue-100 leading-relaxed">
                  {t('home.programs.collegePrep.stats')}
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* Universities Grid */}
        <div className="mt-16">
          <ScrollAnimation animation="fade-up" delay={0.2}>
            <h3 className="text-center text-xl md:text-2xl font-serif text-blue-200/80 mb-12 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-blue-500/30"></span>
              {t('home.programs.collegePrep.universitiesTitle')}
              <span className="h-px w-12 bg-blue-500/30"></span>
            </h3>
          </ScrollAnimation>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni, index) => (
              <ScrollAnimation key={index} animation="fade-up" delay={0.1 + (index * 0.05)}>
                <div className="group relative p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 cursor-default">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white group-hover:text-blue-200 transition-colors">
                        {uni}
                      </h4>
                      <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
