import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSearch,
  ArrowRight,
} from "lucide-react";
import type { CalibrationData, FeedbackStatus } from "@/lib/feedback-types";

interface FeedbackListProps {
  data: CalibrationData[];
  onReview: (id: string) => void;
}

export function FeedbackStatusChip({ status }: { status: FeedbackStatus }) {
  const getStyle = () => {
    switch (status) {
      case "Aprovado":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      case "Em Revisão":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "Pendente":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      case "Reprovado":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case "Em Revisão":
        return <FileSearch className="w-3 h-3 mr-1" />;
      case "Pendente":
        return <Clock className="w-3 h-3 mr-1" />;
      case "Reprovado":
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()}`}
    >
      {getIcon()}
      {status}
    </span>
  );
}

export function FeedbackList({ data, onReview }: FeedbackListProps) {
  // Calculando KPIs para o dashboard rápido
  const total = data.length;
  const aprovados = data.filter((d) => d.status === "Aprovado").length;
  const pendentes = data.filter((d) => d.status === "Pendente").length;
  const emRevisao = data.filter((d) => d.status === "Em Revisão").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Comitê de Calibragem</h2>
          <p className="text-muted-foreground mt-1">
            Revise e aprove os resumos de feedback dos colaboradores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtros Avançados
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <h3 className="text-sm font-medium">Total de Feedbacks</h3>
            <UsersIcon className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="rounded-xl border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-3">
            <h3 className="text-sm font-medium">Aprovados</h3>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{aprovados}</p>
            <p className="text-sm text-emerald-600 mb-1">
              {Math.round((aprovados / total) * 100)}% do total
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-3">
            <h3 className="text-sm font-medium">Aguardando Revisão</h3>
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{pendentes}</p>
        </div>
        <div className="rounded-xl border bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-3">
            <h3 className="text-sm font-medium">Em Calibragem</h3>
            <FileSearch className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{emRevisao}</p>
        </div>
      </div>

      {/* Toolbar e Busca */}
      <div className="flex items-center justify-between bg-card p-2 rounded-lg border shadow-sm">
        <div className="relative w-full max-w-sm ml-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por colaborador ou matrícula..."
            className="h-9 w-full bg-transparent pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Tabela de Feedbacks */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 font-medium text-muted-foreground border-b">
              <tr>
                <th className="p-4 whitespace-nowrap">Colaborador</th>
                <th className="p-4 whitespace-nowrap">Departamento</th>
                <th className="p-4 whitespace-nowrap">Ciclo</th>
                <th className="p-4 whitespace-nowrap text-center">Nota Original</th>
                <th className="p-4 whitespace-nowrap text-center">Nota Calibrada</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {item.colaboradorFotoUrl ? (
                        <img
                          src={item.colaboradorFotoUrl}
                          alt={item.colaboradorNome}
                          className="w-8 h-8 rounded-full border border-border object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {item.colaboradorNome.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{item.colaboradorNome}</p>
                        <p className="text-xs text-muted-foreground">{item.colaboradorMatricula}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{item.colaboradorDepartamento}</td>
                  <td className="p-4 text-muted-foreground">{item.ciclo}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center bg-secondary w-10 h-6 rounded font-semibold">
                      {item.notaOriginal.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-10 h-6 rounded font-semibold ${
                        item.notaCalibrada !== item.notaOriginal
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {item.notaCalibrada.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <FeedbackStatusChip status={item.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onReview(item.id)}
                      className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      Revisar
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Icon helper since lucide-react might not export UsersIcon by that exact name
function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
