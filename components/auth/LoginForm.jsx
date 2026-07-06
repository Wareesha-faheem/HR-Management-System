"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthContext from "@/contexts/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const DEMO_ACCOUNTS = [
  { role: "Super Admin", email: "syedsaqibali@kuickpay.com" },
  { role: "HR", email: "sana.riaz@kuickpay.com" },
  { role: "Manager", email: "moizpasha@kuickpay.com" },
  { role: "Employee", email: "usmanbhai@kuickpay.com" },
];

export default function LoginForm() {
  const router = useRouter();
  const { login, user, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [loading, user, router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 400)); // simulate network latency

    const result = login(formData.email, formData.password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error === "Invalid credentials"
        ? "Invalid email or password. Every seed account uses password123."
        : result.error);
      return;
    }
    router.push("/dashboard");
  }

  function fillDemo(email) {
    setFormData({ email, password: "password123" });
    setError("");
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy-950">
        <Loader2 className="h-8 w-8 animate-spin text-brand-light" />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-navy-950 px-4 py-4">
      {/* Ambient gradient backdrop */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-dark/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-brand-light/30 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-4xl max-h-[94vh] overflow-hidden rounded-xl2 border border-white/10 shadow-glass lg:grid-cols-2">
        {/* Brand panel */}
        <div className="hidden flex-col justify-between bg-brand-gradient p-8 text-white lg:flex">
          <div className="flex items-center gap-2.5">
            <img src="/logo-mark.png" alt="Kuickpay" className="h-9 w-9 rounded-xl" />
            <span className="text-lg font-bold">kuickpay</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display leading-tight">
              People operations,
              <br /> built for how Kuickpay
              <br /> actually works.
            </h2>
            <p className="mt-3 text-sm text-white/75 max-w-sm">
              Attendance, leave, payroll and recruitment in one place —
              built by the team, for the team.
            </p>
          </div>

          <p className="text-xs text-white/50">© {new Date().getFullYear()} Kuickpay. Internal prototype.</p>
        </div>

        {/* Form panel */}
        <div className="glass-panel flex flex-col justify-center overflow-y-auto p-6 sm:p-8 bg-surface">
          <div className="mb-5 lg:hidden flex items-center gap-2.5">
            <img src="/logo-mark.png" alt="Kuickpay" className="h-9 w-9 rounded-xl" />
            <span className="text-lg font-bold text-primary">kuickpay</span>
          </div>

          <h1 className="text-xl font-bold font-display text-primary">Welcome back</h1>
          <p className="mt-1 text-sm text-secondary">Sign in to access the HRMS.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <Input
              label="Work email"
              name="email"
              type="email"
              placeholder="you@kuickpay.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-secondary hover:text-primary"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-500">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={submitting}>
              Sign in
            </Button>
          </form>

          <div className="mt-5">
            <p className="text-xs font-medium text-secondary mb-2">Quick demo access</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc.email)}
                  className="rounded-lg border border-[rgb(var(--border-subtle))] bg-surface-2 px-3 py-1.5 text-left text-xs hover:border-brand transition-colors"
                >
                  <p className="font-medium text-primary">{acc.role}</p>
                  <p className="text-secondary truncate">{acc.email}</p>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-secondary">Password for every demo account: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
