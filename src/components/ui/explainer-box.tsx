import { Info } from "lucide-react";
import { MetricTooltip } from "./metric-tooltip";

interface ExplainerBoxProps {
  title: string;
  description: string;
  className?: string;
}

export function ExplainerBox({ title, description, className }: ExplainerBoxProps) {
  return (
    <div
      className={`p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3 ${className || ""}`}
    >
      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium text-blue-900 dark:text-blue-300 text-sm mb-1">{title}</h4>
        <p className="text-sm text-blue-800/80 dark:text-blue-400/80 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
