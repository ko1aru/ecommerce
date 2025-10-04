"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function OAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    // const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      router.push("/");
    }
  }, [router, searchParams, setToken]);

  return <p className="p-6">Signing you in with Google...</p>;
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <OAuthCallbackInner />
    </Suspense>
  );
}