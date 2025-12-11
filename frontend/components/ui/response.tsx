import { cn } from "@/lib/utils";

interface ResponseProps {
  children: React.ReactNode;
  className?: string;
}

export function Response({ children, className }: ResponseProps) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      {children}
    </div>
  );
}
