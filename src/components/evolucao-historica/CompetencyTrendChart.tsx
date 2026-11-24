import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CompetencyEvolution } from "@/lib/types";

interface CompetencyTrendChartProps {
  data: CompetencyEvolution[];
}

export function CompetencyTrendChart({ data }: CompetencyTrendChartProps) {
  // Get top 3 increasing and top 3 decreasing
  const increasing = [...data]
    .filter((d) => d.variacao > 0)
    .sort((a, b) => b.variacao - a.variacao)
    .slice(0, 3);
  const decreasing = [...data]
    .filter((d) => d.variacao < 0)
    .sort((a, b) => a.variacao - b.variacao)
    .slice(0, 3);

  const renderTrendBox = (comp: CompetencyEvolution, isPositive: boolean) => (
    <div
      key={comp.competencia}
      className="flex justify-between items-center bg-card p-3.5 rounded-lg border shadow-sm group hover:border-primary/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-md ${isPositive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"}`}
        >
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
        <div>
          <span className="font-semibold text-sm text-foreground">{comp.competencia}</span>
          <div className="flex items-center gap-2 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              {comp.ciclos[0].ciclo}
            </span>
            <Minus className="h-2 w-2 text-muted-foreground" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              {comp.ciclos[comp.ciclos.length - 1].ciclo}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <span
          className={`font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
        >
          {isPositive ? "+" : ""}
          {comp.variacao.toFixed(2)}
        </span>
        <div className="text-xs text-muted-foreground font-medium">pts</div>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full">
      <div className="mb-6 flex items-start gap-3">
        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">
            Matriz de Aceleração
          </h3>
          <p className="text-sm text-muted-foreground">
            O que está impulsionando ou limitando a empresa.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 h-full">
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 border-b border-emerald-100 dark:border-emerald-900 pb-2">
            Em Aceleração (Top 3)
          </h4>
          {increasing.length > 0 ? (
            increasing.map((c) => renderTrendBox(c, true))
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 border border-dashed rounded-lg text-muted-foreground text-sm text-center">
              Nenhuma competência em crescimento significativo no período.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 border-b border-rose-100 dark:border-rose-900 pb-2">
            Em Declínio (Top 3)
          </h4>
          {decreasing.length > 0 ? (
            decreasing.map((c) => renderTrendBox(c, false))
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 border border-dashed rounded-lg text-muted-foreground text-sm text-center">
              Nenhuma competência em declínio no período.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
