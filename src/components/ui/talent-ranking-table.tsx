import { TrendingUp, Medal } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MetricTooltip } from "./metric-tooltip";

interface Talent {
  matricula: string;
  nome: string;
  nota: number;
  potencial: number;
  percentil: number;
  avatar_url?: string;
}

interface TalentRankingTableProps {
  ranking: Talent[];
}

export function TalentRankingTable({ ranking }: TalentRankingTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm h-full flex flex-col">
      <div className="p-6 pb-4 border-b bg-muted/10 flex justify-between items-center">
        <div>
          <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
            <Medal className="h-5 w-5 text-amber-500" /> Top Talentos
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Classificação baseada na nota média e potencial.</p>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 font-medium text-muted-foreground border-b">
            <tr>
              <th className="p-4 w-12 text-center">#</th>
              <th className="p-4">Colaborador</th>
              <th className="p-4">
                <MetricTooltip title="Nota Média" description="Média de todas as avaliações do ciclo atual.">
                  <span className="cursor-help border-b border-dashed border-muted-foreground/30">Score</span>
                </MetricTooltip>
              </th>
              <th className="p-4">
                <MetricTooltip title="Percentil" description="Posição relativa do colaborador em relação à base total.">
                  <span className="cursor-help border-b border-dashed border-muted-foreground/30">Percentil</span>
                </MetricTooltip>
              </th>
              <th className="p-4">
                <MetricTooltip title="Potencial (9 Box)" description="Cálculo com peso extra em Liderança e Inovação.">
                  <span className="cursor-help border-b border-dashed border-muted-foreground/30">Potencial</span>
                </MetricTooltip>
              </th>
              <th className="p-4 text-right">Ficha</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ranking.slice(0, 7).map((colab, i) => (
              <tr key={colab.matricula} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 text-center font-semibold text-muted-foreground">{i + 1}</td>
                <td className="p-4 font-medium text-foreground">
                  <div className="flex items-center gap-3">
                    {colab.avatar_url ? (
                      <img 
                        src={colab.avatar_url} 
                        alt={colab.nome} 
                        className="w-8 h-8 rounded-full border border-border object-cover" 
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(colab.nome)}&background=1e40af&color=fff&size=32`;
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {colab.nome.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span>{colab.nome}</span>
                  </div>
                </td>
                <td className="p-4 font-bold text-primary">{colab.nota.toFixed(2)}</td>
                <td className="p-4 text-muted-foreground">{colab.percentil} P</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    {colab.potencial.toFixed(1)}
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Link 
                    to="/ficha-individual/$matricula"
                    params={{ matricula: colab.matricula }}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Ver Perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
