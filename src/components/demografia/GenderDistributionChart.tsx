import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

interface GenderDistributionChartProps {
  data: { name: string; value: number; color: string }[];
}

export function GenderDistributionChart({ data }: GenderDistributionChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></div>
            <p className="font-semibold">{payload[0].name}</p>
          </div>
          <p className="text-muted-foreground">Total: <span className="font-bold text-foreground">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full">
      <div className="mb-4">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">Distribuição por Sexo</h3>
        <p className="text-sm text-muted-foreground">Composição de gênero da força de trabalho.</p>
      </div>
      <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
