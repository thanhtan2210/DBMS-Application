import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UserPlus, Mail, Lock, Phone, CalendarDays, VenusAndMars, Loader2, Eye, EyeOff } from "lucide-react";
import authService from "@/api/authService";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string> | string | null;
};

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    retypePassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const parseErrorMessage = (err: unknown) => {
    const response = (err as { response?: { data?: ApiErrorResponse } })?.response?.data;

    if (response) {
      if (typeof response.errors === "string" && response.errors.trim()) {
        return response.errors;
      }

      if (response.errors && typeof response.errors === "object") {
        const messages = Object.values(response.errors).filter(Boolean);
        if (messages.length > 0) {
          return messages.join("\n");
        }
      }

      if (response.message?.trim()) {
        return response.message;
      }
    }

    return "Registration failed. Please check your information and try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullName || !form.email || !form.password || !form.retypePassword) {
      setError("Please fill in the required fields.");
      return;
    }

    if (form.password !== form.retypePassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        retypePassword: form.retypePassword,
        phone: form.phone || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
      });

      const message = response?.message || "Account created successfully.";
      setSuccess(message);
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      console.error("Registration failed:", err);
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container-custom py-12">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-2xl bg-white border border-postpurchase-border rounded-[3rem] p-8 md:p-12 shadow-xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-postpurchase-accent/5 rounded-2.5xl flex items-center justify-center mx-auto mb-6 text-postpurchase-accent">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Create account</h1>
          <p className="text-postpurchase-muted text-sm font-light">Register a customer account to start shopping and tracking orders.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center whitespace-pre-line">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-bold text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative md:col-span-2">
              <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-postpurchase-muted" />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Full name"
                className="w-full pl-12 pr-4 py-4 rounded-postpurchase border border-postpurchase-border bg-postpurchase-card text-sm outline-none focus:ring-2 focus:ring-postpurchase-accent/20 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-postpurchase-muted" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-4 rounded-postpurchase border border-postpurchase-border bg-postpurchase-card text-sm outline-none focus:ring-2 focus:ring-postpurchase-accent/20 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-postpurchase-muted" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Phone number"
                className="w-full pl-12 pr-4 py-4 rounded-postpurchase border border-postpurchase-border bg-postpurchase-card text-sm outline-none focus:ring-2 focus:ring-postpurchase-accent/20 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-postpurchase-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 rounded-postpurchase border border-postpurchase-border bg-postpurchase-card text-sm outline-none focus:ring-2 focus:ring-postpurchase-accent/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-postpurchase-muted hover:text-postpurchase-accent transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-postpurchase-muted" />
              <input
                type={showRetypePassword ? "text" : "password"}
                value={form.retypePassword}
                onChange={(e) => updateField("retypePassword", e.target.value)}
                placeholder="Retype password"
                className="w-full pl-12 pr-12 py-4 rounded-postpurchase border border-postpurchase-border bg-postpurchase-card text-sm outline-none focus:ring-2 focus:ring-postpurchase-accent/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowRetypePassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-postpurchase-muted hover:text-postpurchase-accent transition-colors"
                aria-label={showRetypePassword ? "Hide retype password" : "Show retype password"}
              >
                {showRetypePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-postpurchase-muted" />
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-postpurchase border border-postpurchase-border bg-postpurchase-card text-sm outline-none focus:ring-2 focus:ring-postpurchase-accent/20 transition-all"
              />
            </div>

            <div className="relative">
              <VenusAndMars className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-postpurchase-muted" />
              <select
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-postpurchase border border-postpurchase-border bg-postpurchase-card text-sm outline-none focus:ring-2 focus:ring-postpurchase-accent/20 transition-all"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-postpurchase-accent text-white py-4 rounded-postpurchase font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-postpurchase-accent/20 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-postpurchase-muted uppercase tracking-widest font-bold">
          Already have an account? <Link to="/login" className="text-postpurchase-accent italic">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}