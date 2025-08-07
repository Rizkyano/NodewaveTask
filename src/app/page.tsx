"use client";

import { useAuthStore } from "@/lib/authStore";
import { CreateTodoForm, TodoList } from "@/components/todo-components";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, clearAuth, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-100">
      {" "}
      {/* Adjusted background */}
      <div className="w-full max-w-lg flex justify-between items-center mb-8 p-4 bg-white shadow-md rounded-lg">
        {" "}
        {/* Added styling to header */}
        <h1 className="text-3xl font-extrabold text-blue-700">Welcome, {user?.email.split("@")[0] || "User"}!</h1>
        <Button variant="outline" onClick={handleLogout} className="rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors duration-200">
          {" "}
          {/* Styled logout button */}
          Logout
        </Button>
      </div>
      <div className="w-full max-w-lg space-y-8">
        <CreateTodoForm />
        <TodoList />
      </div>
    </main>
  );
}
