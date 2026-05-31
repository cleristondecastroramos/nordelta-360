import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

interface TenureDistributionChartProps {
  data: { name: string; value: number; color: string }[];
}

export function TenureDistributionChart({ data }: TenureDistributionChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm">
          <p className="font-semibold mb-1 text-muted-foreground">Tempo: <span className="text-foreground">{payload[0].payload.name}</span></p>
          <p className="text-muted-foreground">Colaboradores: <span className="font-bold text-primary">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full">
      <div className="mb-6">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">Tempo de Empresa</h3>
        <p className="text-sm text-muted-foreground">Distribuição por tempo de serviço.</p>
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
            <Legend 
              verticalAlign="bottom" 
              height={36}
              content={(props) => {
                const { payload } = props;
                return (
                  <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] pt-5">
                    {payload?.map((entry, index) => {
                      const perc = total > 0 ? ((entry.payload.value / total) * 100).toFixed(0) : 0;
                      return (
                        <li key={`item-${index}`} className="flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-muted-foreground">{entry.value} ({perc}%)</span>
                        </li>
                      );
                    })}
                  </ul>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
