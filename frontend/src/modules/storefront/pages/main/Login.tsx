import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, Mail, Lock, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import authService from "@/api/authService";

export function Login() {
  const { isAuthenticated, setToken } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      await setToken(response.token);
      
      // Lấy state mới nhất từ store sau khi setToken
      const user = useAuthStore.getState().user;
      
      if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container-custom">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-stellar-border rounded-[3rem] p-12 shadow-xl"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-stellar-accent/5 rounded-2.5xl flex items-center justify-center mx-auto mb-6 text-stellar-accent">
             <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Welcome Back</h1>
          <p className="text-stellar-muted text-sm font-light">Access your curated collection with Spring Boot Security.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
           <div className="space-y-4">
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stellar-muted" />
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Email address" 
                   className="w-full pl-12 pr-4 py-4 rounded-stellar border border-stellar-border bg-stellar-card text-sm outline-none focus:ring-2 focus:ring-stellar-accent/20 transition-all" 
                   required
                 />
              </div>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stellar-muted" />
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Password" 
                   className="w-full pl-12 pr-4 py-4 rounded-stellar border border-stellar-border bg-stellar-card text-sm outline-none focus:ring-2 focus:ring-stellar-accent/20 transition-all" 
                   required
                 />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-stellar-accent text-white py-4 rounded-stellar font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-stellar-accent/20 disabled:opacity-70"
              >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
              </button>
           </div>

           <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stellar-border opacity-50"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]"><span className="bg-white px-4 text-stellar-muted">Managed by Monolith Auth</span></div>
           </div>
        </form>

        <p className="mt-12 text-center text-[10px] text-stellar-muted uppercase tracking-widest font-bold">
          New to Stellar? <span className="text-stellar-accent cursor-pointer italic">Create account</span>
        </p>
      </motion.div>
    </div>
  );
}
