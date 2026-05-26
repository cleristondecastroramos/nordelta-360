import { ReactNode } from "react";
import { Info, Target, Medal, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmployeeKpiStripProps {
  notaMedia: number;
  percentil: number;
  indicePotencial: number;
  gapGestorAuto: number;
  ciclosParticipados: number;
  evolucaoCicloAnterior?: number;
}

export function EmployeeKpiStrip({
  notaMedia,
  percentil,
  indicePotencial,
  gapGestorAuto,
  ciclosParticipados,
  evolucaoCicloAnterior = 0
}: EmployeeKpiStripProps) {

  const KpiBox = ({ title, value, icon, tooltip, trend }: { title: string, value: string, icon: ReactNode, tooltip: string, trend?: {val: number, label: string} }) => (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          {title}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px] p-3 text-sm border-slate-200 dark:border-slate-800">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <div className="text-primary/70">{icon}</div>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md ${
            trend.val > 0 ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30" : 
            trend.val < 0 ? "text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30" : 
            "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800"
          }`}>
            {trend.val > 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : trend.val < 0 ? <ArrowDownRight className="h-3 w-3 mr-0.5" /> : <Minus className="h-3 w-3 mr-0.5" />}
            {Math.abs(trend.val).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
      <KpiBox 
        title="Nota Média 360°" 
        value={notaMedia.toFixed(2)} 
        icon={<Target className="h-5 w-5" />} 
        tooltip="Média ponderada de todos os grupos avaliadores (Gestor, Auto, Pares e Subordinados)."
        trend={evolucaoCicloAnterior ? { val: evolucaoCicloAnterior, label: "vs Ciclo Anterior" } : undefined}
      />
      <KpiBox 
        title="Percentil" 
        value={`${percentil}%`} 
        icon={<Medal className="h-5 w-5" />} 
        tooltip="Posição relativa deste colaborador em relação a toda a empresa. Um percentil 80% indica que ele está acima de 80% da companhia."
      />
      <KpiBox 
        title="Índice de Potencial" 
        value={`${indicePotencial}%`} 
        icon={<TrendingUp className="h-5 w-5" />} 
        tooltip="Métrica calculada a partir de competências comportamentais críticas para sucessão e inovação."
      />
      <KpiBox 
        title="Gap Gestor x Auto" 
        value={gapGestorAuto > 0 ? `+${gapGestorAuto.toFixed(2)}` : gapGestorAuto.toFixed(2)} 
        icon={<AlertTriangle className="h-5 w-5" />} 
        tooltip="Diferença entre a nota do Gestor e a Autoavaliação. Gaps negativos muito altos indicam que o colaborador superestima sua performance."
      />
      <div className="rounded-xl border bg-primary text-primary-foreground shadow-sm p-5 flex flex-col justify-center items-center text-center lg:col-span-1 col-span-2">
        <h3 className="tracking-tight text-sm font-medium text-primary-foreground/80 mb-1">Participação</h3>
        <div className="text-3xl font-extrabold">{ciclosParticipados}</div>
        <p className="text-xs text-primary-foreground/70 font-medium mt-1 uppercase tracking-wider">Ciclos Concluídos</p>
      </div>
    </div>
  );
}
