import { ReactNode } from "react";
import { MetricTooltip } from "./metric-tooltip";
import { cn } from "@/lib/utils";

interface ExecutiveKpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  tooltipTitle: string;
  tooltipDesc: string;
  tooltipCalc?: string;
  className?: string;
}

export function ExecutiveKpiCard({
  title, value, icon, trend, tooltipTitle, tooltipDesc, tooltipCalc, className
}: ExecutiveKpiCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden group", className)}>
      <div className="flex flex-row items-center justify-between pb-2">
        <MetricTooltip title={tooltipTitle} description={tooltipDesc} calculation={tooltipCalc}>
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground hover:text-foreground cursor-help transition-colors border-b border-dashed border-muted-foreground/30">
            {title}
          </h3>
        </MetricTooltip>
        <div className="text-muted-foreground/50 group-hover:text-primary transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1 font-medium flex items-center gap-1", trend.positive ? "text-emerald-600" : "text-amber-600")}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
    </div>
  );
}
