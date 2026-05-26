import type { DepartmentStats } from "@/lib/types";
import { 
  Building2, 
  Code, 
  LineChart, 
  Users, 
  Briefcase, 
  Megaphone, 
  ShieldCheck, 
  Headset, 
  Wrench,
  Stethoscope,
  HeartHandshake
} from "lucide-react";

const getDepartmentIcon = (dept: string) => {
  const d = dept.toLowerCase();
  if (d.includes("tecnologia") || d.includes("ti") || d.includes("desenvolvimento") || d.includes("engenharia de software")) return <Code className="w-4 h-4" />;
  if (d.includes("venda") || d.includes("comercial") || d.includes("negócio")) return <LineChart className="w-4 h-4" />;
  if (d.includes("rh") || d.includes("recursos") || d.includes("pessoas") || d.includes("talentos")) return <Users className="w-4 h-4" />;
  if (d.includes("financeiro") || d.includes("finança") || d.includes("controladoria")) return <Briefcase className="w-4 h-4" />;
  if (d.includes("marketing") || d.includes("comunicação")) return <Megaphone className="w-4 h-4" />;
  if (d.includes("jurídico") || d.includes("legal") || d.includes("compliance")) return <ShieldCheck className="w-4 h-4" />;
  if (d.includes("atendimento") || d.includes("suporte") || d.includes("cliente")) return <Headset className="w-4 h-4" />;
  if (d.includes("operações") || d.includes("engenharia") || d.includes("produção")) return <Wrench className="w-4 h-4" />;
  if (d.includes("saúde") || d.includes("médico")) return <Stethoscope className="w-4 h-4" />;
  if (d.includes("parceria") || d.includes("relacionamento")) return <HeartHandshake className="w-4 h-4" />;
  return <Building2 className="w-4 h-4" />;
};

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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm border border-primary/20">
                {getDepartmentIcon(depto.departamento)}
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
