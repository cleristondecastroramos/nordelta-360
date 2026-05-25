import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface RadarChartProps {
  data: any[];
  keys: string[];
  colors?: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover text-popover-foreground border shadow-sm rounded-lg p-3 max-w-[280px]">
        <p className="font-semibold text-sm mb-1 leading-tight">{label}</p>
        {data.descricao && (
          <p className="text-xs text-muted-foreground mb-3 leading-snug">{data.descricao}</p>
        )}
        <div className="space-y-1">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
              <span className="font-semibold ml-4">{Number(entry.value).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function RadarChart({ data, keys, colors = ["#2563eb", "#64748b", "#10b981", "#f59e0b"] }: RadarChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="competencia" tick={{ fill: "#64748b", fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {keys.map((key, i) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.3}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
