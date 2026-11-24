import {
  PlusCircle,
  Calendar,
  Users,
  Settings2,
  PlayCircle,
  BarChart3,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { CycleConfig } from "@/lib/cycle-types";

interface CycleListProps {
  cycles: CycleConfig[];
  onCreateNew: () => void;
  onViewCycle: (cycleId: string) => void;
}

export function CycleList({ cycles, onCreateNew, onViewCycle }: CycleListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "Planejado":
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      case "Encerrado":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      case "Pausado":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      case "Consolidando":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em andamento":
        return <PlayCircle className="h-3 w-3 mr-1" />;
      case "Planejado":
        return <Calendar className="h-3 w-3 mr-1" />;
      case "Encerrado":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "Pausado":
        return <Clock className="h-3 w-3 mr-1" />;
      case "Consolidando":
        return <Settings2 className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Ciclos 360°</h2>
          <p className="text-muted-foreground mt-1">
            Administre as campanhas de avaliação de desempenho da empresa.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Ciclo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {cycles.map((cycle) => (
          <div
            key={cycle.id}
            className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6 pb-4 border-b">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg line-clamp-1" title={cycle.nome}>
                  {cycle.nome}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(cycle.status)}`}
                >
                  {getStatusIcon(cycle.status)}
                  {cycle.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                {cycle.descricao}
              </p>
            </div>

            <div className="p-6 py-4 flex-1 space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="font-medium text-foreground">{cycle.dataInicio}</span>
                <span className="mx-2 text-muted-foreground">até</span>
                <span className="font-medium text-foreground">{cycle.dataFim}</span>
              </div>

              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 text-muted-foreground mr-2" />
                <span>
                  <span className="font-semibold text-foreground">{cycle.totalParticipantes}</span>{" "}
                  participantes elegíveis
                </span>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground font-medium">Progresso</span>
                  <span className="font-bold">
                    {cycle.status === "Planejado"
                      ? "0%"
                      : cycle.status === "Encerrado"
                        ? "100%"
                        : "68%"}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cycle.status === "Encerrado" ? "bg-emerald-500" : "bg-primary"}`}
                    style={{
                      width:
                        cycle.status === "Planejado"
                          ? "0%"
                          : cycle.status === "Encerrado"
                            ? "100%"
                            : "68%",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/20 border-t flex gap-3">
              <button
                onClick={() => onViewCycle(cycle.id)}
                className="flex-1 inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {cycle.status === "Planejado" ? "Configurar" : "Monitorar"}
              </button>
            </div>
          </div>
        ))}

        {cycles.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed p-12 text-center text-muted-foreground flex flex-col items-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum ciclo criado</h3>
            <p className="max-w-sm mb-6">
              Você ainda não possui ciclos de avaliação configurados no sistema.
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Meu Primeiro Ciclo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
