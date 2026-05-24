import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

export const Route = createFileRoute("/_authenticated/colaboradores/$matricula")({
  component: ColaboradorDetail,
});

const COMPETENCIAS = [
  { key: "resp_competencia_tecnica", label: "Técnica" },
  { key: "resp_qualidade_trabalho", label: "Qualidade" },
  { key: "resp_produtividade", label: "Produtividade" },
  { key: "resp_trabalho_em_equipe", label: "Equipe" },
  { key: "resp_comunicacao", label: "Comunicação" },
  { key: "resp_lideranca", label: "Liderança" },
  { key: "resp_iniciativa", label: "Iniciativa" },
  { key: "resp_resolucao_problemas", label: "Resolução" },
  { key: "resp_orientacao_cliente", label: "Cliente" },
  { key: "resp_etica", label: "Ética" },
  { key: "resp_adaptacao", label: "Adaptação" },
  { key: "resp_desenvolvimento", label: "Desenvolvimento" },
] as const;

function ColaboradorDetail() {
  const { matricula } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["colaborador", matricula],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("*")
        .eq("matricula", matricula)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="text-muted-foreground">Carregando…</div>;
  if (!data) return <div className="text-muted-foreground">Colaborador não encontrado.</div>;

  const getNum = (key: string) => {
    const v = (data as unknown as Record<string, unknown>)[key];
    return typeof v === "number" ? v : 0;
  };
  const radarData = COMPETENCIAS.map((c) => ({
    competencia: c.label,
    nota: getNum(c.key),
  }));

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/colaboradores">
            <ArrowLeft className="mr-2 h-4 w-4" />Voltar
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold tracking-tight">{data.nome}</h1>
            <p className="font-mono text-xs text-muted-foreground">{data.matricula}</p>
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="Cargo" value={data.cargo} />
            <Row label="Departamento" value={data.departamento} />
            <Row label="E-mail" value={data.email} />
            <Row label="Estado" value={data.estado} />
            <Row label="Admissão" value={data.data_admissao} />
            <Row label="Idade" value={data.idade?.toString()} />
          </dl>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold">Radar de competências</h2>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="competencia" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Radar
                  dataKey="nota"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold">Notas detalhadas</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {COMPETENCIAS.map((c) => {
            const raw = (data as unknown as Record<string, unknown>)[c.key];
            const v = typeof raw === "number" ? raw : null;
            return (
              <div key={c.key} className="rounded border border-border p-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {v != null ? v.toFixed(2) : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-1.5 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value ?? "—"}</dd>
    </div>
  );
}