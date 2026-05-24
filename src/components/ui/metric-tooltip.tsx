import { Info } from "lucide-react";
import { ReactNode } from "react";

interface MetricTooltipProps {
  title: string;
  description: string;
  calculation?: string;
  children: ReactNode;
}

export function MetricTooltip({ title, description, calculation, children }: MetricTooltipProps) {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden w-64 -translate-x-1/2 flex-col rounded-md bg-slate-900 p-3 text-sm text-slate-50 opacity-0 shadow-lg transition-opacity group-hover:flex group-hover:opacity-100 dark:bg-slate-800 pointer-events-none">
        <div className="font-semibold mb-1 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-blue-400" />
          {title}
        </div>
        <p className="text-slate-300 text-xs leading-relaxed mb-2">{description}</p>
        {calculation && (
          <div className="mt-auto border-t border-slate-700/50 pt-1.5 text-[10px] text-slate-400 font-mono">
            Cálculo: {calculation}
          </div>
        )}
        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900 dark:bg-slate-800" />
      </div>
    </div>
  );
}
