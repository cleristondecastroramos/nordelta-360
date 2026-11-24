import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { HistoricoCiclo } from "@/lib/types";

interface LineChartProps {
  data: HistoricoCiclo[];
}

export function LineChart({ data }: LineChartProps) {
  const currentAverage = data.length > 0 ? data[data.length - 1].mediaGeral : 0;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
            className="dark:stroke-slate-800"
          />
          <XAxis
            dataKey="ciclo"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            domain={[1, 5]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            dx={-10}
            ticks={[1, 2, 3, 4, 5]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
            formatter={(value: number) => [value.toFixed(2), "Média Geral"]}
          />
          <ReferenceLine y={currentAverage} stroke="#94a3b8" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="mediaGeral"
            stroke="#1e40af"
            strokeWidth={3}
            dot={{ r: 6, fill: "#1e40af", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 8, fill: "#1e40af", stroke: "#fff", strokeWidth: 2 }}
            animationDuration={1500}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
