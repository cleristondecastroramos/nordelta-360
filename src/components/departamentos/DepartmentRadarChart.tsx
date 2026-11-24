import { DepartmentStats } from "@/lib/types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

interface DepartmentRadarChartProps {
  departamento: DepartmentStats | null;
}

export function DepartmentRadarChart({ departamento }: DepartmentRadarChartProps) {
  if (!departamento || !departamento.competenciasDetalhadas) {
    return (
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full items-center justify-center min-h-[400px]">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-center max-w-sm">
          Selecione um departamento no ranking para visualizar a análise detalhada de competências
          em relação à média global.
        </p>
      </div>
    );
  }

  const data = departamento.competenciasDetalhadas
    .filter((c) => c.competencia !== "comentario")
    .map((c) => ({
      subject: c.competencia.split(" ")[0], // Use first word for brevity in radar
      fullName: c.competencia,
      A: c.media,
      B: c.mediaEmpresa,
      fullMark: 5,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm">
          <p className="font-semibold mb-2">{payload[0].payload.fullName}</p>
          <div className="space-y-1">
            <p className="flex justify-between gap-4">
              <span className="text-primary font-medium">{departamento.departamento}:</span>
              <span className="font-bold">{payload[0].value.toFixed(2)}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-500 font-medium">Empresa:</span>
              <span className="font-bold text-slate-500">{payload[1].value.toFixed(2)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full">
      <div className="mb-4">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5 flex items-center gap-2">
          Análise de Competências
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {departamento.departamento}
          </span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Comparativo das pontuações do setor contra a média geral da organização.
        </p>
      </div>
      <div className="flex-1 w-full min-h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="95%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickCount={6}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            <Radar
              name={departamento.departamento}
              dataKey="A"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.6}
              strokeWidth={3}
            />
            <Radar
              name="Média Empresa"
              dataKey="B"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.15}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
