import { Truck, Globe2, Plane, Ship, FileText, ChevronRight } from "lucide-react";

export function Shipping() {
  const domesticTiers = [
    { tier: "Standard Ground", transit: "3-5 Business Days", protocol: "Standard Curbside", tariff: "Complimentary", sub: "Orders > $500" },
    { tier: "Expedited Priority", transit: "1-2 Business Days", protocol: "Priority Handling", tariff: "$45.00" },
    { tier: "White Glove Installation", transit: "Scheduled Appointment", protocol: "In-room assembly & debris removal", tariff: "Calculated at Checkout" }
  ];

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-32">
          <div className="lg:w-1/2">
            <h1 className="text-[64px] font-bold text-postpurchase-accent leading-[1.1] mb-8 tracking-[-0.03em]">Precision in Delivery.</h1>
            <p className="text-[20px] text-postpurchase-muted font-medium opacity-60 leading-relaxed max-w-xl">
              We approach logistics with the same meticulous attention to detail as our architectural pieces. Review our transparent shipping tiers and global freight protocols below.
            </p>
          </div>
          <div className="lg:w-1/2 shrink-0 aspect-[4/3] bg-slate-100 rounded-[32px] overflow-hidden shadow-2xl">
             <img 
               src="https://picsum.photos/seed/delivery/1200/900" 
               alt="Global Logistics" 
               className="w-full h-full object-cover mix-blend-multiply opacity-80"
               referrerPolicy="no-referrer"
             />
          </div>
        </div>

        {/* Domestic Freight */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-[#1e4e7e] text-white rounded-lg flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-[32px] font-bold text-postpurchase-accent">Domestic Freight</h2>
          </div>

          <div className="bg-[#f8f9fa] border border-postpurchase-border rounded-[24px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-postpurchase-border bg-slate-50">
                    <th className="px-10 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-postpurchase-muted">Service Tier</th>
                    <th className="px-10 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-postpurchase-muted">Estimated Transit</th>
                    <th className="px-10 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-postpurchase-muted">Handling Protocol</th>
                    <th className="px-10 py-6 text-[10px] uppercase font-bold tracking-[0.2em] text-postpurchase-muted text-right">Tariff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-postpurchase-border">
                  {domesticTiers.map((tier, idx) => (
                    <tr key={idx} className="hover:bg-white transition-colors group italic">
                      <td className="px-10 py-10">
                        <span className="text-[15px] font-bold text-[#1e4e7e] not-italic">{tier.tier}</span>
                      </td>
                      <td className="px-10 py-10">
                        <span className="text-[14px] text-postpurchase-muted font-medium opacity-70">{tier.transit}</span>
                      </td>
                      <td className="px-10 py-10">
                        <span className="text-[14px] text-postpurchase-muted font-medium opacity-70">{tier.protocol}</span>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <div>
                          <p className="text-[15px] font-bold text-postpurchase-accent not-italic">{tier.tariff}</p>
                          {tier.sub && <p className="text-[11px] text-postpurchase-muted font-medium opacity-50 not-italic">{tier.sub}</p>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Global Reach */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-[#1e4e7e] text-white rounded-lg flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <h2 className="text-[32px] font-bold text-postpurchase-accent">Global Architecture Reach</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-postpurchase-border p-10 rounded-[28px] hover:shadow-xl transition-all">
              <div className="w-10 h-10 bg-[#f0f7ff] text-[#1e4e7e] rounded-lg flex items-center justify-center mb-8">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-[20px] font-bold text-postpurchase-accent mb-6">European Union & UK</h3>
              <p className="text-[14px] text-postpurchase-muted font-medium opacity-60 leading-relaxed mb-12">
                Dedicated freight corridors established for seamless delivery across Europe. VAT and duties are calculated pre-clearance for DDP shipping.
              </p>
              <div className="pt-6 border-t border-postpurchase-border">
                <span className="text-[12px] font-bold text-[#1e4e7e] uppercase tracking-widest">7-10 Days Transit</span>
              </div>
            </div>

            <div className="bg-white border border-postpurchase-border p-10 rounded-[28px] hover:shadow-xl transition-all">
              <div className="w-10 h-10 bg-[#f0f7ff] text-[#1e4e7e] rounded-lg flex items-center justify-center mb-8">
                <Ship className="w-5 h-5" />
              </div>
              <h3 className="text-[20px] font-bold text-postpurchase-accent mb-6">Asia Pacific</h3>
              <p className="text-[14px] text-postpurchase-muted font-medium opacity-60 leading-relaxed mb-12">
                Ocean freight and priority air options available for large architectural fixtures. Specialized crating ensures structural integrity during transit.
              </p>
              <div className="pt-6 border-t border-postpurchase-border">
                <span className="text-[12px] font-bold text-[#1e4e7e] uppercase tracking-widest">12-21 Days Transit</span>
              </div>
            </div>

            <div className="bg-white border border-postpurchase-border p-10 rounded-[28px] hover:shadow-xl transition-all">
              <div className="w-10 h-10 bg-[#f0f7ff] text-[#1e4e7e] rounded-lg flex items-center justify-center mb-8">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-[20px] font-bold text-postpurchase-accent mb-6">Customs & Duties</h3>
              <p className="text-[14px] text-postpurchase-muted font-medium opacity-60 leading-relaxed mb-12">
                We partner with elite customs brokers. All required documentation, including certificates of origin and material safety data, are handled by our logistics atelier.
              </p>
              <div className="pt-6 border-t border-postpurchase-border">
                <button className="flex items-center gap-2 text-[12px] font-bold text-[#1e4e7e] uppercase tracking-widest hover:gap-3 transition-all">
                  View Import Policies <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
