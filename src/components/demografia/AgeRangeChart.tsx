import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";

interface AgeRangeChartProps {
  data: { name: string; value: number }[];
}

export function AgeRangeChart({ data }: AgeRangeChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm">
          <p className="font-semibold mb-1 text-muted-foreground">
            Faixa Etária: <span className="text-foreground">{payload[0].payload.name}</span>
          </p>
          <p className="text-muted-foreground">
            Colaboradores: <span className="font-bold text-primary">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full">
      <div className="mb-6">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">
          Estrutura Etária
        </h3>
        <p className="text-sm text-muted-foreground">Distribuição demográfica por geração.</p>
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis axisLine={false} tickLine={false} tick={false} />
            <RechartsTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.2 }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
              <LabelList
                dataKey="value"
                position="top"
                fill="var(--muted-foreground)"
                fontSize={12}
                fontWeight={600}
              />
              {data.map((entry, index) => {
                const colors = ["#1e40af", "#4338ca", "#0f766e", "#0369a1", "#64748b", "#334155"];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
