import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogOut,
  Package
} from "lucide-react";
import { PRODUCTS, StorefrontProduct } from "@/types";
import { getActiveProducts } from "@/modules/admin/services/product-service";
import { useAuthStore } from "@/store/useAuthStore";
import { useCart } from "@lib/CartContext";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<StorefrontProduct[]>([]);
  const { user, logout, isAuthenticated } = useAuthStore();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      getActiveProducts({ keyword: searchQuery, size: 5 })
        .then((res: any) => {
          setSuggestions(res.content || []);
        })
        .catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent"}`}>
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-xl tracking-tight text-stellar-accent">Stellar Commerce</span>
          </Link>
          
          <div className="hidden lg:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-stellar-muted">
            <Link to="/categories" className="hover:text-stellar-accent transition-colors">Categories</Link>
            <Link to="/shop" className="hover:text-stellar-accent transition-colors">New Arrivals</Link>
            <Link to="/support" className="hover:text-stellar-accent transition-colors">Support</Link>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div ref={searchContainerRef} className="relative flex items-center">
            <motion.div
              initial={false}
              animate={{ 
                width: isSearchExpanded ? "200px" : "40px",
                borderColor: isSearchExpanded ? "rgba(30, 58, 138, 1)" : "rgba(30, 58, 138, 0)"
              }}
              className={`flex items-center gap-2 overflow-hidden border-b-2 transition-all duration-300 h-10`}
            >
              <button 
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="p-2 text-stellar-muted hover:text-stellar-accent shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <form onSubmit={handleSearchSubmit} className="flex-grow">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-full text-stellar-accent placeholder:text-slate-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </motion.div>
          </div>

          <Link to="/checkout" className="relative shrink-0">
            <ShoppingCart className="w-5 h-5 text-stellar-muted hover:text-stellar-accent" />
            <span className="absolute -top-2 -right-2 bg-stellar-accent text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{totalItems}</span>
          </Link>
        
        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/profile" className="text-[10px] uppercase font-bold tracking-widest text-stellar-muted hover:text-stellar-accent transition-colors flex items-center gap-1.5">
               <User className="w-3.5 h-3.5" /> Profile
            </Link>
            <Link to="/orders" className="text-[10px] uppercase font-bold tracking-widest text-stellar-muted hover:text-stellar-accent transition-colors flex items-center gap-1.5">
               <Package className="w-3.5 h-3.5" /> Orders
            </Link>
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              className="text-[10px] uppercase font-bold tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="hidden md:flex items-center gap-2 text-stellar-muted hover:text-stellar-accent transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Sign In</span>
          </Link>
        )}

        <button onClick={() => setIsMenuOpen(true)} className="lg:hidden">
          <Menu className="w-6 h-6 text-stellar-muted" />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-bold text-xl tracking-tight text-stellar-accent">Menu</span>
              <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="flex flex-col gap-8 text-2xl font-light">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/categories" onClick={() => setIsMenuOpen(false)}>Categories</Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
              <Link to="/support" onClick={() => setIsMenuOpen(false)}>Support</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); navigate('/login'); }} className="text-left text-red-500">Sign Out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-stellar-border py-20 mt-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <h3 className="font-bold text-xl mb-6 text-stellar-accent">Stellar Commerce</h3>
            <p className="text-stellar-muted text-[11px] leading-relaxed font-medium uppercase tracking-widest">
              © 2024 STELLAR COMMERCE. PRECISION IN EVERY DETAIL.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
            <div className="space-y-6">
              <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stellar-text opacity-40">Legal</h5>
              <ul className="flex flex-col gap-3 text-[12px] font-medium text-stellar-muted">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stellar-text opacity-40">Customer</h5>
              <ul className="flex flex-col gap-3 text-[12px] font-medium text-stellar-muted">
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/returns">Returns</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
