// Basic UI components for fallback use during build errors
import React from 'react';

export const Button = ({ 
  children, 
  className = "", 
  onClick, 
  type, 
  disabled,
  variant
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: string;
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

export const Input = ({ 
  id, 
  placeholder, 
  type, 
  value, 
  onChange, 
  required 
}: {
  id: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
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

export const Label = ({ 
  htmlFor, 
  children 
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);

export const Alert = ({ 
  variant, 
  children 
}: {
  variant?: "destructive" | "default";
  children: React.ReactNode;
}) => (
  <div className={`p-4 rounded ${variant === "destructive" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
    {children}
  </div>
);

export const AlertDescription = ({ 
  children 
}: {
  children: React.ReactNode;
}) => <div>{children}</div>;

// Simple Google icon replacement
export const FcGoogle = () => (
  <span className="mr-2 inline-block">G</span>
);

// Additional components can be added as needed 