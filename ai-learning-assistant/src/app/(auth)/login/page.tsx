"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Basic components defined inline
const Button = ({ 
  children, 
  className = "", 
  onClick, 
  type, 
  disabled,
  variant
}) => (
  <button 
    type={type || "button"} 
    className={`px-4 py-2 ${variant === "outline" 
      ? "bg-white text-gray-800 border border-gray-300" 
      : "bg-blue-600 text-white"} rounded hover:bg-opacity-90 ${disabled ? 'opacity-50' : ''} ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Input = ({ 
  id, 
  placeholder, 
  type, 
  value, 
  onChange, 
  required 
}) => (
  <input
    id={id}
    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder={placeholder}
    type={type || "text"}
    value={value}
    onChange={onChange}
    required={required}
  />
);

const Label = ({ 
  htmlFor, 
  children 
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);

const Alert = ({ 
  variant, 
  children 
}) => (
  <div className={`p-4 rounded ${variant === "destructive" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
    {children}
  </div>
);

const AlertDescription = ({ 
  children 
}) => <div>{children}</div>;

// Simple Google icon replacement
const FcGoogle = () => (
  <span className="mr-2 inline-block">G</span>
);

// Import conditionally to prevent build errors
let supabase;
try {
  supabase = require("@/lib/supabase").supabase;
} catch (error) {
  console.error("Failed to import supabase, using placeholder", error);
  // Placeholder implementation
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signInWithPassword: async () => ({ data: null, error: { message: "Auth not available" } }),
      signInWithOAuth: async () => ({ error: { message: "Auth not available" } })
    }
  };
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check for an existing session on page load
  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Session check result:", data);
        
        if (data.session) {
          console.log("User already has a session, redirecting to:", redirectPath);
          // Directly redirect instead of showing the "already logged in" screen
          router.push(redirectPath);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkSession();
  }, [redirectPath, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign in with:", email);
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      if (data?.session) {
        console.log("Login successful, session created:", data.session.user.id);
        setSuccess("Login successful! Redirecting...");
        
        // Use a shorter timeout
        setTimeout(() => {
          console.log("Redirecting to:", redirectPath);
          router.push(redirectPath);
        }, 500);
      }
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      setError("Google login is not currently available. Please use email/password.");
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p>Please wait while we check your login status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[350px] space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <FcGoogle />
        Continue with Google
      </Button>
      
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

// Wrap with Suspense to handle useSearchParams CSR bailout
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading login form...</div>}>
      <LoginForm />
    </Suspense>
  );
} 