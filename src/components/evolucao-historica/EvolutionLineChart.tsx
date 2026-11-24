import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { EvolutionCycleData } from "@/lib/types";

interface EvolutionLineChartProps {
  data: EvolutionCycleData[];
  dataKeys: { key: string; color: string; label: string; isArea?: boolean }[];
}

export function EvolutionLineChart({ data, dataKeys }: EvolutionLineChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-4 rounded-xl text-sm min-w-[220px]">
          <p className="font-bold text-base mb-3 border-b pb-2">Ciclo: {label}</p>
          <div className="space-y-2.5">
            {payload.map((entry: any, index: number) => {
              // Get the matching label
              const keyObj = dataKeys.find((k) => k.key === entry.dataKey);
              const displayName = keyObj ? keyObj.label : entry.name;

              return (
                <div key={index} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-muted-foreground font-medium">{displayName}</span>
                  </div>
                  <span className="font-bold text-foreground text-base">
                    {Number(entry.value).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full min-h-[450px]">
      <div className="mb-6">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">
          Curva de Tendência Organizacional
        </h3>
        <p className="text-sm text-muted-foreground">
          Evolução da Nota Média Geral cruzada com as principais dimensões.
        </p>
      </div>
      <div className="flex-1 w-full min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGeral" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="ciclo"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              domain={[0, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickCount={6}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "13px", paddingTop: "20px", fontWeight: 500 }}
            />

            {dataKeys.map((k) =>
              k.isArea ? (
                <Area
                  key={k.key}
                  type="monotone"
                  dataKey={k.key}
                  name={k.label}
                  stroke={k.color}
                  fillOpacity={1}
                  fill="url(#colorGeral)"
                  strokeWidth={3}
                />
              ) : (
                <Line
                  key={k.key}
                  type="monotone"
                  dataKey={k.key}
                  name={k.label}
                  stroke={k.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "var(--background)", stroke: k.color, strokeWidth: 2 }}
                  activeDot={{
                    r: 6,
                    fill: k.color,
                    stroke: "var(--background)",
                    strokeWidth: 2,
                  }}
                  strokeDasharray={k.key !== "mediaGeral" ? "5 5" : ""}
                />
              ),
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
