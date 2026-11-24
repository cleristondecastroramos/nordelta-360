import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getColaboradorResultados } from "@/lib/data-service";
import type { ColaboradorResultados } from "@/lib/types";
import { AlertPanel } from "@/components/ui/alert-panel";
import { FileText, Medal, AlertTriangle } from "lucide-react";

// Premium Components
import { EmployeeProfileHeader } from "@/components/ficha-individual/EmployeeProfileHeader";
import { EmployeeKpiStrip } from "@/components/ficha-individual/EmployeeKpiStrip";
import { ProfileTabNavigation } from "@/components/ficha-individual/ProfileTabNavigation";
import { RadarComparisonPanel } from "@/components/ficha-individual/RadarComparisonPanel";
import { CompetencyTable } from "@/components/ficha-individual/CompetencyTable";
import { FeedbackCommentsList } from "@/components/ficha-individual/FeedbackCommentsList";
import { EvolutionChart } from "@/components/ficha-individual/EvolutionChart";
import { DevelopmentPlanTable } from "@/components/ficha-individual/DevelopmentPlanTable";

export const Route = createFileRoute("/ficha-individual/$matricula")({
  component: FichaIndividualPage,
});

function FichaIndividualPage() {
  const { matricula } = Route.useParams();
  const [data, setData] = useState<ColaboradorResultados | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resumo");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getColaboradorResultados(matricula);
        setData(res);
      } catch (error) {
        console.error("Erro ao carregar a ficha:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [matricula]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="font-medium">Carregando Ficha Executiva...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.colaborador) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <AlertPanel
          title="Colaborador não encontrado"
          items={[`A matrícula ${matricula} não foi localizada nos registros ativos.`]}
          type="error"
          className="max-w-md w-full"
        />
        <button
          onClick={() => window.history.back()}
          className="text-primary hover:underline text-sm font-medium mt-4"
        >
          &larr; Voltar para a lista anterior
        </button>
      </div>
    );
  }

  const { colaborador } = data;

  // Calculate trend from history
  let evolucao = 0;
  if (data.historicoCiclos && data.historicoCiclos.length >= 2) {
    const last = data.historicoCiclos[data.historicoCiclos.length - 1].mediaGeral;
    const prev = data.historicoCiclos[data.historicoCiclos.length - 2].mediaGeral;
    evolucao = last - prev;
  }

  const topStrengths = [...data.competencias]
    .sort((a, b) => b.mediaGeral - a.mediaGeral)
    .slice(0, 3);
  const topWeaknesses = [...data.competencias]
    .sort((a, b) => a.mediaGeral - b.mediaGeral)
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* 1. Cabeçalho Premium */}
      <EmployeeProfileHeader
        colaborador={colaborador}
        onBack={() => window.history.back()}
        onExport={() => window.print()}
      />

      {/* 2. Faixa de KPIs Executivos */}
      <EmployeeKpiStrip
        notaMedia={data.notaMediaGeral}
        percentil={data.percentil}
        indicePotencial={data.indicePotencial}
        gapGestorAuto={data.gapGestorAuto}
        ciclosParticipados={data.historicoCiclos.length}
        evolucaoCicloAnterior={evolucao}
      />

      {/* 3. Área Principal com Abas */}
      <div className="rounded-xl border bg-card/30 shadow-sm relative overflow-hidden">
        <ProfileTabNavigation activeTab={activeTab} onChangeTab={setActiveTab} />

        <div className="p-6 md:p-8 bg-background">
          {/* ABA: RESUMO */}
          {activeTab === "resumo" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
              <div className="xl:col-span-2">
                <RadarComparisonPanel data={data.competencias} isLideranca={data.is_lideranca} />
              </div>
              <div className="space-y-6">
                <div className="rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/10 p-6 shadow-sm border-emerald-100 dark:border-emerald-900/30">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
                    <Medal className="h-5 w-5" /> Maiores Forças
                  </h4>
                  <ul className="space-y-3">
                    {topStrengths.map((c) => (
                      <li
                        key={c.competencia}
                        className="flex justify-between items-center bg-white dark:bg-background p-3 rounded-lg border shadow-sm"
                      >
                        <span className="font-medium text-sm text-foreground">{c.competencia}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {c.mediaGeral.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border bg-amber-50/50 dark:bg-amber-950/10 p-6 shadow-sm border-amber-100 dark:border-amber-900/30">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> Foco de Desenvolvimento
                  </h4>
                  <ul className="space-y-3">
                    {topWeaknesses.map((c) => (
                      <li
                        key={c.competencia}
                        className="flex justify-between items-center bg-white dark:bg-background p-3 rounded-lg border shadow-sm"
                      >
                        <span className="font-medium text-sm text-foreground">{c.competencia}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {c.mediaGeral.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <AlertPanel
                  title="Síntese Executiva"
                  items={[
                    `O talento apresenta aderência cultural com nota média de ${data.notaMediaGeral.toFixed(2)}.`,
                    data.gapGestorAuto > 0.5
                      ? "Atenção: A visão do gestor é significativamente superior à autoavaliação (Síndrome do Impostor)."
                      : data.gapGestorAuto < -0.5
                        ? "Atenção: O colaborador superestima sua performance em relação à visão da liderança."
                        : "Existe um excelente alinhamento entre a expectativa da liderança e a percepção do próprio talento.",
                  ]}
                  type="info"
                />
              </div>
            </div>
          )}

          {/* ABA: COMPETÊNCIAS */}
          {activeTab === "competencias" && (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <CompetencyTable competencias={data.competencias} isLideranca={data.is_lideranca} />
            </div>
          )}

          {/* ABA: COMENTÁRIOS */}
          {activeTab === "comentarios" && (
            <div className="animate-in slide-in-from-right-4 duration-500 max-w-5xl mx-auto">
              <FeedbackCommentsList comentarios={data.comentariosAnonimizados} />
            </div>
          )}

          {/* ABA: EVOLUÇÃO */}
          {activeTab === "evolucao" && (
            <div className="animate-in slide-in-from-right-4 duration-500 max-w-5xl mx-auto">
              <EvolutionChart data={data.historicoCiclos} />
            </div>
          )}

          {/* ABA: PLANO DE DESENVOLVIMENTO */}
          {activeTab === "pdi" && (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <DevelopmentPlanTable planos={data.planoDesenvolvimento} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
