import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { StorefrontProduct } from "@/types";
import { getActiveProducts } from "@/modules/admin/services/product-service";
import { getPublicCategories, CategoryDTO } from "@/modules/admin/services/category-service";
import { getBrands, BrandDTO } from "@/modules/admin/services/brand-service";
import { ProductCardSkeleton } from "@ui/LoadingStates";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeBrandId, setActiveBrandId] = useState<number | null>(null);
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | undefined>(undefined);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [brands, setBrands] = useState<BrandDTO[]>([]);

  useEffect(() => {
    getPublicCategories().then(res => setCategories(res)).catch(console.error);
    getBrands().then(res => setBrands(res)).catch(console.error);
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [query, activeCategoryId, activeBrandId, appliedMinPrice, appliedMaxPrice, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: any = { keyword: query, page: currentPage, size: 12 };
        if (activeCategoryId) params.categoryId = activeCategoryId;
        if (activeBrandId) params.brandId = activeBrandId;
        if (appliedMinPrice !== undefined) params.minPrice = appliedMinPrice;
        if (appliedMaxPrice !== undefined) params.maxPrice = appliedMaxPrice;
        if (sortBy) params.sort = sortBy;

        const response: any = await getActiveProducts(params);
        setProducts(response.content || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Không thể tải dữ liệu sản phẩm lúc này");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, activeCategoryId, activeBrandId, currentPage, appliedMinPrice, appliedMaxPrice, sortBy]);

  return (
    <div className="container-custom py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {query ? `Results for "${query}"` : "Collection"}
          </h1>
          <p className="text-postpurchase-muted text-sm italic">
            {query ? `Found ${products.length} items matching your search.` : "Precision design for modern living."}
          </p>
        </div>

        <div className="w-full md:w-auto">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-4 py-3 bg-postpurchase-card border border-postpurchase-border rounded-xl text-sm font-bold text-postpurchase-muted hover:text-postpurchase-text focus:outline-none focus:ring-2 focus:ring-postpurchase-accent transition-all appearance-none cursor-pointer pr-10 relative shadow-sm"
            style={{ 
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1em'
            }}
          >
            <option value="">Sort by Relevance</option>
            <option value="price,asc">Price: Low to High</option>
            <option value="price,desc">Price: High to Low</option>
            <option value="productName,asc">Name: A to Z</option>
            <option value="productName,desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-16">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full">
          <span className="text-xs font-bold uppercase tracking-widest text-postpurchase-muted min-w-[80px]">Categories:</span>
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeCategoryId === null ? "bg-postpurchase-accent text-white shadow-lg" : "bg-postpurchase-card text-postpurchase-muted hover:bg-postpurchase-border"}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeCategoryId === cat.id ? "bg-postpurchase-accent text-white shadow-lg" : "bg-postpurchase-card text-postpurchase-muted hover:bg-postpurchase-border"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full">
          <span className="text-xs font-bold uppercase tracking-widest text-postpurchase-muted min-w-[80px]">Brands:</span>
          <button
            onClick={() => setActiveBrandId(null)}
            className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeBrandId === null ? "bg-postpurchase-accent text-white shadow-lg" : "bg-postpurchase-card text-postpurchase-muted hover:bg-postpurchase-border"}`}
          >
            All
          </button>
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => setActiveBrandId(brand.id)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeBrandId === brand.id ? "bg-postpurchase-accent text-white shadow-lg" : "bg-postpurchase-card text-postpurchase-muted hover:bg-postpurchase-border"}`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full">
          <span className="text-xs font-bold uppercase tracking-widest text-postpurchase-muted min-w-[80px]">Price:</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-postpurchase-muted font-bold text-xs">$</span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-24 pl-6 pr-3 py-2 bg-postpurchase-card border border-postpurchase-border rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-postpurchase-accent transition-all"
              />
            </div>
            <span className="text-postpurchase-muted font-bold">-</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-postpurchase-muted font-bold text-xs">$</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-24 pl-6 pr-3 py-2 bg-postpurchase-card border border-postpurchase-border rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-postpurchase-accent transition-all"
              />
            </div>
            <button
              onClick={() => {
                setAppliedMinPrice(minPriceInput ? Number(minPriceInput) : undefined);
                setAppliedMaxPrice(maxPriceInput ? Number(maxPriceInput) : undefined);
              }}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${minPriceInput || maxPriceInput ? 'bg-postpurchase-text text-postpurchase-background hover:bg-postpurchase-accent hover:text-white shadow-md' : 'bg-postpurchase-card text-postpurchase-muted border border-postpurchase-border'}`}
            >
              Apply
            </button>
            {(appliedMinPrice !== undefined || appliedMaxPrice !== undefined) && (
              <button
                onClick={() => {
                  setMinPriceInput("");
                  setMaxPriceInput("");
                  setAppliedMinPrice(undefined);
                  setAppliedMaxPrice(undefined);
                }}
                className="px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-sm hover:shadow-md border border-red-100"
              >
                Clear
              </button>
            )}
          </div>
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
          <h2 className="text-2xl font-bold text-postpurchase-accent mb-4 uppercase tracking-tighter">No items found</h2>
          <p className="text-postpurchase-muted">Try adjusting your search or filters.</p>
          <button
            onClick={() => {
              setActiveCategoryId(null);
              setActiveBrandId(null);
              setMinPriceInput("");
              setMaxPriceInput("");
              setAppliedMinPrice(undefined);
              setAppliedMaxPrice(undefined);
              setSortBy("");
              if (query) window.location.href = '/shop';
            }}
            className="mt-8 px-8 py-4 bg-postpurchase-accent text-white rounded-full font-bold uppercase tracking-widest text-[10px]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((p, idx) => (
              <motion.div
                key={p.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/product/${p.id}`} className="group block">
                  <div className="aspect-square bg-postpurchase-card rounded-[2rem] overflow-hidden mb-6 relative border border-postpurchase-border shadow-sm hover:shadow-xl transition-all duration-500">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{p.name}</h4>
                      <p className="text-sm text-postpurchase-muted font-medium">{p.category}</p>
                    </div>
                    <span className="font-bold text-postpurchase-accent text-lg">${p.basePrice.toLocaleString()}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-2">
              <button 
                disabled={currentPage === 0} 
                onClick={() => setCurrentPage(p => p - 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-postpurchase-border disabled:opacity-50 hover:bg-postpurchase-card transition-all"
              >
                &larr;
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentPage === i ? 'bg-postpurchase-accent text-white shadow-md' : 'hover:bg-postpurchase-card'}`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                disabled={currentPage >= totalPages - 1} 
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-postpurchase-border disabled:opacity-50 hover:bg-postpurchase-card transition-all"
              >
                &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
