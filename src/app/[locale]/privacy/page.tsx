import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('common');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p>Last updated: December 3, 2025</p>
        
        <h2 className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</h2>
        <p>We collect information that you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, such as to process transactions, send you technical notices, and respond to your comments.</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">3. Information Sharing</h2>
        <p>We do not share your personal information with third parties except as described in this privacy policy.</p>
        
        <h2 className="text-xl font-semibold mt-4 mb-2">4. Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
      </div>
    </div>
  );
}
