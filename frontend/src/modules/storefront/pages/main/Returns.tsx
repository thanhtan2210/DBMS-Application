import { PolicyLayout } from "./PolicyLayout";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export function Returns() {
  return (
    <PolicyLayout title="Returns Policy" lastUpdated="October 26, 2024" noProse>
      <div className="p-10 lg:p-14">
        <div className="mb-20">
          <p className="text-[20px] text-[#4a5e6d] leading-relaxed font-medium opacity-70 max-w-2xl">
            We stand behind the precision and quality of our products. If you are not entirely satisfied, our streamlined return process is designed to ensure a seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Step by Step Process */}
          <div className="lg:col-span-2 bg-[#f8f9fa] border border-[#e4eaf0] rounded-2xl p-12">
            <h3 className="text-[24px] font-bold text-[#112d4e] mb-12">Step-by-Step Return Process</h3>
            
            <div className="relative space-y-12">
              {/* Timeline Line */}
              <div className="absolute left-[24px] top-4 bottom-4 w-px bg-[#e4eaf0]"></div>

              <div className="relative flex gap-10 items-start">
                <div className="w-12 h-12 rounded-full bg-[#112d4e] text-white flex items-center justify-center shrink-0 z-10 font-bold">1</div>
                <div className="bg-white border border-[#e4eaf0] p-8 rounded-2xl shadow-sm flex-grow">
                  <h4 className="text-[18px] font-bold text-[#112d4e] mb-3">Initiate Return</h4>
                  <p className="text-[14px] text-[#4a5e6d] leading-relaxed font-medium opacity-80">
                    Log into your account, navigate to Order History, select the item(s), and click "Request Return". Provide a brief reason to help us improve.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-10 items-start">
                <div className="w-12 h-12 rounded-full bg-white border border-[#e4eaf0] text-[#4a5e6d] flex items-center justify-center shrink-0 z-10 font-bold">2</div>
                <div className="bg-white border border-[#e4eaf0] p-8 rounded-2xl shadow-sm flex-grow">
                  <h4 className="text-[18px] font-bold text-[#112d4e] mb-3">Print Label</h4>
                  <p className="text-[14px] text-[#4a5e6d] leading-relaxed font-medium opacity-80">
                    Once approved (instantly for most items), a prepaid shipping label will be generated. Print this label and affix it securely to your package.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-10 items-start">
                <div className="w-12 h-12 rounded-full bg-white border border-[#e4eaf0] text-[#4a5e6d] flex items-center justify-center shrink-0 z-10 font-bold">3</div>
                <div className="bg-white border border-[#e4eaf0] p-8 rounded-2xl shadow-sm flex-grow">
                  <h4 className="text-[18px] font-bold text-[#112d4e] mb-3">Ship Item</h4>
                  <p className="text-[14px] text-[#4a5e6d] leading-relaxed font-medium opacity-80">
                    Drop off the securely packaged item at any authorized carrier location within 14 days of generating the label.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-8">
            <div className="bg-[#112d4e] text-white p-10 rounded-2xl relative overflow-hidden">
              <Clock className="absolute top-4 right-4 w-20 h-20 opacity-10" />
              <h3 className="text-[20px] font-bold mb-8">Refund Timeline</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[12px] uppercase tracking-widest opacity-60 mb-1">Processing</p>
                  <p className="text-[18px] font-bold">2-3 Business Days</p>
                  <p className="text-[12px] opacity-60">Upon receipt at facility</p>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-widest opacity-60 mb-1">Bank Transfer</p>
                  <p className="text-[18px] font-bold">3-5 Business Days</p>
                  <p className="text-[12px] opacity-60">Depending on institution</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-[#e4eaf0] p-10 rounded-2xl">
              <h3 className="text-[20px] font-bold text-[#112d4e] mb-4">Need Assistance?</h3>
              <p className="text-[14px] text-[#4a5e6d] font-medium opacity-70 mb-8 leading-relaxed">
                Our dedicated support team is available to help you with complex returns or warranty claims.
              </p>
              <button className="w-full bg-[#112d4e] text-white py-4 rounded-xl font-bold text-[14px] hover:bg-opacity-90 transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-white border border-[#e4eaf0] rounded-2xl p-12">
          <h3 className="text-[24px] font-bold text-[#112d4e] mb-8">Eligibility Criteria</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle2 className="w-5 h-5 text-[#3e5f8a] shrink-0 mt-1" />
              <p className="text-[16px] text-[#4a5e6d] font-medium">Items must be returned within <strong>30 days</strong> of the delivery date.</p>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-5 h-5 text-[#3e5f8a] shrink-0 mt-1" />
              <p className="text-[16px] text-[#4a5e6d] font-medium">Products must be in their original, unused condition with all tags and packaging intact.</p>
            </div>
            <div className="flex gap-4">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
              <p className="text-[16px] text-[#4a5e6d] font-medium">Custom or personalized items are final sale and cannot be returned unless defective.</p>
            </div>
          </div>
        </div>
      </div>
    </PolicyLayout>
  );
}
