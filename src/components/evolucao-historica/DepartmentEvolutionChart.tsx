import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell, ReferenceLine } from "recharts";
import { DepartmentEvolution } from "@/lib/types";

interface DepartmentEvolutionChartProps {
  data: DepartmentEvolution[];
}

export function DepartmentEvolutionChart({ data }: DepartmentEvolutionChartProps) {
  // Sort data by variance for a clearer waterfall/diverging chart look
  const sortedData = [...data].sort((a, b) => b.variacao - a.variacao).slice(0, 10); // top 10 to keep it readable

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = Number(payload[0].value);
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm">
          <p className="font-semibold mb-1 text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2">
            <span>Variação Total:</span>
            <span className={`font-bold text-base ${val > 0 ? 'text-emerald-500' : val < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
              {val > 0 ? '+' : ''}{val.toFixed(2)} pts
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full min-h-[400px]">
      <div className="mb-6">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">Evolução por Departamento (Variação Absoluta)</h3>
        <p className="text-sm text-muted-foreground">Comparativo do saldo (último ciclo vs primeiro ciclo analisado).</p>
      </div>

      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart 
            data={sortedData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="departamento" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} 
              angle={-45}
              textAnchor="end"
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} />
            <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeOpacity={0.2} />
            <Bar 
              dataKey="variacao" 
              radius={[4, 4, 4, 4]} 
              barSize={30}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.variacao > 0 ? "hsl(var(--emerald-500))" : entry.variacao < 0 ? "hsl(var(--rose-500))" : "hsl(var(--slate-400))"} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
