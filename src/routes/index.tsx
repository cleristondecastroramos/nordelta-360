import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, TrendingUp, Target, Award, Building, Activity } from "lucide-react";
import { getDashboardMetrics } from "@/lib/data-service";
import type { DashboardMetrics } from "@/lib/types";

// UI Components
import { ExecutiveKpiCard } from "@/components/ui/executive-kpi-card";
import { RadarExecutiveChart } from "@/components/ui/radar-executive-chart";
import { GapHeatmap } from "@/components/ui/gap-heatmap";
import { DepartmentRankingCard } from "@/components/ui/department-ranking-card";
import { TalentRankingTable } from "@/components/ui/talent-ranking-table";
import { InsightPanel } from "@/components/ui/insight-panel";
import { ExplainerBox } from "@/components/ui/explainer-box";
import { DistributionChart } from "@/components/ui/distribution-chart";
import { AlertPanel } from "@/components/ui/alert-panel";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to load metrics:", error);
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
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando painel executivo...</p>
        </div>
      </div>
    );
  }

  if (!metrics || metrics.totalColaboradores === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <AlertPanel 
          type="error"
          title="Base de dados não encontrada ou vazia"
          message="Para que o Dashboard Executivo seja renderizado, certifique-se de que os arquivos CSV ('data_profiles_applied.csv' e 'evaluations_360.csv') estejam presentes no diretório public/data."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Executive Analytics</h1>
        <p className="text-muted-foreground">Visão estratégica e consolidação de resultados do ciclo de Avaliação 360°.</p>
      </div>

      {/* KPI Strip */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <ExecutiveKpiCard
          title="Colaboradores"
          value={metrics.totalColaboradores}
          icon={<Users className="h-5 w-5" />}
          tooltipTitle="Volume da Base"
          tooltipDesc="Total de colaboradores avaliados ou participantes."
        />
        <ExecutiveKpiCard
          title="Participação"
          value={`${metrics.participacaoCiclo}%`}
          icon={<Activity className="h-5 w-5" />}
          trend={{ value: "2%", positive: true }}
          tooltipTitle="Taxa de Adesão"
          tooltipDesc="Percentual de avaliações preenchidas vs esperadas no ciclo."
        />
        <ExecutiveKpiCard
          title="Nota Global"
          value={metrics.notaMediaGeral}
          icon={<Target className="h-5 w-5" />}
          trend={{ value: "0.2", positive: true }}
          tooltipTitle="Média Geral Empresa"
          tooltipDesc="Média aritmética de todas as avaliações consolidadas da organização."
          tooltipCalc="Soma Notas / Total Avaliações"
          className="border-primary/20 bg-primary/5"
        />
        <ExecutiveKpiCard
          title="Índice Potencial"
          value={metrics.mediaPotencial}
          icon={<TrendingUp className="h-5 w-5" />}
          tooltipTitle="Média de Potencial"
          tooltipDesc="Cálculo preditivo de potencial baseado nas notas de liderança e inovação."
        />
        <ExecutiveKpiCard
          title="Percentil Médio"
          value={metrics.percentilMedio}
          icon={<Award className="h-5 w-5" />}
          tooltipTitle="Percentil Global"
          tooltipDesc="A distribuição de curva forçada da empresa."
        />
        <ExecutiveKpiCard
          title="Departamentos"
          value={metrics.totalDepartamentos}
          icon={<Building className="h-5 w-5" />}
          tooltipTitle="Áreas Avaliadas"
          tooltipDesc="Total de áreas de negócios com avaliações válidas."
        />
      </div>

      {/* Radar and Insights */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border bg-card shadow-sm flex flex-col">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Mapeamento de Competências (Radar Executivo)</h3>
              <p className="text-sm text-muted-foreground">Comparativo de Média Global vs Ciclo Anterior.</p>
            </div>
          </div>
          <div className="flex-1 p-6 flex flex-col xl:flex-row gap-6 items-center">
            <div className="w-full xl:w-2/3 h-[400px]">
              <RadarExecutiveChart data={metrics.mediasPorCompetencia} />
            </div>
            <div className="w-full xl:w-1/3">
               <ExplainerBox 
                title="Como ler o Radar"
                description="O preenchimento em azul sólido representa a competência atual da empresa. A linha tracejada cinza projeta o resultado do ciclo passado. Quanto mais próximo das bordas, mais madura a competência."
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex-1">
             <InsightPanel insights={metrics.insights} />
          </div>
          <div className="h-[280px]">
             <DepartmentRankingCard departamentos={metrics.departamentos} />
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/10">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">Heatmap de Gaps (Gestor vs Autoavaliação)</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-4xl">
            Identifique facilmente as distorções de percepção. Cores esmeralda indicam que o gestor enxerga o colaborador melhor do que ele mesmo (Síndrome do Impostor). Cores em âmbar indicam que o colaborador se enxerga melhor do que o gestor (Efeito Dunning-Kruger).
          </p>
        </div>
        <div className="p-6">
           <GapHeatmap data={metrics.gapHeatmap} />
        </div>
      </div>

      {/* Distribution & Talent */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <div className="rounded-xl border bg-card shadow-sm flex flex-col">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-lg">Distribuição de Curva (Histograma)</h3>
            <p className="text-sm text-muted-foreground">Concentração do volume de colaboradores por faixa de nota.</p>
          </div>
          <div className="p-6 flex-1 h-[350px]">
             <DistributionChart data={metrics.distribuicaoNotas} />
          </div>
        </div>
        
        <div className="h-full min-h-[450px]">
          <TalentRankingTable ranking={metrics.ranking} />
        </div>
      </div>
    </div>
  );
}
