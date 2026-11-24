import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertPanelProps {
  title: string;
  items: string[];
  type?: "info" | "warning" | "error" | "success";
  className?: string;
}

export function AlertPanel({ title, items, type = "warning", className }: AlertPanelProps) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-900/10 dark:border-blue-900/50 dark:text-blue-400",
    warning:
      "border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-900/10 dark:border-amber-900/50 dark:text-amber-400",
    error: "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/10",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/10 dark:border-emerald-900/50 dark:text-emerald-400",
  };

  const IconMap = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle2,
  };

  const Icon = IconMap[type];

  return (
    <div className={cn("rounded-xl border shadow-sm p-5", styles[type], className)}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5" />
        <div>
          <h4 className="font-semibold text-base">{title}</h4>
          {items.length > 0 ? (
            <ul className="mt-2 space-y-1.5 text-sm opacity-90">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm opacity-90">Nenhum alerta registrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
