import { Lightbulb, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import type { InsightText } from "@/lib/types";

interface InsightPanelProps {
  insights: InsightText[];
}

export function InsightPanel({ insights }: InsightPanelProps) {
  const IconMap = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />,
    info: <Info className="h-5 w-5 text-blue-500 mt-0.5" />,
  };

  const BgMap = {
    success: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30",
    warning: "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30",
    info: "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30",
  };

  // Convert markdown bold to JSX
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 pb-4 border-b bg-muted/10 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="font-semibold leading-none tracking-tight">Insights Automatizados</h3>
      </div>
      <div className="p-6 flex-1 space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className={`p-4 rounded-lg border flex gap-3 ${BgMap[insight.tipo]}`}>
            {IconMap[insight.tipo]}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {renderText(insight.texto)}
            </p>
          </div>
        ))}
        {insights.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Coletando dados para gerar insights...
          </p>
        )}
      </div>
    </div>
  );
}
