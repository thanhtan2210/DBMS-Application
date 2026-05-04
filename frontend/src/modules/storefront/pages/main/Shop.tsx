import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { PRODUCTS } from "@/types";
import { ProductCardSkeleton } from "@ui/LoadingStates";

export function Shop() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = !query || 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container-custom py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {query ? `Results for "${query}"` : "New Arrivals"}
          </h1>
          <p className="text-stellar-muted text-sm italic">
            {query ? `Found ${filteredProducts.length} items matching your search.` : "Curated pieces for precision design."}
          </p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto">
          {["All", "Lounge", "Surface", "Lighting", "Seating", "Decor", "Workspace"].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeCategory === cat ? "bg-stellar-accent text-white shadow-lg" : "bg-stellar-card text-stellar-muted hover:bg-stellar-border"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-stellar-accent mb-4 uppercase tracking-tighter">No items found</h2>
          <p className="text-stellar-muted">Try adjusting your search or category filters.</p>
          <button 
            onClick={() => {
              setActiveCategory("All");
              // Clear search query by navigating
            }}
            className="mt-8 px-8 py-4 bg-stellar-accent text-white rounded-full font-bold uppercase tracking-widest text-[10px]"
          >
            <Link to="/shop">Reset Search</Link>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            filteredProducts.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/product/${p.id}`} className="group block">
                  <div className="aspect-square bg-stellar-card rounded-[2rem] overflow-hidden mb-6 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                    {p.badge && (
                      <div className="absolute top-6 left-6 bg-white px-4 py-1.5 rounded-full shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stellar-accent">{p.badge}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{p.name}</h4>
                      <p className="text-sm text-stellar-muted">{p.category}</p>
                    </div>
                    <span className="font-bold text-stellar-accent text-lg">${p.basePrice}</span>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
