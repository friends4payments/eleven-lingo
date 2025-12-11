import { cn } from "@/lib/utils";

interface ShimmeringTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ShimmeringText({ children, className }: ShimmeringTextProps) {
  return (
    <span
      className={cn(
        "inline-block animate-shimmer bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[length:200%_100%] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
