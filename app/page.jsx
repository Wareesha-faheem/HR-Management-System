"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/contexts/AuthContext";

export default function RootPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-navy-950">
      <div className="h-10 w-10 rounded-xl bg-brand-gradient animate-pulse shadow-glow-brand" />
    </div>
  );
}
