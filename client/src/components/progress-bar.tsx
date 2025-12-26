import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({ value, className, showLabel = true, size = "md" }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const getColorClass = (val: number) => {
    if (val >= 80) return "bg-green-500 dark:bg-green-400";
    if (val >= 50) return "bg-blue-500 dark:bg-blue-400";
    if (val >= 25) return "bg-amber-500 dark:bg-amber-400";
    return "bg-gray-400 dark:bg-gray-500";
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "flex-1 overflow-hidden rounded-full bg-secondary",
        sizeStyles[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getColorClass(clampedValue)
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground min-w-[40px] text-end">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
