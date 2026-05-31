import { Colaborador } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Search, Users } from "lucide-react";

interface DepartmentEmployeeListProps {
  departamento: string | null;
  colaboradores: (Colaborador & { notaMediaGeral: number })[];
}

export function DepartmentEmployeeList({ departamento, colaboradores }: DepartmentEmployeeListProps) {
  if (!departamento) {
    return (
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full items-center justify-center min-h-[300px]">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-center max-w-sm">
          Selecione um departamento no ranking para visualizar os colaboradores da área e acessar suas respectivas fichas.
        </p>
      </div>
    );
  }

  const deptEmployees = colaboradores.filter(c => c.departamento === departamento);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 pb-4 border-b bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5 flex items-center gap-2">
              Talentos da Área
            </h3>
            <p className="text-sm text-muted-foreground">Visão rápida dos colaboradores vinculados a {departamento}.</p>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            {deptEmployees.length} registros
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar talento na área..."
            className="flex h-9 w-full rounded-md border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
        <div className="divide-y divide-border">
          {deptEmployees.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Nenhum colaborador encontrado neste departamento.
            </div>
          ) : (
            deptEmployees.map((colab) => (
              <div key={colab.matricula} className="flex items-center p-4 hover:bg-muted/30 transition-colors group">
                <img 
                  src={colab.avatar_url} 
                  alt={colab.nome} 
                  className="w-10 h-10 rounded-full border border-border object-cover"
                />
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{colab.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">{colab.cargo}</p>
                </div>
                <div className="ml-4 text-right flex flex-col items-end gap-1">
                  <div className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-primary text-primary-foreground shadow-sm">
                    {colab.notaMediaGeral.toFixed(2)}
                  </div>
                  <Link 
                    to="/ficha-individual/$matricula"
                    params={{ matricula: colab.matricula }}
                    className="text-[10px] uppercase font-bold text-primary hover:underline flex items-center mt-0.5"
                  >
                    Ver Ficha <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
