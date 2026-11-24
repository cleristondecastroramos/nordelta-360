import { DepartmentEvolution } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface EvolutionTableProps {
  data: DepartmentEvolution[];
}

export function EvolutionTable({ data }: EvolutionTableProps) {
  // Sort alphabetically by default
  const sortedData = [...data].sort((a, b) => a.departamento.localeCompare(b.departamento));

  if (!sortedData || sortedData.length === 0) return null;

  const ciclos = sortedData[0].ciclos.map((c) => c.ciclo);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">
          Detalhamento Histórico por Área
        </h3>
        <p className="text-sm text-muted-foreground">
          Tabela matriz com os resultados finais em cada ciclo.
        </p>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Departamento</th>
              {ciclos.map((c) => (
                <th
                  key={c}
                  className="px-4 py-4 font-semibold text-center border-l border-border/50"
                >
                  {c}
                </th>
              ))}
              <th className="px-4 py-4 font-extrabold text-center border-l border-border bg-muted/30">
                Variação Total
              </th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.map((d) => (
              <tr key={d.departamento} className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                  {d.departamento}
                </td>

                {d.ciclos.map((c, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-3 text-center border-l border-border/50 text-slate-600 dark:text-slate-400"
                  >
                    {c.media.toFixed(2)}
                  </td>
                ))}

                <td className="px-4 py-3 text-center border-l border-border bg-muted/10">
                  <span
                    className={`font-bold ${
                      d.variacao > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : d.variacao < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {d.variacao > 0 ? "+" : ""}
                    {d.variacao.toFixed(2)}
                  </span>
                </td>

                <td className="px-6 py-3 text-center">
                  <div
                    className={`inline-flex items-center justify-center p-1.5 rounded-md ${
                      d.tendencia === "up"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : d.tendencia === "down"
                          ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    }`}
                  >
                    {d.tendencia === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : d.tendencia === "down" ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <Minus className="h-4 w-4" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
