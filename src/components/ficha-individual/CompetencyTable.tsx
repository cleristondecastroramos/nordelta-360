import { ColaboradorResultados } from "@/lib/types";

interface CompetencyTableProps {
  competencias: ColaboradorResultados["competencias"];
  isLideranca: boolean;
}

export function CompetencyTable({ competencias, isLideranca }: CompetencyTableProps) {
  // Define color for a score
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-emerald-600 dark:text-emerald-400 font-bold";
    if (score >= 3.5) return "text-primary dark:text-primary-foreground font-semibold";
    if (score >= 2.5) return "text-amber-600 dark:text-amber-400 font-medium";
    return "text-rose-600 dark:text-rose-400 font-bold";
  };

  const getScoreBg = (score: number) => {
    if (score >= 4.5) return "bg-emerald-50 dark:bg-emerald-950/30";
    if (score >= 3.5) return "";
    if (score >= 2.5) return "bg-amber-50 dark:bg-amber-950/30";
    return "bg-rose-50 dark:bg-rose-950/30";
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-6 pb-4 border-b">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">Tabela Analítica de Competências</h3>
        <p className="text-sm text-muted-foreground">Desdobramento completo das avaliações por perspectiva.</p>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Competência</th>
              <th className="px-4 py-4 font-semibold text-center border-l border-border/50">Auto</th>
              <th className="px-4 py-4 font-semibold text-center">Gestor</th>
              <th className="px-4 py-4 font-semibold text-center">Pares</th>
              {isLideranca && (
                <th className="px-4 py-4 font-semibold text-center">Time</th>
              )}
              <th className="px-4 py-4 font-extrabold text-center border-l border-border bg-muted/30">Média Geral</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {competencias.sort((a,b) => b.mediaGeral - a.mediaGeral).map((comp, idx) => (
              <tr key={comp.competencia} className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs font-mono w-4">{idx + 1}.</span>
                    {comp.competencia}
                  </div>
                </td>
                <td className="px-4 py-3 text-center border-l border-border/50 font-medium text-slate-600 dark:text-slate-400">
                  {comp.mediaAuto.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center font-medium text-slate-600 dark:text-slate-400">
                  {comp.mediaGestor.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center font-medium text-slate-600 dark:text-slate-400">
                  {comp.mediaPares.toFixed(2)}
                </td>
                {isLideranca && (
                  <td className="px-4 py-3 text-center font-medium text-slate-600 dark:text-slate-400">
                    {comp.mediaSubordinados?.toFixed(2) || "-"}
                  </td>
                )}
                <td className={`px-4 py-3 text-center border-l border-border ${getScoreBg(comp.mediaGeral)}`}>
                  <div className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm ${getScoreColor(comp.mediaGeral)}`}>
                    {comp.mediaGeral.toFixed(2)}
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
