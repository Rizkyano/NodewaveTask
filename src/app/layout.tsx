"use client"; // This is a client component

import { Inter } from "next/font/google";
import "./globals.css"; // Your global CSS file (Tailwind directives)
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "sonner"; // Sonner for toasts
import { useAuthStore } from "@/lib/authStore";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth state from localStorage on app load
    initializeAuth();
  }, [initializeAuth]);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        {" "}
        {/* Added global background and text color */}
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster richColors position="top-right" /> {/* Sonner Toaster */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
