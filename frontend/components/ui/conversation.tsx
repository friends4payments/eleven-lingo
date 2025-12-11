"use client";

import { useStickToBottom } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";

interface ConversationProps {
  children: React.ReactNode;
  className?: string;
}

export const Conversation = forwardRef<HTMLDivElement, ConversationProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full flex-col overflow-y-auto scroll-smooth",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Conversation.displayName = "Conversation";

interface ConversationContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ConversationContent({
  children,
  className,
}: ConversationContentProps) {
  const { scrollableRef, isAtBottom } = useStickToBottom<HTMLDivElement>();
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    setShowScrollButton(!isAtBottom);
  }, [isAtBottom]);

  // Auto-scroll al último mensaje solo si el usuario está en el fondo
  useEffect(() => {
    // Solo hacer scroll automático si el usuario está al fondo
    if (scrollableRef?.current && isAtBottom) {
      // Usar requestAnimationFrame para asegurar que el DOM esté actualizado
      requestAnimationFrame(() => {
        if (scrollableRef?.current) {
          scrollableRef.current.scrollTo({
            top: scrollableRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    }
  }, [children, scrollableRef, isAtBottom]);

  const scrollToBottom = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({
        top: scrollableRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex-1">
      <div
        ref={scrollableRef}
        className={cn(
          "h-full overflow-y-auto scroll-smooth px-4 py-6",
          className
        )}
      >
        <div className="mx-auto max-w-3xl space-y-4">{children}</div>
      </div>
      {showScrollButton && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-lg"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface ConversationEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function ConversationEmptyState({
  title = "No messages yet",
  description = "Start a conversation by sending a message",
  icon,
  action,
}: ConversationEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
