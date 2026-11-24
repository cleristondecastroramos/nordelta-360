import { ColaboradorResultados } from "@/lib/types";
import { Plus, Clock, Target, CheckCircle2, User } from "lucide-react";

interface DevelopmentPlanTableProps {
  planos: ColaboradorResultados["planoDesenvolvimento"];
}

export function DevelopmentPlanTable({ planos }: DevelopmentPlanTableProps) {
  const getPriorityStyle = (priority: string) => {
    if (priority === "Alta")
      return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50";
    if (priority === "Média")
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50";
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Concluído") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
    if (status === "Em Andamento") return <Clock className="h-3.5 w-3.5 text-amber-500" />;
    return <Minus className="h-3.5 w-3.5 text-slate-400" />;
  };

  const Minus = (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">Plano de Desenvolvimento Individual (PDI)</h3>
          <p className="text-sm text-muted-foreground">
            Ações táticas recomendadas com base nas oportunidades de melhoria identificadas no ciclo
            atual.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" /> Nova Ação de PDI
        </button>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold w-[20%]">Foco / Competência</th>
                <th className="px-4 py-4 font-semibold w-[40%]">Ação Recomendada</th>
                <th className="px-4 py-4 font-semibold text-center">Prioridade</th>
                <th className="px-4 py-4 font-semibold">Responsável</th>
                <th className="px-4 py-4 font-semibold text-center">Prazo</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {planos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhuma ação de desenvolvimento cadastrada para este colaborador.
                  </td>
                </tr>
              ) : (
                planos.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="font-medium text-foreground">{item.competencia}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300 leading-relaxed min-w-[250px]">
                      {item.acaoSugerida}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${getPriorityStyle(item.prioridade)}`}
                      >
                        {item.prioridade}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[120px]">{item.responsavel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-muted-foreground whitespace-nowrap">{item.prazo}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <select
                          className="w-full text-xs font-medium bg-transparent border border-input rounded-md py-1.5 pl-2 pr-6 focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                          defaultValue={item.status}
                        >
                          <option>Não Iniciado</option>
                          <option>Em Andamento</option>
                          <option>Concluído</option>
                        </select>
                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          {getStatusIcon(item.status)}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
