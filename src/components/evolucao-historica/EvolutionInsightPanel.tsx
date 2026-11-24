import { InsightText } from "@/lib/types";
import { CheckCircle2, AlertTriangle, Info, Lightbulb } from "lucide-react";

interface EvolutionInsightPanelProps {
  insights: InsightText[];
}

export function EvolutionInsightPanel({ insights }: EvolutionInsightPanelProps) {
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStyle = (tipo: string) => {
    switch (tipo) {
      case "success":
        return "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50";
      case "warning":
        return "bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/50";
      case "info":
        return "bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50";
      default:
        return "bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800";
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6">
      <div className="mb-5 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold text-lg">Leitura Executiva Automática</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border flex gap-3.5 items-start ${getStyle(insight.tipo)}`}
          >
            <div className="shrink-0 mt-0.5">{getIcon(insight.tipo)}</div>
            <p className="text-sm font-medium leading-relaxed text-foreground/90">
              {insight.texto}
            </p>
          </div>
        ))}
        {insights.length === 0 && (
          <div className="p-6 text-center text-muted-foreground border border-dashed rounded-lg">
            Aguardando mais ciclos para gerar a leitura executiva de tendências.
          </div>
        )}
      </div>
    </div>
  );
}
