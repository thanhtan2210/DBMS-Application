import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { StorefrontProduct } from "@/types";
import { getActiveProducts } from "@/modules/admin/services/product-service";
import { getPublicCategories, CategoryDTO } from "@/modules/admin/services/category-service";

export function Home() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await getActiveProducts({ size: 4 });
        setProducts(prodRes.content || []);

        const catRes = await getPublicCategories();
        console.log("Fetched categories:", catRes);
        setCategories(catRes || []);
      } catch (err) {
        console.error("Failed to load home data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <img 
            src="https://picsum.photos/seed/postpurchase-hero/1920/1080" 
            alt="Hero" 
            className="w-full h-full object-cover blur-sm opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-2xl px-6 bg-white/40 backdrop-blur-3xl p-16 rounded-[2rem] shadow-2xl border border-white/40"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">The postpurchase <br />Collection</h1>
          <p className="text-postpurchase-muted text-lg md:text-xl mb-12 font-light leading-relaxed">
            Curated for Architectural Living. Discover pieces that define spaces with uncompromising precision.
          </p>
          <Link to="/shop" className="inline-block bg-postpurchase-accent text-white px-10 py-5 rounded-postpurchase font-bold uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-lg hover:shadow-postpurchase-accent/20">
            Shop the Collection
          </Link>
        </motion.div>
      </section>

      {/* Defined Spaces */}
      <section className="py-24 container-custom">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-tight">Defined Spaces</h2>
          <Link to="/categories" className="text-sm font-semibold text-postpurchase-muted hover:text-postpurchase-accent flex items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 relative aspect-[16/10] rounded-[2rem] overflow-hidden group">
            <img src={`https://source.unsplash.com/random/800x600?${categories[0]?.name || 'Living'}`} alt={categories[0]?.name || 'Living'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12">
              <h3 className="text-white text-4xl font-bold mb-2">{categories[0]?.name || 'Living'}</h3>
              <p className="text-white/70 text-sm">{categories[0]?.description || 'Elevated foundational pieces.'}</p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden group">
              <img src={`https://source.unsplash.com/random/400x400?${categories[1]?.name || 'Bedroom'}`} alt={categories[1]?.name || 'Bedroom'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-white text-2xl font-bold">{categories[1]?.name || 'Bedroom'}</h3>
              </div>
            </div>
            <div className="relative aspect-square rounded-[2rem] overflow-hidden group">
              <img src={`https://source.unsplash.com/random/400x400?${categories[2]?.name || 'Workspace'}`} alt={categories[2]?.name || 'Workspace'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-white text-2xl font-bold">{categories[2]?.name || 'Workspace'}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 bg-postpurchase-card">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="group flex flex-col bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-slate-50">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm group-hover:text-postpurchase-accent transition-colors">{p.name}</h4>
                  <span className="text-sm font-bold text-postpurchase-accent">${p.basePrice.toLocaleString()}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-postpurchase-muted tracking-widest">{p.category}</span>
              </Link>
            ))}
            {products.length === 0 && (
              <p className="col-span-4 text-center py-10 text-postpurchase-muted">No new arrivals to show right now.</p>
            )}
          </div>
        </div>
      </section>
      
      {/* Ethos Section */}
      <section className="py-32 container-custom grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="aspect-[4/5] bg-postpurchase-card rounded-[3rem] overflow-hidden relative shadow-2xl">
          <img 
            src="https://picsum.photos/seed/ethos/1000/1200" 
            alt="Ethos" 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-10 left-10 glass-morphism p-6 rounded-xl">
             <span className="text-[10px] font-bold tracking-widest uppercase">Uncompromising Quality</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-postpurchase-accent mb-6 block">Our Ethos</span>
          <h2 className="text-6xl font-bold mb-10 leading-tight">Form Rooted in <br />Structural Integrity</h2>
          <p className="text-postpurchase-muted text-lg leading-relaxed mb-12 font-light">
            We believe that true luxury lies in the unseen details. Every joint, seam, and finish is executed with architectural precision. Our commitment is to create pieces that transcend temporary trends, offering timeless elegance that anchors your living space.
          </p>
          <Link to="/about" className="text-sm font-bold tracking-widest uppercase flex items-center gap-3 hover:text-postpurchase-accent transition-colors group">
            Explore Our Process <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
