import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('common');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose max-w-none">
        <p>Last updated: December 3, 2025</p>
        
        <h2 className="text-xl font-semibold mt-4 mb-2">1. Acceptance of Terms</h2>
        <p>By accessing and using the Primis platform, you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Primis's website for personal, non-commercial transitory viewing only.</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">3. Disclaimer</h2>
        <p>The materials on Primis's website are provided "as is". Primis makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
        
        <h2 className="text-xl font-semibold mt-4 mb-2">4. Limitations</h2>
        <p>In no event shall Primis or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Primis's Internet site.</p>
      </div>
    </div>
  );
}
