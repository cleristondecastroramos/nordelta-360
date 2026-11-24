import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { colaboradoresQuery, demografiaQuery } from "@/lib/queries";
import { Download, Filter, Users, UserPlus, GraduationCap, Building2 } from "lucide-react";
import type { Colaborador } from "@/lib/types";
import { AlertPanel } from "@/components/ui/alert-panel";

// Componentes da Demografia
import { DemographyKpiCard } from "@/components/demografia/DemographyKpiCard";
import { GenderDistributionChart } from "@/components/demografia/GenderDistributionChart";
import { AgeRangeChart } from "@/components/demografia/AgeRangeChart";
import { TenureDistributionChart } from "@/components/demografia/TenureDistributionChart";
import { DepartmentCompositionChart } from "@/components/demografia/DepartmentCompositionChart";
import { LocationMapChart } from "@/components/demografia/LocationMapChart";
import { DemographyInsightPanel } from "@/components/demografia/DemographyInsightPanel";
import { DemographyTable } from "@/components/demografia/DemographyTable";

export const Route = createFileRoute("/demografia")({
  component: DemografiaPage,
});

function DemografiaPage() {
  const metricsQuery = useQuery(demografiaQuery);
  const colabsQuery = useQuery(colaboradoresQuery);
  const metrics = metricsQuery.data ?? null;
  const colaboradores = (colabsQuery.data ?? []) as unknown as Colaborador[];
  const loading = metricsQuery.isPending || colabsQuery.isPending;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Carregando painel demográfico...
          </p>
        </div>
      </div>
    );
  }

  if (!metrics || metrics.totalColaboradores === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <AlertPanel
          type="error"
          title="Dados Demográficos Indisponíveis"
          items={["Não há dados suficientes cadastrados na base de colaboradores."]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Demografia
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl font-medium tracking-wide">
            Análise estratégica da composição da força de trabalho da Nordelta.
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

      {/* Faixa de KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DemographyKpiCard
          title="Total de Colaboradores"
          value={metrics.totalColaboradores}
          icon={<Users className="h-5 w-5" />}
          tooltipTitle="Headcount Ativo"
          tooltipDesc="Total de colaboradores registrados no sistema atual."
        />
        <DemographyKpiCard
          title="Diversidade de Gênero"
          value={`${metrics.percentualFeminino.toFixed(0)}%`}
          subtitle="Representatividade Feminina"
          icon={<UserPlus className="h-5 w-5" />}
          tooltipTitle="Equidade de Gênero"
          tooltipDesc="Proporção de mulheres na força de trabalho geral."
        />
        <DemographyKpiCard
          title="Idade Média"
          value={`${metrics.idadeMedia} anos`}
          icon={<GraduationCap className="h-5 w-5" />}
          tooltipTitle="Estrutura Etária"
          tooltipDesc="Média de idade de todos os colaboradores ativos."
        />
        <DemographyKpiCard
          title="Taxa de Liderança"
          value={`${Math.round((metrics.totalLideranca / metrics.totalColaboradores) * 100)}%`}
          subtitle={`${metrics.totalLideranca} posições de gestão`}
          icon={<Building2 className="h-5 w-5" />}
          tooltipTitle="Proporção de Líderes"
          tooltipDesc="Razão entre cargos de gestão (Gerentes, Diretores, Coordenadores) e contribuintes individuais."
        />
      </div>

      {/* Grade Superior: Gênero, Idade e Tempo de Empresa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GenderDistributionChart data={metrics.genderData} />
        <AgeRangeChart data={metrics.ageData} />
        <TenureDistributionChart data={metrics.tenureData} />
      </div>

      {/* Grade Central: Departamento, Localização e Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DepartmentCompositionChart data={metrics.departmentData} />
        </div>
        <div className="lg:col-span-1">
          <DemographyInsightPanel insights={metrics.insights} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <LocationMapChart data={metrics.locationData} />
      </div>

      {/* Tabela de Detalhamento */}
      <div className="mt-8">
        <DemographyTable colaboradores={colaboradores} />
      </div>
    </div>
  );
}
