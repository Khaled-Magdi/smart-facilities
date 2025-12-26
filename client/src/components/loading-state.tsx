import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({ message, className, size = "md" }: LoadingStateProps) {
  const { t } = useLanguage();
  
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 gap-4",
      className
    )}>
      <Loader2 className={cn("animate-spin text-primary", sizeStyles[size])} />
      <p className="text-sm text-muted-foreground">{message || t("loading")}</p>
    </div>
  );
}

export function LoadingSpinner({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 className={cn("animate-spin", sizeStyles[size], className)} />
  );
}
