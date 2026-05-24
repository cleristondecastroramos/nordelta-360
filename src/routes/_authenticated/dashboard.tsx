import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Activity, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — Nordelta 360°" }] }),
});

const COMPETENCIAS = [
  { key: "resp_competencia_tecnica", label: "Téc." },
  { key: "resp_qualidade_trabalho", label: "Qual." },
  { key: "resp_produtividade", label: "Prod." },
  { key: "resp_trabalho_em_equipe", label: "Equipe" },
  { key: "resp_comunicacao", label: "Com." },
  { key: "resp_lideranca", label: "Lid." },
  { key: "resp_iniciativa", label: "Inic." },
  { key: "resp_resolucao_problemas", label: "Resol." },
  { key: "resp_orientacao_cliente", label: "Cliente" },
  { key: "resp_etica", label: "Ética" },
  { key: "resp_adaptacao", label: "Adapt." },
  { key: "resp_desenvolvimento", label: "Desenv." },
] as const;

function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data: colabs, error } = await supabase
        .from("colaboradores")
        .select(
          "matricula, departamento, resp_competencia_tecnica, resp_qualidade_trabalho, resp_produtividade, resp_trabalho_em_equipe, resp_comunicacao, resp_lideranca, resp_iniciativa, resp_resolucao_problemas, resp_orientacao_cliente, resp_etica, resp_adaptacao, resp_desenvolvimento"
        );
      if (error) throw error;
      const total = colabs?.length ?? 0;
      const avgByComp = COMPETENCIAS.map((c) => {
        const vals = (colabs ?? [])
          .map((r) => (r as Record<string, unknown>)[c.key] as number | null)
          .filter((v): v is number => typeof v === "number");
        const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        return { label: c.label, valor: Number(avg.toFixed(2)) };
      });
      const overallAvg =
        avgByComp.reduce((a, b) => a + b.valor, 0) / (avgByComp.length || 1);
      const departamentos = new Set((colabs ?? []).map((c) => c.departamento).filter(Boolean));
      const baixa = avgByComp.filter((c) => c.valor < 6).length;
      return { total, avgByComp, overallAvg, deps: departamentos.size, baixa };
    },
  });

  const kpis = [
    { label: "Colaboradores", value: data?.total ?? "—", icon: Users },
    { label: "Nota média geral", value: data ? data.overallAvg.toFixed(2) : "—", icon: TrendingUp },
    { label: "Departamentos", value: data?.deps ?? "—", icon: Activity },
    { label: "Competências < 6", value: data?.baixa ?? "—", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral da avaliação 360° da empresa.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </span>
              <kpi.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">
              {isLoading ? "…" : kpi.value}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Média por competência</h2>
          <p className="text-xs text-muted-foreground">
            Notas médias agregadas (escala 0–10) — todos os colaboradores.
          </p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.avgByComp ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="valor" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}