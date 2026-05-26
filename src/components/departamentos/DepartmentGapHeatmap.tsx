import { GapAnalysis } from "@/lib/types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DepartmentGapHeatmapProps {
  data: GapAnalysis[];
}

export function DepartmentGapHeatmap({ data }: DepartmentGapHeatmapProps) {
  // Extract unique departments and competencies
  const departments = Array.from(new Set(data.map(d => d.departamento))).sort();
  const competencies = Array.from(new Set(data.map(d => d.competencia))).sort();

  // Create a mapping for quick lookup
  const gapMap = new Map();
  data.forEach(d => {
    gapMap.set(`${d.departamento}-${d.competencia}`, d.gap);
  });

  // Determine color based on gap value
  const getGapColor = (gap: number) => {
    if (gap > 0.3) return "bg-emerald-600 text-white";
    if (gap > 0.1) return "bg-emerald-400 text-slate-900";
    if (gap > -0.1) return "bg-slate-100 dark:bg-slate-800 text-slate-500";
    if (gap > -0.3) return "bg-amber-400 text-slate-900";
    return "bg-rose-600 text-white";
  };

  const getGapExplanation = (gap: number) => {
    if (gap > 0.3) return "Gestor avalia substancialmente melhor que a Autoavaliação (Síndrome do Impostor).";
    if (gap > 0.1) return "Gestor avalia levemente melhor que a Autoavaliação.";
    if (gap > -0.1) return "Visões perfeitamente alinhadas.";
    if (gap > -0.3) return "Autoavaliação levemente superior à do Gestor.";
    return "Autoavaliação substancialmente superior à do Gestor (Efeito Dunning-Kruger / Superestimativa).";
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 pb-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">Heatmap de Gaps (Gestor vs Auto)</h3>
            <p className="text-sm text-muted-foreground">Mapeamento do desalinhamento de percepção entre líder e liderado.</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium bg-muted/50 p-2 rounded-lg">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-600"></div> Gestor &gt; Auto</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700"></div> Alinhados</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-rose-600"></div> Auto &gt; Gestor</div>
          </div>
        </div>
      </div>
      
      <div className="p-0 overflow-auto custom-scrollbar flex-1">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-muted-foreground bg-muted/30 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold border-b border-r bg-muted/50 sticky left-0 z-20 min-w-[180px]">Departamento</th>
              {competencies.map(comp => (
                <th key={comp} className="px-4 py-4 font-medium text-center border-b min-w-[100px]">
                  <div className="truncate max-w-[100px] mx-auto" title={comp}>
                    {comp.split(" ")[0]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, idx) => (
              <tr key={dept} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                <td className="px-6 py-3 font-medium border-r sticky left-0 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  {dept}
                </td>
                {competencies.map(comp => {
                  const gap = gapMap.get(`${dept}-${comp}`) || 0;
                  return (
                    <td key={comp} className="p-1.5">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`w-full h-10 rounded-md flex items-center justify-center font-semibold text-xs cursor-crosshair transition-colors hover:ring-2 hover:ring-primary hover:ring-offset-1 dark:hover:ring-offset-slate-950 ${getGapColor(gap)}`}>
                              {gap > 0 ? "+" : ""}{gap.toFixed(2)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="p-3 shadow-xl border-slate-200 dark:border-slate-800">
                            <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{dept} - {comp}</p>
                            <p className="text-sm font-bold mb-2">Gap: <span className={gap < 0 ? "text-rose-500" : "text-emerald-500"}>{gap.toFixed(2)}</span></p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-[200px] leading-relaxed">
                              {getGapExplanation(gap)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
