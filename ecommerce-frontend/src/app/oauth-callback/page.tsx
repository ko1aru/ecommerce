"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuth();

  useEffect(() => {
    // const token = searchParams.get("token");
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      router.push("/");
    }
  }, [router, searchParams, setToken]);

  return <p className="p-6">Signing you in with Google...</p>;
}
