import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Inertia } from "@inertiajs/inertia";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // React Hook Form setup

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    // Clear any previous error
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/login", {
        email: data.email,
        password: data.password,
      });

      // Handle successful login (e.g., redirect, set user state, etc.)
      console.log("Login successful:", response);
      if (response.data.redirect) {
        // Redirect using Inertia's client-side navigation
        Inertia.visit(response.data.redirect);
      }
    } catch (err) {
      // Handle error (e.g., display error message)
      setError("Invalid email or password.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Email Input */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email.message}</span>
                )}
              </div>

              {/* Password Input */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <span className="text-sm text-red-500">{errors.password.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Login with Google */}
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>

            {/* Display any form submission errors */}
            {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

            {/* Signup Link */}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
