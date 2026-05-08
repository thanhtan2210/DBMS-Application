import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogIn, Minus, Plus, Trash2, CreditCard, ShieldCheck, MapPin, Tag } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCart } from "@lib/CartContext";
import { LoadingOverlay } from "@ui/LoadingStates";
import { createOrder } from "@/modules/admin/services/order-service";
import { getCustomerAddresses, AddressDTO } from "@/modules/admin/services/address-service";
import { applyPromotion } from "@/modules/admin/services/promotion-service";

export function Checkout() {
  const { user } = useAuthStore();
  const { cart, removeFromCart, updateQuantity, selectItem, refreshCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address state
  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Promotion state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = Array.isArray(cart) ? cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0) : 0;
  const total = Math.max(0, subtotal - discount);

  const customerIdMap: Record<string, number> = {
    'alice@email.com': 2,
    'bob@email.com': 3,
    'carol@email.com': 4
  };
  const customerId = user ? (customerIdMap[user.email] || 2) : 2;

  useEffect(() => {
    if (user) {
      getCustomerAddresses(customerId)
        .then(data => {
          setAddresses(data);
          if (data.length > 0) {
             const defaultAddr = data.find(a => a.isDefault);
             setSelectedAddressId(defaultAddr ? defaultAddr.addressId : data[0].addressId);
          }
        })
        .catch(console.error);
    }
  }, [user, customerId]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError(null);
    try {
      const response: any = await applyPromotion(promoCode, subtotal);
      // The API returns the discount amount in data.data or similar, depends on interceptor.
      const discountAmount = response.data || response; 
      setDiscount(discountAmount);
      setAppliedPromo(promoCode);
      setPromoCode("");
    } catch (err: any) {
      console.error(err);
      setPromoError(err?.response?.data?.message || "Invalid or expired promotion code.");
      setDiscount(0);
      setAppliedPromo(null);
    }
  };

  const handleCompleteOrder = async () => {
    console.log("Cart Items:", cart);
    const selectedItems = Array.isArray(cart) ? cart.filter(item => item.selectedFlag) : [];
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm trong giỏ hàng.");
      return;
    }
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      const payload: any = {
        customerId: customerId, 
        shippingAddressId: selectedAddressId, 
        selectedCartItemIds: selectedItems.map(item => item.cartItemId),
        paymentMethod: "COD"
      };

      if (appliedPromo) {
         payload.promotionCodes = [appliedPromo];
      }

      await createOrder(payload);
      
      alert("Đặt hàng thành công!");
      refreshCart();
      navigate("/shop");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Đặt hàng thất bại.");
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="container-custom py-40 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-6">Identity Required</h1>
        <Link to="/login" className="bg-postpurchase-accent text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs">
           Sign In to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-24">
      {processing && <LoadingOverlay />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-16">
          <div>
            <h1 className="text-4xl font-bold mb-12">Your Cart</h1>
            <div className="space-y-12">
              {Array.isArray(cart) && cart.length > 0 ? cart.map(item => (
                <div key={item.cartItemId} className="flex gap-8 group items-center">
                  <input 
                    type="checkbox" 
                    checked={item.selectedFlag}
                    onChange={(e) => selectItem(item.cartItemId, e.target.checked)}
                  />
                  <img 
                      src={`https://source.unsplash.com/random/100x100?product&sig=${item.variant.variantId}`} 
                      alt={item.variant.variantName} 
                      className="w-20 h-20 object-cover rounded-2xl bg-postpurchase-card"
                  />
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{item.variant.product?.productName || item.variant.variantName}</h3>
                        {item.variant.product && <p className="text-xs text-postpurchase-muted">{item.variant.variantName}</p>}
                      </div>
                      <span className="font-bold">${(item.unitPrice * item.quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}><Minus className="w-4 h-4"/></button>
                      <span className="text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}><Plus className="w-4 h-4"/></button>
                      <button onClick={() => removeFromCart(item.cartItemId)}><Trash2 className="w-4 h-4 text-red-500"/></button>
                    </div>
                  </div>
                </div>
              )) : (
                 <p className="text-postpurchase-muted">Giỏ hàng của bạn đang trống.</p>
              )}
            </div>
          </div>

          {/* Addresses Section */}
          <div>
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin className="w-6 h-6"/> Shipping Address</h2>
             {addresses.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {addresses.map(addr => (
                   <div 
                     key={addr.addressId}
                     onClick={() => setSelectedAddressId(addr.addressId)}
                     className={`p-6 border rounded-2xl cursor-pointer transition-all ${selectedAddressId === addr.addressId ? 'border-postpurchase-accent shadow-md bg-postpurchase-accent/5' : 'border-postpurchase-border hover:border-postpurchase-muted'}`}
                   >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">{addr.receiverName}</h4>
                        {addr.isDefault && <span className="text-[10px] bg-postpurchase-card px-2 py-1 rounded font-bold uppercase text-postpurchase-muted">Default</span>}
                      </div>
                      <p className="text-sm text-postpurchase-muted mb-1">{addr.phone}</p>
                      <p className="text-sm text-postpurchase-muted line-clamp-2">{addr.street}, {addr.city}</p>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-postpurchase-muted italic">Không tìm thấy địa chỉ giao hàng.</p>
             )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm sticky top-32 border border-postpurchase-border/50">
            <h3 className="text-2xl font-bold mb-8">Order Summary</h3>
            
            {/* Promo Code Input */}
            <div className="mb-8">
              <label className="text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2 flex items-center gap-1"><Tag className="w-3 h-3"/> Promotion Code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code" 
                  className="w-full border border-postpurchase-border rounded-lg px-4 text-sm uppercase"
                  disabled={appliedPromo !== null}
                />
                {appliedPromo ? (
                   <button onClick={() => { setAppliedPromo(null); setDiscount(0); }} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200">Remove</button>
                ) : (
                   <button onClick={handleApplyPromo} className="px-4 py-2 bg-postpurchase-card text-postpurchase-accent rounded-lg text-sm font-bold hover:bg-postpurchase-border">Apply</button>
                )}
              </div>
              {promoError && <p className="text-red-500 text-[10px] mt-2">{promoError}</p>}
              {appliedPromo && <p className="text-emerald-500 text-[10px] mt-2 font-bold">Promo '{appliedPromo}' applied! (-${discount.toLocaleString()})</p>}
            </div>

            <div className="space-y-4 mb-8 pt-6 border-t border-postpurchase-border">
               <div className="flex justify-between text-sm">
                  <span className="text-postpurchase-muted">Subtotal</span>
                  <span className="font-bold">${subtotal.toLocaleString()}</span>
               </div>
               {discount > 0 && (
                 <div className="flex justify-between text-sm text-emerald-500 font-bold">
                    <span>Discount</span>
                    <span>-${discount.toLocaleString()}</span>
                 </div>
               )}
               <div className="flex justify-between text-xl pt-4 border-t border-postpurchase-border">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toLocaleString()}</span>
               </div>
            </div>

            <button 
              onClick={() => {
                console.log("Nút Complete Order đã được nhấn!");
                handleCompleteOrder();
              }}
              className="w-full bg-postpurchase-accent text-white py-5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {processing ? "Processing..." : "Complete Order"}
            </button>
            {error && <p className="text-red-500 mt-4 text-xs text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
