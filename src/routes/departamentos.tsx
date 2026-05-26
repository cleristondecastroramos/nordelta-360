import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Download, Filter, Target, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { getDashboardMetrics, getColaboradoresList } from "@/lib/data-service";
import type { DashboardMetrics, Colaborador } from "@/lib/types";

import { DepartmentKpiCard } from "@/components/departamentos/DepartmentKpiCard";
import { DepartmentRankingTable } from "@/components/departamentos/DepartmentRankingTable";
import { DepartmentComparisonChart } from "@/components/departamentos/DepartmentComparisonChart";
import { DepartmentRadarChart } from "@/components/departamentos/DepartmentRadarChart";
import { DepartmentGapHeatmap } from "@/components/departamentos/DepartmentGapHeatmap";
import { DepartmentEmployeeList } from "@/components/departamentos/DepartmentEmployeeList";
import { AlertPanel } from "@/components/ui/alert-panel";

export const Route = createFileRoute("/departamentos")({
  component: DepartamentosPage,
});

function DepartamentosPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [colaboradores, setColaboradores] = useState<(Colaborador & { notaMediaGeral: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [metricsData, colabData] = await Promise.all([
          getDashboardMetrics(),
          getColaboradoresList()
        ]);
        setMetrics(metricsData);
        setColaboradores(colabData as unknown as (Colaborador & { notaMediaGeral: number })[]);
        
        // Auto-select top department
        if (metricsData.departamentos && metricsData.departamentos.length > 0) {
          setSelectedDepartment(metricsData.departamentos[0].departamento);
        }
      } catch (error) {
        console.error("Failed to load department metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando painel de departamentos...</p>
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
          items={["Não há dados consolidados de departamentos no momento.", "Verifique o cadastro de áreas ou a execução do ciclo de avaliação."]}
        />
      </div>
    );
  }

  const selectedDeptoData = metrics.departamentos.find(d => d.departamento === selectedDepartment) || null;
  const highestGapDept = [...metrics.departamentos].sort((a,b) => Math.abs(b.gapMedio) - Math.abs(a.gapMedio))[0];
  const lowestAvgDept = [...metrics.departamentos].sort((a,b) => a.media - b.media)[0];

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
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 transition-colors">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors shadow-sm">
            <Download className="mr-2 h-4 w-4" /> Exportar
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
            departamentos={metrics.departamentos} 
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
          />
        </div>
        <div className="flex flex-col min-h-[450px]">
          <DepartmentRankingTable 
            departamentos={metrics.departamentos} 
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
          />
        </div>
      </div>

      {/* Dynamic Detail Section (Depends on Selection) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="flex flex-col min-h-[500px]">
          <DepartmentRadarChart departamento={selectedDeptoData} />
        </div>
        <div className="flex flex-col min-h-[500px]">
          <DepartmentEmployeeList 
            departamento={selectedDepartment} 
            colaboradores={colaboradores} 
          />
        </div>
      </div>

      {/* Global Heatmap */}
      <div className="mt-8">
        <DepartmentGapHeatmap data={metrics.gapHeatmap} />
      </div>

    </div>
  );
}
