import { Bar, BarChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

interface LocationMapChartProps {
  data: { name: string; value: number }[];
}

export function LocationMapChart({ data }: LocationMapChartProps) {
  // Top 5 locations
  const chartData = data.slice(0, 5);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Localidade</span>
            <span className="font-bold text-base">{payload[0].payload.name}</span>
          </div>
          <div className="h-8 w-px bg-border mx-1"></div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Headcount</span>
            <span className="font-bold text-primary text-base">{payload[0].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full">
      <div className="mb-6">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">Distribuição Regional</h3>
        <p className="text-sm text-muted-foreground">Principais polos de concentração de talentos.</p>
      </div>
      <div className="flex-1 w-full min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 600 }} 
              width={80}
            />
            <RechartsTooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }} content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
              {chartData.map((entry, index) => {
                const colors = ["#0f766e", "#1d4ed8", "#334155", "#b45309", "#4338ca"];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
