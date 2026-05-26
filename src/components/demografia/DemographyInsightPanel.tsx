import { InsightText } from "@/lib/types";
import { CheckCircle2, AlertTriangle, Info, Sparkles } from "lucide-react";

interface DemographyInsightPanelProps {
  insights: InsightText[];
}

export function DemographyInsightPanel({ insights }: DemographyInsightPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info": return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case "success": return "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50";
      case "warning": return "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50";
      case "info": return "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50";
      default: return "bg-muted border-border";
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold leading-none tracking-tight text-lg">Insights Automáticos</h3>
          <p className="text-sm text-muted-foreground mt-1">Análise inteligente da composição atual.</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-4 justify-center">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">Nenhum insight gerado para este recorte de dados.</p>
        ) : (
          insights.map((insight, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${getBgClass(insight.tipo)}`}
            >
              <div className="shrink-0 mt-0.5 bg-background rounded-full p-1 shadow-sm">
                {getIcon(insight.tipo)}
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground/90">
                {insight.texto}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
