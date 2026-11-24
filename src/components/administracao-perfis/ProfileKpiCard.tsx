import { ReactNode } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileKpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  tooltipTitle?: string;
  tooltipDesc?: string;
  className?: string;
  highlight?: boolean;
}

export function ProfileKpiCard({
  title,
  value,
  icon,
  tooltipTitle,
  tooltipDesc,
  className = "",
  highlight = false,
}: ProfileKpiCardProps) {
  return (
    <div
      className={`rounded-xl border shadow-sm flex flex-col p-5 h-full ${highlight ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`tracking-tight text-sm font-medium flex items-center gap-1.5 ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}
        >
          {title}
          {(tooltipTitle || tooltipDesc) && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    className={`h-3.5 w-3.5 cursor-help transition-colors ${highlight ? "text-primary-foreground/60 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] p-3 text-sm border-slate-200 dark:border-slate-800 bg-background text-foreground">
                  {tooltipTitle && <p className="font-semibold mb-1">{tooltipTitle}</p>}
                  {tooltipDesc && <p className="text-muted-foreground">{tooltipDesc}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h3>
        <div className={highlight ? "text-primary-foreground/80" : "text-primary/70"}>{icon}</div>
      </div>
      <div className="text-3xl font-extrabold mt-auto">{value}</div>
    </div>
  );
}
