import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        golden:
          "bg-primary-golden text-primary-foreground hover:bg-primary-golden/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-green-500 text-primary hover:bg-green-500/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  };

const Button = ({
  ref,
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  children,
  ...props
}: ButtonProps) => {
  if (asChild) {
    return (
      <Slot ref={ref} {...props}>
        <>
          {React.Children.map(
            children as React.ReactElement,
            (child: React.ReactElement) => {
              return React.cloneElement(child, {
                //@ts-expect-error false positive
                className: cn(buttonVariants({ variant, size }), className),
                children: (
                  <>
                    {isLoading && (
                      <Loader2
                        className={cn(
                          "h-4 w-4 animate-spin",
                          children && "mr-2"
                        )}
                      />
                    )}

                    {
                      //@ts-expect-error false positive
                      child.props.children
                    }
                  </>
                ),
              });
            }
          )}
        </>
      </Slot>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      ref={ref}
      {...props}
    >
      {isLoading && (
        <Loader2 className={cn("h-4 w-4 animate-spin", children && "mr-2")} />
      )}
      {children}
    </button>
  );
};

export { Button, buttonVariants };