import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Truck, ShieldCheck, Minus, Plus } from "lucide-react";
import { useAuth } from "@lib/AuthDummy"; 
import { useCart } from "@lib/CartContext";
import { Skeleton } from "@ui/LoadingStates";
import { getProductById } from "@/modules/admin/services/product-service";

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        if (id) {
            const data = await getProductById(id);
            setProduct(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const variants = product?.variants || []; 

  const handleAddToCart = async () => {
    if (variants.length > 0 && !selectedVariantId) {
      alert("Vui lòng chọn biến thể (Màu sắc/Kích cỡ)!");
      return;
    }
    const variantId = selectedVariantId || (variants.length > 0 ? variants[0].variantId : parseInt(product.id));
    try {
      await addToCart(variantId, quantity);
      alert("Đã thêm vào giỏ hàng!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Lỗi khi thêm vào giỏ hàng.");
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <Skeleton className="aspect-square rounded-[3rem] w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="py-40 text-center">Product not found.</div>;

  return (
    <div className="container-custom py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-8">
          <div className="aspect-square bg-stellar-card rounded-[3rem] overflow-hidden shadow-2xl relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">{product.name}</h1>
          <p className="text-3xl font-light text-stellar-accent mb-10">${product.basePrice}</p>
          
          <p className="text-stellar-muted text-lg leading-relaxed mb-12">
            {product.description}
          </p>

          <div className="space-y-8 pb-12 border-b border-stellar-border">
            {variants.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stellar-muted mb-4 block">Chọn biến thể</span>
                <div className="flex gap-4">
                  {variants.map((v: any) => (
                    <button
                      key={v.variantId}
                      onClick={() => setSelectedVariantId(v.variantId)}
                      className={`px-4 py-2 border rounded-lg text-xs ${selectedVariantId === v.variantId ? 'border-stellar-accent bg-stellar-accent text-white' : 'border-stellar-border'}`}
                    >
                      {v.variantName}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  onClick={handleAddToCart}
                  disabled={variants.length > 0 && !selectedVariantId}
                  className="w-full bg-stellar-accent text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs disabled:opacity-50 hover:bg-slate-800 transition-all shadow-xl"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
