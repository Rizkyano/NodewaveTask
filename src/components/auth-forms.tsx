"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { login, register } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Login Form Schema
const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const response = await login(values);
      setAuth(response.token, response.user);
      toast.success("Login successful!");
      router.push("/"); // Redirect to home/todo list page
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg rounded-lg">
      <CardHeader className="text-center pt-8 pb-4">
        <CardTitle className="text-3xl font-bold text-gray-800">Login</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    {/* Pastikan hanya ada satu elemen di sini */}
                    <Input placeholder="m@example.com" {...field} className="rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    {/* Pastikan hanya ada satu elemen di sini */}
                    <Input type="password" placeholder="******" {...field} className="rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Button variant="link" onClick={() => router.push("/register")} className="text-blue-600 hover:text-blue-800 p-0 h-auto underline">
            Register
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}

// Register Form Schema
const registerFormSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    fullname: z.string().min(1, { message: "Full name is required." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      const { email, fullname, password } = values;
      const response = await register({ email, fullname, password });
      setAuth(response.token, response.user);
      toast.success("Registration successful! You are now logged in.");
      router.push("/"); // Redirect to home/todo list page
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg rounded-lg">
      <CardHeader className="text-center pt-8 pb-4">
        <CardTitle className="text-3xl font-bold text-gray-800">Register</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    {/* Pastikan hanya ada satu elemen di sini */}
                    <Input placeholder="m@example.com" {...field} className="rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    {/* Pastikan hanya ada satu elemen di sini */}
                    <Input placeholder="John Doe" {...field} className="rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    {/* Pastikan hanya ada satu elemen di sini */}
                    <Input type="password" placeholder="******" {...field} className="rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                  <FormControl>
                    {/* Pastikan hanya ada satu elemen di sini */}
                    <Input type="password" placeholder="******" {...field} className="rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Button variant="link" onClick={() => router.push("/login")} className="text-blue-600 hover:text-blue-800 p-0 h-auto underline">
            Login
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
