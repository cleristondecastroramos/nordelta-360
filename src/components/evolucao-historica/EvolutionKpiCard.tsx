import { ReactNode } from "react";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EvolutionKpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  tooltipTitle?: string;
  tooltipDesc?: string;
  className?: string;
  subtitle?: string;
}

export function EvolutionKpiCard({
  title,
  value,
  icon,
  trend,
  tooltipTitle,
  tooltipDesc,
  className = "",
  subtitle,
}: EvolutionKpiCardProps) {
  return (
    <div
      className={`rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-5 h-full ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          {title}
          {(tooltipTitle || tooltipDesc) && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] p-3 text-sm border-slate-200 dark:border-slate-800">
                  {tooltipTitle && (
                    <p className="font-semibold text-foreground mb-1">{tooltipTitle}</p>
                  )}
                  {tooltipDesc && <p className="text-muted-foreground">{tooltipDesc}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h3>
        <div className="text-primary/70">{icon}</div>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && (
            <span className="text-xs font-medium text-muted-foreground mt-0.5">{subtitle}</span>
          )}
        </div>

        {trend !== undefined && (
          <div
            className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${
              trend > 0
                ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30"
                : trend < 0
                  ? "text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30"
                  : "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
            ) : trend < 0 ? (
              <TrendingDown className="h-3.5 w-3.5 mr-1" />
            ) : (
              <Minus className="h-3.5 w-3.5 mr-1" />
            )}
            {trend > 0 ? "+" : ""}
            {trend.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
