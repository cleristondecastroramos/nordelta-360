import { DepartmentStats } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepartmentRankingTableProps {
  departamentos: DepartmentStats[];
  selectedDepartment: string | null;
  onSelectDepartment: (dept: string) => void;
}

export function DepartmentRankingTable({
  departamentos,
  selectedDepartment,
  onSelectDepartment,
}: DepartmentRankingTableProps) {
  // Calculate max values for progress bars
  const maxMedia = Math.max(...departamentos.map((d) => d.media));

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 pb-4 border-b">
        <h3 className="font-semibold leading-none tracking-tight text-lg">
          Ranking Analítico por Área
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          Desempenho consolidado comparado ao potencial e gap.
        </p>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-4 py-3 font-semibold">Departamento</th>
              <th className="px-4 py-3 font-semibold text-center">Desempenho</th>
              <th className="px-4 py-3 font-semibold text-center">Potencial</th>
              <th className="px-4 py-3 font-semibold text-center hidden md:table-cell">
                Gap (Gestor x Auto)
              </th>
              <th className="px-4 py-3 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {departamentos.map((depto, index) => {
              const isSelected = selectedDepartment === depto.departamento;
              const gapIsNegative = depto.gapMedio < 0; // Auto avaliação maior que gestor
              const gapColor = gapIsNegative
                ? "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
                : depto.gapMedio > 0
                  ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400";

              return (
                <tr
                  key={depto.departamento}
                  onClick={() => onSelectDepartment(depto.departamento)}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"}`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${index < 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className="font-medium truncate max-w-[120px] sm:max-w-[180px] lg:max-w-[200px]"
                        title={depto.departamento}
                      >
                        {depto.departamento}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 min-w-[120px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold">{depto.media.toFixed(2)}</span>
                        <span className="text-muted-foreground text-[10px]">/ 5.00</span>
                      </div>
                      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${(depto.media / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                      {depto.potencial.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center hidden md:table-cell">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-semibold ${gapColor}`}
                    >
                      {depto.gapMedio > 0 ? "+" : ""}
                      {depto.gapMedio.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={`text-xs transition-colors h-8 ${isSelected ? "" : "opacity-0 group-hover:opacity-100 focus:opacity-100"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDepartment(depto.departamento);
                        // Delay scroll slightly to ensure radar chart is rendered/updated if it wasn't selected
                        setTimeout(() => {
                          document
                            .getElementById("department-details")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }, 50);
                      }}
                    >
                      Analisar <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
