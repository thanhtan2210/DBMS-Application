import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft, AlertTriangle } from "lucide-react";
import { useProfileLogic } from "@/hooks/useProfileLogic";

export function Profile() {
  const { user } = useAuthStore();
  const { 
    formData, setFormData, photoURL, handleAvatarChange, 
    validatePhone, handleSubmitProfile, isSaving, isDeleting, 
    showDeleteConfirm, setShowDeleteConfirm, deletePassword, 
    setDeletePassword, handleDeleteAccount, message 
  } = useProfileLogic();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile.</h2>
        <Link to="/" className="text-stellar-accent underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50/30">
      <div className="container-custom max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stellar-muted hover:text-stellar-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="bg-white rounded-[3rem] border border-stellar-border overflow-hidden shadow-sm">
          <div className="h-48 bg-stellar-accent relative">
             <div className="absolute -bottom-16 left-12">
               <div className="relative group">
                 <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                  accept="image/*"
                 />
                 <img 
                  src={photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt={formData.fullName || "User"} 
                  className="w-32 h-32 rounded-3xl border-8 border-white object-cover bg-white shadow-lg"
                 />
                 <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <Camera className="text-white w-8 h-8" />
                 </button>
               </div>
             </div>
          </div>

          <div className="pt-24 pb-12 px-12">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">{formData.fullName || "Architect Account"}</h1>
                <p className="text-stellar-muted text-sm italic">Managing your design specifications and delivery details.</p>
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
                      onChange={(e) => {
                        if (validatePhone(e.target.value)) setFormData({...formData, phone: e.target.value});
                      }}
                      className="w-full bg-slate-50/50 border border-[#eef2f6] rounded-xl pl-12 pr-5 py-4 focus:ring-1 focus:ring-stellar-accent outline-none text-sm" 
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8fa3b0] mb-3 block">Shipping Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-5 w-4 h-4 text-slate-300" />
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-slate-50/50 border border-[#eef2f6] rounded-xl pl-12 pr-5 py-4 focus:ring-1 focus:ring-stellar-accent outline-none text-sm min-h-[150px] resize-none" 
                      placeholder="Enter your primary delivery address..."
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
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <Save className="w-4 h-4" />}
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center px-4">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Account ID: {user.email.substring(0, 8)}...</p>
           <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="text-[10px] text-red-400 font-bold uppercase tracking-widest hover:text-red-600 transition-colors"
           >
            Request Account Deletion
           </button>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-10 max-w-md w-full relative z-[201] shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-stellar-accent mb-4 uppercase tracking-tighter">Delete Account?</h3>
              <p className="text-sm text-stellar-muted leading-relaxed mb-10">
                This action is permanent and cannot be undone. All your architectural orders, design preferences, and account history will be wiped from our secure servers.
              </p>
              <input 
                type="password" 
                value={deletePassword} 
                onChange={(e) => setDeletePassword(e.target.value)} 
                placeholder="Confirm your password" 
                className="w-full p-4 border border-stellar-border rounded-xl mb-6 text-sm" 
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-grow py-4 bg-slate-50 text-stellar-muted rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all"
                >
                  No, Keep it
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-grow py-4 bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
