"use client";

import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/redux/apis/auth.api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().regex(/^\d{10,15}$/, "Please enter a valid mobile number")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
};

export default function RegisterPage() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const { showSuccess, showError } = useToast();
   
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await signup(data).unwrap();
      showSuccess("Registration successful! Please login.");
      router.push("/login");
    } catch (error: unknown) {
      showError(getApiErrorMessage(error, "Registration failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Sign up to get started
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              className={cn(
                "input",
                errors.name && "input-error"
              )}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={cn(
                "input",
                errors.email && "input-error"
              )}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              {...register("mobile")}
              className={cn(
                "input",
                errors.mobile && "input-error"
              )}
            />
            {errors.mobile && (
              <p className="text-xs text-destructive mt-1">{errors.mobile.message}</p>
            )}
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={cn(
                "input",
                errors.password && "input-error"
              )}
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <Button 
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary hover:text-primary/90">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
