import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:from-destructive/90 hover:to-destructive/80 hover:shadow-lg hover:shadow-destructive/25 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border-2 border-input bg-background/50 backdrop-blur-sm hover:bg-accent/80 hover:text-accent-foreground hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/80 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        ghost: 
          "hover:bg-accent/80 hover:text-accent-foreground hover:backdrop-blur-sm hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors",
        glass:
          "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        gradient:
          "bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 hover:scale-[1.02] active:scale-100",
        shine:
          "bg-primary text-primary-foreground relative overflow-hidden hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-10 text-base",
        xl: "h-16 rounded-2xl px-12 text-lg font-bold",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-13 w-13 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
