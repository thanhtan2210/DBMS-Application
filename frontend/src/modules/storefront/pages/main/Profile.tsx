import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft, AlertTriangle, Package, LogOut } from "lucide-react";
import { getCustomerProfile, updateCustomerProfile, CustomerProfileDTO } from "@/modules/admin/services/customer-service";
import { getCustomerAddresses, AddressDTO } from "@/modules/admin/services/address-service";

export function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<CustomerProfileDTO | null>(null);
  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const customerIdMap: Record<string, number> = {
    'alice@email.com': 2,
    'bob@email.com': 3,
    'carol@email.com': 4
  };
  const customerId = user ? (customerIdMap[user.email] || 2) : 2;

  useEffect(() => {
    if (user) {
      getCustomerProfile(customerId).then(data => {
        setProfile(data);
        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          address: ""
        });
      }).catch(console.error);

      getCustomerAddresses(customerId).then(data => {
        setAddresses(data);
      }).catch(console.error);
    }
  }, [user, customerId]);

  if (!user) {
    return (
      <div className="container-custom py-40 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-6">Identity Required</h1>
        <Link to="/login" className="bg-stellar-accent text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs">
           Sign In
        </Link>
      </div>
    );
  }

  const handleSubmitProfile = async () => {
    setIsSaving(true);
    try {
      await updateCustomerProfile(customerId, {
        fullName: formData.fullName,
        phone: formData.phone
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50/30">
      <div className="container-custom max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stellar-muted hover:text-stellar-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="bg-white rounded-[3rem] border border-stellar-border overflow-hidden shadow-sm">
          <div className="h-48 bg-stellar-accent relative">
             <div className="absolute -bottom-16 left-12">
                 <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt={formData.fullName || "User"} 
                  className="w-32 h-32 rounded-3xl border-8 border-white object-cover bg-white shadow-lg"
                 />
             </div>
          </div>

          <div className="pt-24 pb-12 px-12">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">{formData.fullName || "Account"}</h1>
                <p className="text-stellar-muted text-sm italic">Loyalty Points: <span className="font-bold text-stellar-accent">{profile?.loyaltyPoints || 0}</span></p>
              </div>
              <div className="flex gap-4">
                 <Link to="/orders" className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-stellar-accent rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors">
                    <Package className="w-4 h-4" /> My Orders
                 </Link>
                 <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-red-100 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8fa3b0] mb-3 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-slate-50/50 border border-[#eef2f6] rounded-xl pl-12 pr-5 py-4 focus:ring-1 focus:ring-stellar-accent outline-none text-sm" 
                      placeholder="Your display name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8fa3b0] mb-3 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="w-full bg-slate-100 border border-[#eef2f6] rounded-xl pl-12 pr-5 py-4 text-slate-400 cursor-not-allowed outline-none text-sm" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8fa3b0] mb-3 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50/50 border border-[#eef2f6] rounded-xl pl-12 pr-5 py-4 focus:ring-1 focus:ring-stellar-accent outline-none text-sm" 
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                
                {message.text && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl text-xs font-bold text-center ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                  >
                    {message.text}
                  </motion.div>
                )}

                <button 
                  onClick={handleSubmitProfile}
                  disabled={isSaving}
                  className="w-full bg-stellar-accent text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-stellar-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Profile Changes"}
                </button>

              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Saved Addresses</h3>
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map(addr => (
                      <div key={addr.addressId} className="p-5 border border-stellar-border rounded-2xl bg-slate-50 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm">{addr.receiverName}</span>
                            {addr.isDefault && <span className="bg-stellar-accent text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Default</span>}
                          </div>
                          <p className="text-xs text-stellar-muted">{addr.phone}</p>
                          <p className="text-xs text-stellar-muted mt-2">{addr.street}, {addr.ward}</p>
                          <p className="text-xs text-stellar-muted">{addr.district}, {addr.city}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stellar-muted italic">No addresses saved yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
