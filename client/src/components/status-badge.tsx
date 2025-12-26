import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Status = "active" | "on_hold" | "completed" | "cancelled" | "pending" | "ordered" | "received";
type Phase = "creation" | "visit" | "procurement" | "installation" | "maintenance";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

interface PhaseBadgeProps {
  phase: Phase;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  on_hold: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  ordered: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  received: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const phaseStyles: Record<Phase, string> = {
  creation: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  visit: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  procurement: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  installation: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  maintenance: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useLanguage();
  
  const statusLabels: Record<Status, string> = {
    active: t("active"),
    completed: t("completed"),
    on_hold: t("onHold"),
    cancelled: t("cancelled"),
    pending: t("pending"),
    ordered: t("ordered"),
    received: t("received"),
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "font-medium border-0",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </Badge>
  );
}

export function PhaseBadge({ phase, className }: PhaseBadgeProps) {
  const { t } = useLanguage();
  
  const phaseLabels: Record<Phase, string> = {
    creation: t("creation"),
    visit: t("visit"),
    procurement: t("procurement"),
    installation: t("installation"),
    maintenance: t("maintenance"),
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "font-medium border-0",
        phaseStyles[phase],
        className
      )}
    >
      {phaseLabels[phase]}
    </Badge>
  );
}
