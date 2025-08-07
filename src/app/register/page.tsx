"use client";

import { RegisterForm } from "@/components/auth-forms";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-purple-600">
      {" "}
      {/* Added gradient background */}
      <RegisterForm />
    </div>
  );
}
