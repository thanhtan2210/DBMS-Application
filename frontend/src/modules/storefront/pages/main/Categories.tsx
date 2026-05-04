import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/types";

export function Categories() {
  return (
    <div className="container-custom py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Curated Spaces</h1>
        <p className="text-stellar-muted text-lg font-light">Architectural categories designed for precision living.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {CATEGORIES.map(cat => (
          <Link to="/shop" key={cat.id} className="group relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-lg">
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
              <h3 className="text-white text-4xl font-bold mb-2 tracking-tight">{cat.name}</h3>
              <div className="flex justify-between items-center text-white/70 text-sm font-medium">
                <span>{cat.productCount} CURATED PIECES</span>
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
