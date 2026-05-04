import { PolicyLayout } from "./PolicyLayout";
import { CheckCircle2, Keyboard, Contrast, UserCheck, Mail, Phone } from "lucide-react";

export function Accessibility() {
  return (
    <PolicyLayout title="Accessibility Statement" lastUpdated="October 28, 2024" noProse>
      <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
        <div className="flex-grow">
          <p className="text-[20px] text-stellar-muted leading-[1.6] font-medium opacity-60 mb-8 max-w-2xl">
            At Stellar Commerce, we believe high-end design must be inclusive. We are committed to ensuring our digital atelier is accessible to everyone, applying rigorous standards to deliver a precise and functional experience for all users.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#f0f7ff] text-stellar-accent px-4 py-2 rounded-full text-[13px] font-bold border border-[#dbeafe]">
            <CheckCircle2 className="w-4 h-4" />
            Committed to WCAG 2.1 AA
          </div>
        </div>
        <div className="lg:w-2/5 shrink-0 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://picsum.photos/seed/minimal/800/600" 
            alt="Minimalist architectural detail" 
            className="w-full aspect-[4/3] object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="mb-24">
        <h2 className="text-[32px] font-bold text-stellar-accent mb-12">Our Precision Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#f8f9fa] border border-stellar-border p-10 rounded-3xl">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stellar-accent shadow-sm mb-8">
              <Keyboard className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-bold text-stellar-accent mb-4">Keyboard Navigation</h3>
            <p className="text-[14px] text-stellar-muted font-medium leading-relaxed opacity-60">
              Our entire platform is structurally optimized for full keyboard operability, ensuring logical tab sequencing and visual focus indicators without relying on cursor interaction.
            </p>
          </div>
          <div className="bg-[#f8f9fa] border border-stellar-border p-10 rounded-3xl">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stellar-accent shadow-sm mb-8">
              <Contrast className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-bold text-stellar-accent mb-4">High Contrast Design</h3>
            <p className="text-[14px] text-stellar-muted font-medium leading-relaxed opacity-60">
              We utilize a carefully calibrated tonal palette. Core content and interactive elements strictly adhere to high-contrast ratios to assist users with visual impairments.
            </p>
          </div>
          <div className="bg-[#f8f9fa] border border-stellar-border p-10 rounded-3xl">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stellar-accent shadow-sm mb-8">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-bold text-stellar-accent mb-4">Screen Reader Support</h3>
            <p className="text-[14px] text-stellar-muted font-medium leading-relaxed opacity-60">
              Deep integration of semantic HTML and ARIA attributes provides comprehensive context for assistive technologies, ensuring structural meaning is never lost.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#f8f9fa] border border-stellar-border rounded-3xl p-12 md:p-16">
        <h2 className="text-[28px] font-bold text-stellar-accent mb-6">Require Assistance?</h2>
        <p className="text-[16px] text-stellar-muted font-medium leading-relaxed opacity-60 mb-12 max-w-2xl">
          We view accessibility as an ongoing architectural refinement. If you encounter any structural barriers or require assistance interacting with our platform, our dedicated support team is prepared to assist you promptly.
        </p>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex items-center gap-6 bg-white border border-stellar-border p-6 rounded-2xl flex-grow">
            <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center text-stellar-accent">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[15px] font-bold text-stellar-accent">access@stellarcommerce.com</span>
          </div>
          <div className="flex items-center gap-6 bg-white border border-stellar-border p-6 rounded-2xl flex-grow">
            <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center text-stellar-accent">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[15px] font-bold text-stellar-accent">1-800-STELLAR (TTY: 711)</span>
          </div>
        </div>
      </div>
    </PolicyLayout>
  );
}
