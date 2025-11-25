'use client';

import { useTranslations } from 'next-intl';
import { Navigation } from '@/components/navigation';
import PrimisLogo from '@/components/PrimisLogo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Clock, Building, Send } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      <Navigation />

      {/* Hero Section */}
      <div className="relative bg-primis-navy dark:bg-primis-navy-dark text-white py-24 sm:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primis-navy/50 to-primis-navy dark:to-primis-navy-dark" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            {t('title')}
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 dark:bg-primis-navy-light py-16 sm:py-24 -mt-12 relative z-20 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <Card className="border-0 bg-white/80 dark:bg-primis-navy/80 backdrop-blur-sm dark:border dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-primis-navy dark:text-white">
                    {t('info.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                  {/* Location */}
                  <div className="flex items-start space-x-5 group">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-primis-navy dark:text-white mb-1">{t('info.address')}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {t('info.addressValue')}
                      </p>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="flex items-start space-x-5 group">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Building className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-primis-navy dark:text-white mb-1">{t('info.facilities')}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('info.facilitiesValue')}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-5 group">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-primis-navy dark:text-white mb-1">{t('info.phone')}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('info.phoneValue')}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-5 group">
                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-primis-navy dark:text-white mb-1">{t('info.email')}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        info@primis.edu.mn
                      </p>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="flex items-start space-x-5 group">
                    <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-primis-navy dark:text-white mb-1">{t('info.workingHours')}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {t('info.workingHoursValue')}<br />
                        {t('info.workingHoursWeekend')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border-0 bg-white/80 dark:bg-primis-navy/80 backdrop-blur-sm dark:border dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden h-fit">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primis-navy dark:text-white">
                  {t('form.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('form.name')}
                      </label>
                      <Input
                        type="text"
                        id="name"
                        className="bg-gray-50 dark:bg-primis-navy-dark border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder={t('form.namePlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('form.email')}
                      </label>
                      <Input
                        type="email"
                        id="email"
                        className="bg-gray-50 dark:bg-primis-navy-dark border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder={t('form.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('form.subject')}
                    </label>
                    <Input
                      type="text"
                      id="subject"
                      className="bg-gray-50 dark:bg-primis-navy-dark border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder={t('form.subjectPlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('form.message')}
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-primis-navy-dark border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white resize-none"
                      placeholder={t('form.messagePlaceholder')}
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {t('form.submit')}
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white dark:bg-primis-navy pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl h-[400px] sm:h-[500px] relative group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2673.941657751616!2d106.9111153!3d47.9140821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d969336493393bd%3A0xef47701c9a70fd67!2sSoyombo%20Tower!5e0!3m2!1sen!2smn!4v1700000000000!5m2!1sen!2smn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
            ></iframe>
            
            {/* Overlay for better integration with dark mode before interaction */}
            <div className="absolute inset-0 pointer-events-none border-4 border-white/20 rounded-3xl z-10"></div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primis-navy dark:bg-primis-navy-dark text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <PrimisLogo variant="light" size="sm" showTagline={true} />
            </div>
            <p className="text-white/70 mb-4 font-light">
              Excellence in College Preparation
            </p>
            <p className="text-sm text-white/50 font-light">
              {tCommon('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
