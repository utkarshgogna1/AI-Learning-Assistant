"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Define interfaces for component props
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: string;
}

interface InputProps {
  id: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

interface AlertProps {
  variant?: string;
  children: React.ReactNode;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
}

// Basic components defined inline
const Button = ({ 
  children, 
  className = "", 
  onClick, 
  type, 
  disabled,
  variant
}: ButtonProps) => (
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
}: InputProps) => (
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
}: LabelProps) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);

const Alert = ({ 
  variant = "default", 
  children 
}: AlertProps) => (
  <div className={`p-4 rounded ${variant === "destructive" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
    {children}
  </div>
);

const AlertDescription = ({ 
  children 
}: AlertDescriptionProps) => <div>{children}</div>;

// Simple Google icon replacement
const FcGoogle = () => (
  <span className="mr-2 inline-block">G</span>
);

// Import conditionally to prevent build errors
let supabase: any;
try {
  supabase = require("@/lib/supabase").supabase;
} catch (error) {
  console.error("Failed to import supabase, using placeholder", error);
  // Placeholder implementation
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: "Auth not available" } }),
      signInWithOAuth: async () => ({ error: { message: "Auth not available" } })
    },
    from: () => ({
      insert: async () => ({ error: { message: "Database not available" } })
    })
  };
}

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();

  // Check for an existing session on page load
  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log("Session check:", data);
        
        if (data.session) {
          console.log("Active session found");
          setHasSession(true);
        }
      } catch (err) {
        console.error("Session check error:", err);
      }
    }
    
    checkSession();
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    console.log("Attempting registration with email:", email);
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      console.log("Registration response:", data, error);
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        if (data.session) {
          // Create user profile in database
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email,
              full_name: name,
              created_at: new Date().toISOString(),
            });
            
          if (profileError) {
            console.error("Profile creation error:", profileError);
          }
          
          setSuccess("Registration successful! Redirecting to dashboard...");
          
          // Short timeout to show the success message
          setTimeout(() => {
            // Navigate to dashboard
            router.push("/dashboard");
          }, 500);
        } else {
          setSuccess("Registration successful! Please check your email to confirm your account before logging in.");
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("Attempting Google registration");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      console.log("Google registration response:", data, error);
      
      if (error) {
        throw error;
      }
      
      // No need to redirect here as OAuth will handle redirection
    } catch (error: any) {
      console.error("Google registration error:", error);
      setError("Google registration is not available. Please ensure it's configured in Supabase.");
      setIsLoading(false);
    }
  }

  if (hasSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">You are already logged in</h2>
          <p className="mb-4">Click below to go to your dashboard</p>
          <Button 
            onClick={() => router.push("/dashboard")}
            className="mx-auto"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[350px] space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your information to create an account
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
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
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
        onClick={handleGoogleRegister}
        disabled={isLoading}
      >
        <FcGoogle />
        Continue with Google
      </Button>
      
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

// Wrap with Suspense to handle useSearchParams CSR bailout
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading registration form...</div>}>
      <RegisterForm />
    </Suspense>
  );
} 