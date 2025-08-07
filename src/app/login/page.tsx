"use client";

import { LoginForm } from "@/components/auth-forms";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-purple-600">
      {" "}
      {/* Added gradient background */}
      <LoginForm />
    </div>
  );
}
