import { Bar, BarChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

interface DepartmentCompositionChartProps {
  data: { name: string; total: number; lideranca: number; operacao: number }[];
}

export function DepartmentCompositionChart({ data }: DepartmentCompositionChartProps) {
  // Get top 8 departments to avoid cluttering
  const chartData = data.slice(0, 8).map(d => ({
    ...d,
    shortName: d.name.substring(0, 15) + (d.name.length > 15 ? "..." : "")
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm">
          <p className="font-semibold mb-2">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <p className="flex justify-between gap-4">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold">{payload[0].payload.total}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-emerald-500 font-medium">Liderança:</span>
              <span className="font-bold">{payload[0].payload.lideranca}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-primary font-medium">Operação:</span>
              <span className="font-bold">{payload[0].payload.operacao}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full">
      <div className="mb-6">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">Estrutura por Departamento</h3>
        <p className="text-sm text-muted-foreground">Proporção entre Liderança e Operação nas maiores áreas.</p>
      </div>
      <div className="flex-1 w-full min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 20, bottom: 5 }} layout="vertical" stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              type="number" 
              hide
            />
            <YAxis 
              type="category" 
              dataKey="shortName" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }} 
              width={110}
            />
            <RechartsTooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }} content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            <Bar dataKey="operacao" name="Operação" stackId="a" fill="#475569" radius={[0, 0, 0, 0]} />
            <Bar dataKey="lideranca" name="Liderança" stackId="a" fill="#1e40af" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
