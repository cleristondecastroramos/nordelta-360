import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getEvolutionMetrics } from "@/lib/data-service";
import type { EvolutionMetrics } from "@/lib/types";
import { Download, TrendingUp, TrendingDown, Compass, Activity, Clock } from "lucide-react";

// Components
import { EvolutionKpiCard } from "@/components/evolucao-historica/EvolutionKpiCard";
import { EvolutionLineChart } from "@/components/evolucao-historica/EvolutionLineChart";
import { CompetencyTrendChart } from "@/components/evolucao-historica/CompetencyTrendChart";
import { DepartmentEvolutionChart } from "@/components/evolucao-historica/DepartmentEvolutionChart";
import { EvolutionInsightPanel } from "@/components/evolucao-historica/EvolutionInsightPanel";
import { EvolutionTable } from "@/components/evolucao-historica/EvolutionTable";

export const Route = createFileRoute("/evolucao-historica")({
  component: EvolucaoHistoricaPage,
});

function EvolucaoHistoricaPage() {
  const [data, setData] = useState<EvolutionMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getEvolutionMetrics();
        setData(res);
      } catch (error) {
        console.error("Erro ao carregar dados históricos:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="font-medium">Sintetizando dados históricos...</p>
        </div>
      </div>
    );
  }

  // Prepara as chaves para o gráfico de linha: Empresa (Área) + Top 3 departamentos
  const topDeptosNames = data.evolucaoDepartamentos.slice(0, 3).map((d) => d.departamento);
  const colors = ["#eab308", "#10b981", "#6366f1"]; // Amber, Emerald, Indigo

  const lineChartKeys = [
    {
      key: "mediaGeral",
      color: "hsl(var(--primary))",
      label: "Média Global Empresa",
      isArea: true,
    },
    ...topDeptosNames.map((d, i) => ({
      key: d,
      color: colors[i % colors.length],
      label: d,
    })),
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Evolução Histórica
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Acompanhamento contínuo da performance organizacional. Analise o crescimento, tendências
            de competências e estabilidade dos departamentos através dos ciclos de avaliação 360°.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar Relatório
          </button>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <EvolutionKpiCard
          title="Nota Média Atual"
          value={data.notaMediaAtual.toFixed(2)}
          icon={<Activity className="h-5 w-5" />}
          trend={data.variacaoCicloAnterior}
          tooltipTitle="Média Global Corrente"
          tooltipDesc="Resultado do ciclo mais recente. A variação indica crescimento ou queda contra o ciclo imediatamente anterior."
        />
        <EvolutionKpiCard
          title="Melhor Desempenho"
          value={data.melhorCiclo.media.toFixed(2)}
          subtitle={`No ciclo ${data.melhorCiclo.ciclo}`}
          icon={<Compass className="h-5 w-5" />}
          tooltipTitle="Pico Histórico"
          tooltipDesc="O ciclo em que a empresa atingiu sua maior média geral até o momento."
        />
        <EvolutionKpiCard
          title="Maior Crescimento"
          value={`+${data.maiorVariacaoPositiva.variacao.toFixed(2)}`}
          subtitle={data.maiorVariacaoPositiva.departamento}
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          className="border-emerald-100 dark:border-emerald-900/50"
        />
        <EvolutionKpiCard
          title="Maior Queda"
          value={data.maiorVariacaoNegativa.variacao.toFixed(2)}
          subtitle={data.maiorVariacaoNegativa.departamento}
          icon={<TrendingDown className="h-5 w-5 text-rose-500" />}
          className="border-rose-100 dark:border-rose-900/50"
        />
        <div className="rounded-xl border bg-primary text-primary-foreground shadow-sm p-5 flex flex-col justify-center items-center text-center lg:col-span-1 md:col-span-2">
          <h3 className="tracking-tight text-sm font-medium text-primary-foreground/80 mb-1 flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> Base Histórica
          </h3>
          <div className="text-3xl font-extrabold">{data.totalCiclos}</div>
          <p className="text-xs text-primary-foreground/70 font-medium mt-1 uppercase tracking-wider">
            Ciclos Analisados
          </p>
        </div>
      </div>

      {/* GRÁFICO PRINCIPAL & INSIGHTS */}
      <div className="grid xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <EvolutionLineChart data={data.historicoGeral} dataKeys={lineChartKeys} />
        </div>
        <div>
          <EvolutionInsightPanel insights={data.insights} />
        </div>
      </div>

      {/* COMPETÊNCIAS & DEPARTAMENTOS */}
      <div className="grid xl:grid-cols-2 gap-8">
        <CompetencyTrendChart data={data.evolucaoCompetencias} />
        <DepartmentEvolutionChart data={data.evolucaoDepartamentos} />
      </div>

      {/* TABELA DETALHADA */}
      <EvolutionTable data={data.evolucaoDepartamentos} />
    </div>
  );
}
