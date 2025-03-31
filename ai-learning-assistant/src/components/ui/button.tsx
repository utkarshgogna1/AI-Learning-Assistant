import * as React from "react"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
  }
>(({ className, variant, size, ...props }, ref) => {
  const baseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  
  let variantClass = "bg-blue-500 text-white hover:bg-blue-600"
  if (variant === "destructive") variantClass = "bg-red-500 text-white hover:bg-red-600"
  if (variant === "outline") variantClass = "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
  if (variant === "secondary") variantClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  if (variant === "ghost") variantClass = "hover:bg-accent hover:text-accent-foreground"
  if (variant === "link") variantClass = "underline-offset-4 hover:underline text-primary"
  
  let sizeClass = "h-10 py-2 px-4"
  if (size === "sm") sizeClass = "h-9 px-3 rounded-md"
  if (size === "lg") sizeClass = "h-11 px-8 rounded-md"
  if (size === "icon") sizeClass = "h-10 w-10"
  
  const finalClassName = `${baseClass} ${variantClass} ${sizeClass} ${className || ''}`
  
  return (
    <button
      className={finalClassName}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button } 