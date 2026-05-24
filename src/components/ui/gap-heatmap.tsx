import { MetricTooltip } from "./metric-tooltip";
import type { GapAnalysis } from "@/lib/types";

interface GapHeatmapProps {
  data: GapAnalysis[];
}

export function GapHeatmap({ data }: GapHeatmapProps) {
  // Extrair departamentos únicos e competências
  const departamentos = Array.from(new Set(data.map(d => d.departamento))).sort();
  const competencias = Array.from(new Set(data.map(d => d.competencia))).sort();

  // Função para determinar a cor baseada no gap (Gestor - Auto)
  // Gap positivo (Gestor avalia melhor que auto) = Verde
  // Gap negativo (Auto avalia melhor que gestor) = Vermelho/Laranja
  // Gap próximo a 0 = Cinza/Branco
  const getColorClasses = (gap: number) => {
    if (gap > 0.5) return "bg-emerald-500 text-white";
    if (gap > 0.2) return "bg-emerald-300 text-emerald-950";
    if (gap > 0.05) return "bg-emerald-100 text-emerald-900";
    if (gap > -0.05) return "bg-slate-100 dark:bg-slate-800 text-slate-500";
    if (gap > -0.2) return "bg-amber-100 text-amber-900";
    if (gap > -0.5) return "bg-amber-300 text-amber-950";
    return "bg-amber-500 text-white";
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[800px]">
        {/* Header (Competências) */}
        <div className="flex" style={{ paddingLeft: '150px' }}>
          {competencias.map(comp => (
            <div key={comp} className="flex-1 px-1 pb-2">
              <div className="text-xs font-medium text-muted-foreground rotate-45 transform origin-bottom-left whitespace-nowrap h-24 flex items-end">
                {comp.length > 15 ? comp.substring(0, 15) + '...' : comp}
              </div>
            </div>
          ))}
        </div>

        {/* Rows (Departamentos) */}
        <div className="space-y-1">
          {departamentos.map(depto => (
            <div key={depto} className="flex items-center">
              <div className="w-[150px] pr-4 text-sm font-medium text-right truncate" title={depto}>
                {depto}
              </div>
              <div className="flex flex-1 gap-1">
                {competencias.map(comp => {
                  const cellData = data.find(d => d.departamento === depto && d.competencia === comp);
                  const gap = cellData ? cellData.gap : 0;
                  
                  return (
                    <div key={`${depto}-${comp}`} className="flex-1 aspect-video relative group">
                      <MetricTooltip 
                        title={`Gap de ${depto} em ${comp}`}
                        description={gap > 0 
                          ? `Visão do gestor é maior que a autopercepção.` 
                          : gap < 0 
                            ? `Autopercepção é maior que a visão do gestor.` 
                            : `Gestor e autopercepção alinhados.`}
                        calculation={`Gestor - Autoavaliação = ${gap > 0 ? '+' : ''}${gap}`}
                      >
                        <div 
                          className={`w-full h-full rounded-sm flex items-center justify-center text-xs font-medium cursor-help transition-transform hover:scale-110 shadow-sm ${getColorClasses(gap)}`}
                        >
                          {gap !== 0 ? (gap > 0 ? `+${gap}` : gap) : '-'}
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
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-amber-500"></div> Subavaliado pelo Gestor</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-slate-100 border"></div> Alinhado</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-emerald-500"></div> Superavaliado pelo Gestor</div>
        </div>
      </div>
    </div>
  );
}
