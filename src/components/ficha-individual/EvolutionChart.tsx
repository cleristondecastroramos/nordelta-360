import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Area,
  ComposedChart,
} from "recharts";
import { ColaboradorResultados } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface EvolutionChartProps {
  data: ColaboradorResultados["historicoCiclos"];
}

export function EvolutionChart({ data }: EvolutionChartProps) {
  if (!data || data.length === 0) return null;

  // Calculate overall trend
  const firstScore = data[0].mediaGeral;
  const lastScore = data[data.length - 1].mediaGeral;
  const diff = lastScore - firstScore;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm">
          <p className="font-semibold mb-1 text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Nota Geral:</span>
            <span className="font-bold text-lg text-foreground">
              {Number(payload[0].value).toFixed(2)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">Histórico de Performance</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhamento evolutivo da Nota Média Geral ao longo do tempo.
          </p>
        </div>

        {data.length > 1 && (
          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Tendência Histórica
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {diff > 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : diff < 0 ? (
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                ) : (
                  <Minus className="h-4 w-4 text-slate-500" />
                )}
                <span
                  className={`font-bold ${diff > 0 ? "text-emerald-600 dark:text-emerald-400" : diff < 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-400"}`}
                >
                  {diff > 0 ? "+" : ""}
                  {diff.toFixed(2)} pts
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[350px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="ciclo"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              domain={[0, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickCount={6}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mediaGeral"
              stroke="none"
              fillOpacity={1}
              fill="url(#colorScore)"
            />
            <Line
              type="monotone"
              dataKey="mediaGeral"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "hsl(var(--background))",
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {data.map((h, i) => (
          <div
            key={i}
            className="flex flex-col p-4 border rounded-xl bg-card hover:border-primary/50 transition-colors"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              {h.ciclo}
            </span>
            <span className="font-bold text-2xl text-foreground">{h.mediaGeral.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
