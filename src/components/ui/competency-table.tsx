import type { CompetenciaScore } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getCompetenceInfo } from "@/lib/competence-map";
import { MetricTooltip } from "./metric-tooltip";

interface CompetencyTableProps {
  competencias: CompetenciaScore[];
}

export function CompetencyTable({ competencias }: CompetencyTableProps) {
  // Sort alphabetically by default
  const sorted = [...competencias].sort((a, b) => a.competencia.localeCompare(b.competencia));

  const getTrendIcon = (media: number, geral: number) => {
    if (media === 0) return <Minus className="h-4 w-4 text-muted-foreground/50" />;
    if (media > geral) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    if (media < geral) return <TrendingDown className="h-4 w-4 text-amber-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 font-medium text-muted-foreground border-b">
            <tr>
              <th className="p-4 whitespace-nowrap min-w-[300px]">Competência</th>
              <th className="p-4 whitespace-nowrap">Média Geral</th>
              <th className="p-4 whitespace-nowrap">Gestor</th>
              <th className="p-4 whitespace-nowrap">Autoavaliação</th>
              <th className="p-4 whitespace-nowrap">Pares</th>
              <th className="p-4 whitespace-nowrap">Subordinados</th>
              <th className="p-4 whitespace-nowrap text-right">Min / Máx</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  Nenhuma avaliação registrada para este colaborador.
                </td>
              </tr>
            ) : (
              sorted.map((c) => {
                const info = getCompetenceInfo(c.competencia);
                const Icon = info.icone;
                
                return (
                  <tr key={c.competencia} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 bg-primary/10 rounded-md text-primary shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground leading-tight">{info.nome}</p>
                          <p className="text-xs text-muted-foreground mt-1 max-w-[280px] line-clamp-2" title={info.descricao}>
                            {info.descricao}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-primary text-base align-middle">
                      {c.mediaGeral.toFixed(2)}
                    </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={c.mediaGestor > 0 ? "text-foreground" : "text-muted-foreground/50"}>
                        {c.mediaGestor > 0 ? c.mediaGestor.toFixed(2) : '-'}
                      </span>
                      {c.mediaGestor > 0 && getTrendIcon(c.mediaGestor, c.mediaGeral)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={c.mediaAuto > 0 ? "text-foreground" : "text-muted-foreground/50"}>
                        {c.mediaAuto > 0 ? c.mediaAuto.toFixed(2) : '-'}
                      </span>
                      {c.mediaAuto > 0 && getTrendIcon(c.mediaAuto, c.mediaGeral)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={c.mediaPares > 0 ? "text-foreground" : "text-muted-foreground/50"}>
                        {c.mediaPares > 0 ? c.mediaPares.toFixed(2) : '-'}
                      </span>
                      {c.mediaPares > 0 && getTrendIcon(c.mediaPares, c.mediaGeral)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={c.mediaSubordinados > 0 ? "text-foreground" : "text-muted-foreground/50"}>
                        {c.mediaSubordinados > 0 ? c.mediaSubordinados.toFixed(2) : '-'}
                      </span>
                      {c.mediaSubordinados > 0 && getTrendIcon(c.mediaSubordinados, c.mediaGeral)}
                    </div>
                  </td>
                  <td className="p-4 text-right text-muted-foreground tabular-nums">
                    {c.min > 0 ? `${c.min} / ${c.max}` : '-'}
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
