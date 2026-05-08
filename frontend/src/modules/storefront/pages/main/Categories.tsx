import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getPublicCategories, CategoryDTO } from "@/modules/admin/services/category-service";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=2787&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518455027359-f3f816b1a23a?q=80&w=2787&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2787&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2787&auto=format&fit=crop"
];

export function Categories() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  useEffect(() => {
    getPublicCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <div className="container-custom py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Curated Spaces</h1>
        <p className="text-postpurchase-muted text-lg font-light">Architectural categories designed for precision living.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {categories.map((cat, index) => (
          <Link to="/shop" key={cat.id} className="group relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-lg">
            <img 
                src={DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
              <h3 className="text-white text-4xl font-bold mb-2 tracking-tight">{cat.name}</h3>
              <div className="flex justify-between items-center text-white/70 text-sm font-medium">
                <span>{cat.description || "CURATED CATEGORY"}</span>
                <span className="flex items-center gap-2 group-hover:gap-4 transition-all">
                  Shop Category <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
