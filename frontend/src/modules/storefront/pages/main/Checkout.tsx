import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogIn, Minus, Plus, Trash2, CreditCard, ShieldCheck } from "lucide-react";
import { PRODUCTS } from "@/types"; // Updated alias
import { useAuth } from "@lib/AuthDummy"; // Updated to Dummy Auth
import { useCart } from "@lib/CartContext";
import { LoadingOverlay } from "@ui/LoadingStates";

export function Checkout() {
  const { user, loading } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [selectedMethod, setSelectedMethod] = useState("card");

  const paymentMethods = [
    { id: "card", name: "Credit / Debit Card", icon: <CreditCard className="w-5 h-5" />, description: "Secure instant payment" },
    { id: "paypal", name: "PayPal", icon: <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center text-[10px] text-white font-black italic">P</div>, description: "Fast checkout using your account" },
    { id: "apple", name: "Apple Pay", icon: <div className="w-5 h-5 bg-black rounded-lg flex items-center justify-center text-white"><span className="text-[10px] font-bold"></span></div>, description: "One-touch secure payment" },
    { id: "transfer", name: "Bank Transfer", icon: <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-slate-600"><Plus className="w-3 h-3 rotate-45" /></div>, description: "Direct transfer from your bank" }
  ];

  const handleCompleteOrder = () => {
    if (cart.length === 0) return;
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      clearCart();
      navigate("/shop"); 
      alert("Order placed successfully! (Simulated)");
    }, 2000);
  };

  if (loading) return <div className="py-40 text-center">Loading architectural assets...</div>;

  // Temporarily allow checkout even if user is null for PHASE 1 UI testing
  const activeUser = user || null; 

  if (!activeUser) {
    return (
      <div className="container-custom py-40 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-stellar-accent/5 rounded-[2rem] flex items-center justify-center text-stellar-accent mb-8">
           <LogIn className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold mb-6 tracking-tight">Identity Required</h1>
        <p className="text-stellar-muted text-lg max-w-md mb-12 font-light">
          To ensure precision routing and secure handling, please sign in to complete your architectural purchase.
        </p>
        <Link to="/login" className="bg-stellar-accent text-white px-10 py-5 rounded-stellar font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl">
           Sign In to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-24">
      {processing && <LoadingOverlay />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-12">Your Cart</h1>
          <div className="space-y-12">
            {cart.length === 0 ? (
              <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-stellar-muted font-medium mb-6">Your architectural selection is empty.</p>
                <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-stellar-accent border-b-2 border-stellar-accent pb-1">Begin Selection</Link>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-8 group">
                  <div className="w-32 h-32 bg-stellar-card rounded-2xl overflow-hidden shadow-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-stellar-accent transition-colors">{item.name}</h3>
                        <p className="text-xs text-stellar-muted font-bold tracking-widest uppercase">{item.category}</p>
                      </div>
                      <span className="font-bold">${item.price * item.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-stellar-border rounded-lg px-3 py-1 bg-white gap-4">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-stellar-muted hover:text-stellar-accent"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-stellar-muted hover:text-stellar-accent"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs font-bold uppercase tracking-widest text-stellar-muted hover:text-red-500 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-20">
            <h3 className="text-2xl font-bold mb-8 tracking-tighter uppercase">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {paymentMethods.map(method => (
                 <button 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-start gap-4 p-6 rounded-[1.5rem] text-left transition-all border-2 ${
                    selectedMethod === method.id 
                    ? "border-stellar-accent bg-white shadow-lg shadow-stellar-accent/5" 
                    : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
                  }`}
                 >
                   <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                     selectedMethod === method.id ? "bg-stellar-accent text-white" : "bg-white text-stellar-muted"
                   }`}>
                     {method.icon}
                   </div>
                   <div>
                     <p className={`font-bold text-sm mb-1 ${selectedMethod === method.id ? "text-stellar-accent" : "text-slate-500"}`}>
                       {method.name}
                     </p>
                     <p className="text-[10px] text-stellar-muted opacity-60 leading-tight">
                       {method.description}
                     </p>
                   </div>
                 </button>
               ))}
            </div>

            {selectedMethod === "card" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-10 bg-white border border-stellar-border rounded-[2rem]"
              >
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8fa3b0] mb-3 block">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50/50 border border-[#eef2f6] rounded-xl px-5 py-4 focus:ring-1 focus:ring-stellar-accent outline-none text-sm font-mono" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8fa3b0] mb-3 block">Expiry Date</label>
                  <input type="text" placeholder="MM / YY" className="w-full bg-slate-50/50 border border-[#eef2f6] rounded-xl px-5 py-4 focus:ring-1 focus:ring-stellar-accent outline-none text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8fa3b0] mb-3 block">CVC</label>
                  <input type="text" placeholder="•••" className="w-full bg-slate-50/50 border border-[#eef2f6] rounded-xl px-5 py-4 focus:ring-1 focus:ring-stellar-accent outline-none text-sm" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-stellar-border p-10 rounded-[2.5rem] shadow-sm sticky top-32">
            <h3 className="text-2xl font-bold mb-8 tracking-tight">Order Summary</h3>
            
            <div className="mb-8 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">Promo Code</label>
              <div className="flex gap-2">
                <input type="text" placeholder="EX: WELCOME10" className="flex-grow bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-stellar-accent outline-none uppercase tracking-widest font-bold" />
                <button className="bg-stellar-accent text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">Apply</button>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-stellar-muted">Subtotal</span>
                <span className="font-bold">${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stellar-muted">Shipping</span>
                <span className="font-bold text-stellar-accent uppercase text-[10px] tracking-widest pt-1">Calculated in next step</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stellar-muted">Tax</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="pt-4 border-t border-stellar-border flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-2xl text-stellar-accent">${subtotal}</span>
              </div>
            </div>
            <button 
              onClick={handleCompleteOrder}
              disabled={processing}
              className="w-full bg-stellar-accent text-white py-5 rounded-stellar font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl hover:shadow-stellar-accent/20 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Processing..." : "Complete Order"}
            </button>
            <div className="flex items-center justify-center gap-2 text-stellar-muted">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[10px] uppercase font-bold tracking-widest">Secure 256-bit SSL encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
