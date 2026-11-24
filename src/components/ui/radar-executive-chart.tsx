import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface RadarData {
  competencia: string;
  media: number;
  mediaAnterior?: number;
}

interface RadarExecutiveChartProps {
  data: RadarData[];
}

export function RadarExecutiveChart({ data }: RadarExecutiveChartProps) {
  // Format long competency names for the chart
  const formatTick = (value: string) => {
    if (value.length > 15) return value.substring(0, 15) + "...";
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-4 rounded-lg shadow-xl text-popover-foreground text-sm z-50">
          <p className="font-bold mb-3 pb-2 border-b border-border/50">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">{entry.name}</span>
              </div>
              <span className="font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <PolarAngleAxis
            dataKey="competencia"
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
            tickFormatter={formatTick}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[1, 5]}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            tickCount={5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "20px" }} />

          <Radar
            name="Ciclo Atual (Empresa)"
            dataKey="media"
            stroke="#1e40af"
            fill="#1e40af"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          {data[0]?.mediaAnterior && (
            <Radar
              name="Ciclo Anterior"
              dataKey="mediaAnterior"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
