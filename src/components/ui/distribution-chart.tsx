import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { DistributionData } from "@/lib/types";

interface DistributionChartProps {
  data: DistributionData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Faixa de Nota: {label}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Quantidade:{" "}
          <span className="font-bold text-primary">{payload[0].value} colaboradores</span>
        </p>
      </div>
    );
  }
  return null;
};

export function DistributionChart({ data }: DistributionChartProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 25, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
            className="dark:stroke-slate-800"
          />
          <XAxis
            dataKey="range"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip cursor={{ fill: "rgba(30, 64, 175, 0.05)" }} content={<CustomTooltip />} />
          <Bar dataKey="quantidade" fill="#1e40af" radius={[4, 4, 0, 0]} animationDuration={1500}>
            <LabelList
              dataKey="quantidade"
              position="top"
              fill="#64748b"
              fontSize={12}
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
