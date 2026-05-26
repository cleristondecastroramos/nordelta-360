import { ReactNode } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DepartmentKpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  tooltipTitle?: string;
  tooltipDesc?: string;
  className?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function DepartmentKpiCard({
  title,
  value,
  icon,
  tooltipTitle,
  tooltipDesc,
  className = "",
  trend,
}: DepartmentKpiCardProps) {
  return (
    <div className={`rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 ${className}`}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          {title}
          {(tooltipTitle || tooltipDesc) && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] p-3 shadow-xl border-slate-200 dark:border-slate-800 text-sm">
                  {tooltipTitle && <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{tooltipTitle}</p>}
                  {tooltipDesc && <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{tooltipDesc}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h3>
        <div className="p-2 bg-primary/5 rounded-full text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <span className={`text-xs font-semibold ${trend.positive ? "text-emerald-500" : "text-rose-500"}`}>
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
