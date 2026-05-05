import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { StorefrontProduct } from "@/types";
import { getActiveProducts } from "@/modules/admin/services/product-service";
import { getCategories, CategoryDTO } from "@/modules/admin/services/category-service";
import { getBrands, BrandDTO } from "@/modules/admin/services/brand-service";
import { ProductCardSkeleton } from "@ui/LoadingStates";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeBrandId, setActiveBrandId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [brands, setBrands] = useState<BrandDTO[]>([]);

  useEffect(() => {
    getCategories().then(res => setCategories(res)).catch(console.error);
    getBrands().then(res => setBrands(res)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: any = { keyword: query };
        if (activeCategoryId) params.categoryId = activeCategoryId;
        if (activeBrandId) params.brandId = activeBrandId;
        
        const response: any = await getActiveProducts(params);
        setProducts(response.content || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Không thể tải dữ liệu sản phẩm lúc này");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, activeCategoryId, activeBrandId]);

  return (
    <div className="container-custom py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {query ? `Results for "${query}"` : "Collection"}
          </h1>
          <p className="text-stellar-muted text-sm italic">
            {query ? `Found ${products.length} items matching your search.` : "Precision design for modern living."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-16">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full">
          <span className="text-xs font-bold uppercase tracking-widest text-stellar-muted min-w-[80px]">Categories:</span>
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeCategoryId === null ? "bg-stellar-accent text-white shadow-lg" : "bg-stellar-card text-stellar-muted hover:bg-stellar-border"}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeCategoryId === cat.id ? "bg-stellar-accent text-white shadow-lg" : "bg-stellar-card text-stellar-muted hover:bg-stellar-border"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full">
          <span className="text-xs font-bold uppercase tracking-widest text-stellar-muted min-w-[80px]">Brands:</span>
          <button
            onClick={() => setActiveBrandId(null)}
            className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeBrandId === null ? "bg-stellar-accent text-white shadow-lg" : "bg-stellar-card text-stellar-muted hover:bg-stellar-border"}`}
          >
            All
          </button>
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => setActiveBrandId(brand.id)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeBrandId === brand.id ? "bg-stellar-accent text-white shadow-lg" : "bg-stellar-card text-stellar-muted hover:bg-stellar-border"}`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="py-20 text-center text-red-500 font-bold">{error}</div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-stellar-accent mb-4 uppercase tracking-tighter">No items found</h2>
          <p className="text-stellar-muted">Try adjusting your search or filters.</p>
          <button
            onClick={() => {
               setActiveCategoryId(null);
               setActiveBrandId(null);
               if (query) window.location.href = '/shop';
            }}
            className="mt-8 px-8 py-4 bg-stellar-accent text-white rounded-full font-bold uppercase tracking-widest text-[10px]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((p, idx) => (
            <motion.div
              key={p.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/product/${p.id}`} className="group block">
                <div className="aspect-square bg-stellar-card rounded-[2rem] overflow-hidden mb-6 relative border border-stellar-border shadow-sm hover:shadow-xl transition-all duration-500">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg mb-1">{p.name}</h4>
                    <p className="text-sm text-stellar-muted font-medium">{p.category}</p>
                  </div>
                  <span className="font-bold text-stellar-accent text-lg">${p.basePrice.toLocaleString()}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
