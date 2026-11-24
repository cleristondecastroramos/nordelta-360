import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { colaboradoresQuery, dashboardQuery } from "@/lib/queries";
import { useState } from "react";
import {
  Building2,
  Download,
  Filter,
  Target,
  Users,
  TrendingUp,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import type { Colaborador } from "@/lib/types";

import { DepartmentKpiCard } from "@/components/departamentos/DepartmentKpiCard";
import { DepartmentRankingTable } from "@/components/departamentos/DepartmentRankingTable";
import { DepartmentComparisonChart } from "@/components/departamentos/DepartmentComparisonChart";
import { DepartmentRadarChart } from "@/components/departamentos/DepartmentRadarChart";
import { DepartmentGapHeatmap } from "@/components/departamentos/DepartmentGapHeatmap";
import { DepartmentEmployeeList } from "@/components/departamentos/DepartmentEmployeeList";
import { AlertPanel } from "@/components/ui/alert-panel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/departamentos")({
  component: DepartamentosPage,
});

function DepartamentosPage() {
  const metricsQuery = useQuery(dashboardQuery);
  const colabsQuery = useQuery(colaboradoresQuery);
  const metrics = metricsQuery.data ?? null;
  const colaboradores = (colabsQuery.data ?? []) as unknown as (Colaborador & {
    notaMediaGeral: number;
  })[];
  const loading = metricsQuery.isPending || colabsQuery.isPending;
  // Até o usuário escolher, mostramos o departamento com melhor média.
  const [departamentoEscolhido, setSelectedDepartment] = useState<string | null>(null);
  const selectedDepartment =
    departamentoEscolhido ?? metrics?.departamentos[0]?.departamento ?? null;
  const [sortOrder, setSortOrder] = useState<"maior" | "menor" | "alfabetico">("maior");
  const [isExporting, setIsExporting] = useState(false);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Carregando painel de departamentos...
          </p>
        </div>
      </div>
    );
  }

  if (!metrics || metrics.totalDepartamentos === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <AlertPanel
          type="error"
          title="Dados de Departamentos Indisponíveis"
          items={[
            "Não há dados consolidados de departamentos no momento.",
            "Verifique o cadastro de áreas ou a execução do ciclo de avaliação.",
          ]}
        />
      </div>
    );
  }

  const sortedDepartamentos = [...metrics.departamentos].sort((a, b) => {
    if (sortOrder === "maior") return b.media - a.media;
    if (sortOrder === "menor") return a.media - b.media;
    return a.departamento.localeCompare(b.departamento);
  });

  const selectedDeptoData =
    metrics.departamentos.find((d) => d.departamento === selectedDepartment) || null;
  const highestGapDept = [...metrics.departamentos].sort(
    (a, b) => Math.abs(b.gapMedio) - Math.abs(a.gapMedio),
  )[0];
  const lowestAvgDept = [...metrics.departamentos].sort((a, b) => a.media - b.media)[0];

  const handleExport = async () => {
    if (!metrics) return;
    try {
      setIsExporting(true);
      toast.info("Gerando relatório PDF...", { description: "Isso pode levar alguns segundos." });
      const { exportDepartamentosToPDF } = await import("@/lib/pdf-export");
      await exportDepartamentosToPDF(metrics, selectedDepartment);
      toast.success("Relatório gerado!", {
        description: "O download do PDF começará automaticamente.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Falha na geração do PDF", {
        description: "Ocorreu um erro ao processar os gráficos.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Departamentos
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl font-medium tracking-wide">
            Análise aprofundada de performance, gaps e tendências corporativas por setor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 transition-colors">
                <Filter className="mr-2 h-4 w-4" /> Filtros
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => setSortOrder("maior")}
                className="cursor-pointer justify-between"
              >
                Maior Nota Global{" "}
                {sortOrder === "maior" && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOrder("menor")}
                className="cursor-pointer justify-between"
              >
                Menor Nota Global{" "}
                {sortOrder === "menor" && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOrder("alfabetico")}
                className="cursor-pointer justify-between"
              >
                Ordem Alfabética{" "}
                {sortOrder === "alfabetico" && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors shadow-sm disabled:opacity-70"
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isExporting ? "Gerando..." : "Exportar"}
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <DepartmentKpiCard
          title="Total de Áreas"
          value={metrics.totalDepartamentos}
          icon={<Building2 className="h-5 w-5" />}
          tooltipTitle="Mapeamento Organizacional"
          tooltipDesc="Total de departamentos distintos avaliados no ciclo atual."
        />
        <DepartmentKpiCard
          title="Média Empresa"
          value={metrics.notaMediaGeral.toFixed(2)}
          icon={<Target className="h-5 w-5" />}
          trend={{ value: "0.2", positive: true }}
          tooltipTitle="Benchmark Interno"
          tooltipDesc="Média geral da companhia, serve como régua de corte para a avaliação por área."
        />
        <DepartmentKpiCard
          title="Área Destaque"
          value={metrics.departamentos[0].departamento}
          icon={<TrendingUp className="h-5 w-5" />}
          tooltipTitle="Top Performance"
          tooltipDesc="Departamento com a maior nota consolidada no ciclo 360°."
          className="col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-1"
        />
        <DepartmentKpiCard
          title="Alerta de Risco"
          value={lowestAvgDept.departamento}
          icon={<AlertTriangle className="h-5 w-5" />}
          tooltipTitle="Bottom Performance"
          tooltipDesc="Área com menor desempenho geral, exigindo atenção da liderança."
        />
        <DepartmentKpiCard
          title="Maior Gap (G > A)"
          value={highestGapDept.departamento}
          icon={<Users className="h-5 w-5" />}
          tooltipTitle="Desalinhamento de Percepção"
          tooltipDesc="Área onde as notas dadas pelos gestores mais divergem da autoavaliação (Gestor maior que Auto)."
          className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-1"
        />
      </div>

      {/* Main Grid: Comparison Chart + Ranking Table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="flex flex-col min-h-[450px]">
          <DepartmentComparisonChart
            departamentos={sortedDepartamentos}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
            mediaGeral={metrics.notaMediaGeral}
          />
        </div>
        <div className="flex flex-col min-h-[450px]">
          <DepartmentRankingTable
            departamentos={sortedDepartamentos}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
          />
        </div>
      </div>

      {/* Dynamic Detail Section (Depends on Selection) */}
      <div
        id="department-details"
        className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-auto xl:h-[800px] pt-4 scroll-mt-24"
      >
        <div id="radar-export" className="flex flex-col min-h-[600px] h-full bg-card rounded-xl">
          <DepartmentRadarChart departamento={selectedDeptoData} />
        </div>
        <div className="flex flex-col min-h-[600px] h-full">
          <DepartmentEmployeeList departamento={selectedDepartment} colaboradores={colaboradores} />
        </div>
      </div>

      {/* Global Heatmap */}
      <div className="mt-8" id="heatmap-export">
        <DepartmentGapHeatmap data={metrics.gapHeatmap} />
      </div>
    </div>
  );
}
