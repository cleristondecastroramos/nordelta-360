import { MetricTooltip } from "./metric-tooltip";
import type { GapAnalysis } from "@/lib/types";

interface GapHeatmapProps {
  data: GapAnalysis[];
}

export function GapHeatmap({ data }: GapHeatmapProps) {
  // Extrair departamentos únicos e competências
  const departamentos = Array.from(new Set(data.map((d) => d.departamento))).sort();
  const competencias = Array.from(new Set(data.map((d) => d.competencia))).sort();

  // Cores corporativas premium (Sky/Azul para positivo, Rose/Vermelho para negativo)
  const getColorClasses = (gap: number) => {
    if (gap > 0.5) return "bg-sky-600 text-white border-sky-700";
    if (gap > 0.2) return "bg-sky-400 text-white border-sky-500";
    if (gap > 0.05)
      return "bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-900/30 dark:text-sky-100";
    if (gap > -0.05)
      return "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700";
    if (gap > -0.2)
      return "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-900/30 dark:text-rose-100";
    if (gap > -0.5) return "bg-rose-400 text-white border-rose-500";
    return "bg-rose-600 text-white border-rose-700";
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[800px] border rounded-xl p-6 bg-card shadow-sm">
        {/* Header (Departamentos) */}
        <div className="flex mb-2" style={{ paddingLeft: "210px" }}>
          {departamentos.map((depto) => (
            <div key={depto} className="flex-1 px-0.5 flex items-end justify-center h-20 pb-2">
              <div className="text-xs leading-tight font-medium text-muted-foreground text-center whitespace-normal break-words w-full">
                {depto}
              </div>
            </div>
          ))}
        </div>

        {/* Rows (Competências) */}
        <div className="space-y-1.5">
          {competencias.map((comp) => (
            <div
              key={comp}
              className="flex items-center hover:bg-muted/30 p-1 rounded-l-lg transition-colors"
            >
              <div
                className="w-[210px] pr-4 text-xs leading-tight font-medium text-right text-foreground line-clamp-2"
                title={comp}
              >
                {comp}
              </div>
              <div className="flex flex-1 gap-1.5">
                {departamentos.map((depto) => {
                  const cellData = data.find(
                    (d) => d.departamento === depto && d.competencia === comp,
                  );
                  const gap = cellData ? cellData.gap : 0;

                  return (
                    <div key={`${comp}-${depto}`} className="flex-1 relative">
                      <MetricTooltip
                        title={`${depto} - ${comp}`}
                        description={cellData?.descricao || "Competência do ciclo."}
                        calculation={`Autoavaliação vs Gestor: diferença de ${gap > 0 ? "+" : ""}${gap} pontos`}
                      >
                        <div
                          className={`w-full h-10 min-w-[40px] rounded-md flex items-center justify-center text-[11px] font-semibold cursor-help transition-all hover:scale-110 shadow-sm border ${getColorClasses(gap)}`}
                        >
                          {gap !== 0 ? (gap > 0 ? `+${gap}` : gap) : "-"}
                        </div>
                      </MetricTooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground bg-muted/40 p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-500 shadow-sm border border-rose-600"></div>
            <span>Autoavaliação superestima (Risco)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"></div>
            <span>Percepções Alinhadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sky-500 shadow-sm border border-sky-600"></div>
            <span>Gestor avalia melhor que Colaborador</span>
          </div>
        </div>
      </div>
    </div>
  );
}
