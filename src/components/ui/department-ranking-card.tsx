import type { DepartmentStats } from "@/lib/types";

interface DepartmentRankingCardProps {
  departamentos: DepartmentStats[];
}

export function DepartmentRankingCard({ departamentos }: DepartmentRankingCardProps) {
  // Sort by average score
  const topDepto = [...departamentos].sort((a, b) => b.media - a.media);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 pb-4 border-b bg-muted/10 shrink-0">
        <h3 className="font-semibold leading-none tracking-tight">Desempenho por Departamento</h3>
      </div>
      <div className="p-0 flex-1 overflow-y-auto custom-scrollbar">
        <div className="divide-y">
          {topDepto.map((depto, i) => (
            <div key={depto.departamento} className="flex items-center p-4 hover:bg-muted/30 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                {i + 1}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium leading-none mb-1">{depto.departamento}</p>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${(depto.media / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="font-semibold text-primary">{depto.media.toFixed(2)}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Média</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
