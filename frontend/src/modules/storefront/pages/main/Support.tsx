import { Search, Truck, ClipboardList, Plane, Shirt, Shield, ChevronRight, Mail, Phone, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export function Support() {
  const categories = [
    { title: "Ordering & Tracking", icon: <Truck className="w-6 h-6" />, desc: "Manage your recent orders, track shipments, and modify delivery details." },
    { title: "Returns & Refunds", icon: <ClipboardList className="w-6 h-6" />, desc: "Start a return, view refund status, and policies." },
    { title: "Shipping Info", icon: <Plane className="w-6 h-6" />, desc: "Rates, times, and international shipping options." },
    { title: "Product Care", icon: <Shirt className="w-6 h-6" />, desc: "Maintenance guides and warranty information." },
    { title: "Account & Security", icon: <Shield className="w-6 h-6" />, desc: "Manage passwords, payment methods, and privacy." }
  ];

  const quickLinks = [
    { title: "Returns Policy", to: "/returns" },
    { title: "Privacy Policy", to: "/privacy" },
    { title: "Terms of Service", to: "/terms" },
    { title: "Shipping Info", to: "/shipping" }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Search Header */}
      <section className="bg-slate-50 py-32 border-b border-stellar-border">
        <div className="container-custom text-center">
          <h1 className="text-[56px] font-bold text-stellar-accent mb-6 leading-tight">How can we help you today?</h1>
          <p className="text-[18px] text-stellar-muted font-medium opacity-60 mb-12">Search our knowledge base or browse categories below to find answers to your questions.</p>
          
          <div className="max-w-3xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stellar-muted w-5 h-5 group-focus-within:text-stellar-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search for 'Returns' or 'Shipping'" 
              className="w-full pl-16 pr-32 py-5 rounded-xl border border-stellar-border shadow-sm outline-none focus:border-stellar-accent transition-all text-[16px] font-medium" 
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1e4e7e] text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-[#153a5f] transition-all">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="container-custom py-24">
        <h2 className="text-[32px] font-bold text-stellar-accent mb-12">Browse Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {categories.map((cat, idx) => (
            <div key={idx} className={`bg-white p-10 rounded-2xl border border-stellar-border hover:shadow-lg transition-all cursor-pointer group ${idx === 0 ? "lg:col-span-2 relative overflow-hidden" : ""}`}>
              <div className="w-12 h-12 bg-[#1e4e7e] text-white rounded-lg flex items-center justify-center mb-8">
                {cat.icon}
              </div>
              <h3 className="text-[20px] font-bold text-stellar-accent mb-4 group-hover:text-[#1e4e7e] transition-colors">{cat.title}</h3>
              <p className="text-[14px] text-stellar-muted font-medium opacity-60 leading-relaxed max-w-sm">{cat.desc}</p>
              
              {idx === 0 && (
                <div className="absolute right-0 bottom-0 opacity-5 -mb-4 -mr-4">
                  <Truck className="w-64 h-64" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Links & Help Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-slate-50/50 p-12 rounded-3xl border border-stellar-border">
            <h3 className="text-[24px] font-bold text-stellar-accent mb-10">Quick Policy Links</h3>
            <div className="space-y-4">
              {quickLinks.map(link => (
                <Link key={link.to} to={link.to} className="flex items-center justify-between bg-white p-6 rounded-xl border border-stellar-border hover:border-stellar-accent transition-all group">
                  <span className="text-[15px] font-bold text-stellar-accent">{link.title}</span>
                  <ChevronRight className="w-5 h-5 text-stellar-muted group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white p-12 rounded-3xl border border-stellar-border shadow-2xl shadow-slate-200/50">
            <h3 className="text-[28px] font-bold text-stellar-accent mb-4">Still need help?</h3>
            <p className="text-[15px] text-stellar-muted font-medium opacity-60 mb-12">Our support team is available 24/7 to assist you with any inquiries.</p>
            
            <div className="space-y-8 mb-12">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-[#f0f7ff] rounded-xl flex items-center justify-center text-[#1e4e7e]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-widest text-stellar-muted font-bold opacity-60">Email Support</p>
                  <p className="text-[16px] font-bold text-stellar-accent underline underline-offset-4">support@stellarcommerce.com</p>
                </div>
              </div>
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-[#f0f7ff] rounded-xl flex items-center justify-center text-[#1e4e7e]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-widest text-stellar-muted font-bold opacity-60">Phone Support</p>
                  <p className="text-[16px] font-bold text-stellar-accent underline underline-offset-4">+1 (800) 123-4567</p>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#1e4e7e] text-white py-5 rounded-xl font-bold text-[16px] flex items-center justify-center gap-3 hover:bg-[#153a5f] transition-all">
              <MessageSquare className="w-5 h-5 text-slate-200" />
              Start Live Chat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
