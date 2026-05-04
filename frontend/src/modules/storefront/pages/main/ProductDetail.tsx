import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Truck, ShieldCheck, Minus, Plus } from "lucide-react";
import { PRODUCTS, BRANDS } from "@/types"; // Updated alias
import { useAuth } from "@lib/AuthDummy"; // Updated to Dummy Auth
import { useCart } from "@lib/CartContext";
import { Skeleton } from "@ui/LoadingStates";

export function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const product = PRODUCTS.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const brand = BRANDS.find(b => b.id === product?.brandId);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (!product && !loading) return <div className="py-40 text-center">Product not found.</div>;

  if (loading) {
    return (
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <Skeleton className="aspect-square rounded-[3rem] w-full" />
            <div className="grid grid-cols-4 gap-4">
               {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-10 w-24" />
            <div className="space-y-4 pt-10">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="pt-20 space-y-4">
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-8">
          <div className="aspect-square bg-stellar-card rounded-[3rem] overflow-hidden shadow-2xl relative">
            {product && <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
             <div className="absolute top-8 right-8 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm">
               <span className="text-[10px] font-bold tracking-widest uppercase text-stellar-accent">{brand?.name || 'Stellar Origins'}</span>
             </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {[1, 2, 3, 4].map(i => (
               <div 
                 key={i} 
                 className={`aspect-square rounded-2xl overflow-hidden bg-stellar-card border transition-all ${activeImage === i ? 'border-stellar-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                 onClick={() => setActiveImage(i)}
               >
                  {product && <img src={`https://picsum.photos/seed/detail-${i}-${product.id}/400/400`} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
               </div>
             ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-4 h-4 ${product && i <= Math.floor(product.rating) ? "text-stellar-accent fill-stellar-accent" : "text-slate-200"}`} />
              ))}
            </div>
            <span className="text-sm text-stellar-muted">({product?.reviewCount} Reviews)</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">{product?.name}</h1>
          <p className="text-3xl font-light text-stellar-accent mb-10">${product?.basePrice}</p>
          
          <p className="text-stellar-muted text-lg leading-relaxed mb-12">
            {product?.description}
          </p>

          <div className="space-y-8 pb-12 border-b border-stellar-border">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stellar-muted mb-4 block">Select Color</span>
              <div className="flex gap-4">
                {["#1E293B", "#64748B", "#E2E8F0"].map(c => (
                  <div key={c} className="w-10 h-10 rounded-full border-2 border-transparent hover:border-stellar-accent cursor-pointer transition-all p-0.5">
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: c }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stellar-muted mb-4 block">Quantity</span>
                <div className="flex items-center border border-stellar-border rounded-lg px-4 py-2 gap-6 bg-white">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></button>
                  <span className="font-bold w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="pt-8 flex-grow">
                <button 
                  onClick={() => product && addToCart({
                    id: parseInt(product.id),
                    name: product.name,
                    price: product.basePrice,
                    quantity: quantity,
                    image: product.image
                  })}
                  className="w-full bg-stellar-accent text-white py-4 rounded-stellar font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl hover:shadow-stellar-accent/20"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="py-12 grid grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Truck className="w-6 h-6 text-stellar-accent" />
              <div>
                <h5 className="font-bold text-sm mb-1">Standard Shipping</h5>
                <p className="text-xs text-stellar-muted">Arrives in 5-7 business days.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <ShieldCheck className="w-6 h-6 text-stellar-accent" />
              <div>
                <h5 className="font-bold text-sm mb-1">Lifetime Warranty</h5>
                <p className="text-xs text-stellar-muted">Built for enduring longevity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
