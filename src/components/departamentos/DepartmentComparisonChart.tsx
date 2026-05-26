import { DepartmentStats } from "@/lib/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell
} from "recharts";

interface DepartmentComparisonChartProps {
  departamentos: DepartmentStats[];
  selectedDepartment: string | null;
  onSelectDepartment: (dept: string) => void;
}

export function DepartmentComparisonChart({
  departamentos,
  selectedDepartment,
  onSelectDepartment
}: DepartmentComparisonChartProps) {
  // Use tailwind primary and muted colors
  const primaryColor = "hsl(var(--primary))";
  const mutedColor = "hsl(var(--muted))";
  const accentColor = "hsl(var(--emerald-500))";

  // Sort by name or keep as is (ranking order). Let's keep ranking order for now.
  const data = [...departamentos].slice(0, 10).map(d => ({
    name: d.departamento.substring(0, 15) + (d.departamento.length > 15 ? "..." : ""),
    fullName: d.departamento,
    media: d.media
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm">
          <p className="font-semibold mb-1">{payload[0].payload.fullName}</p>
          <p className="text-muted-foreground">Média Geral: <span className="font-bold text-foreground">{payload[0].value.toFixed(2)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full">
      <div className="mb-6">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">Desempenho Corporativo por Área</h3>
        <p className="text-sm text-muted-foreground">Comparativo das 10 principais áreas em nota média global.</p>
      </div>
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={(state) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                onSelectDepartment(state.activePayload[0].payload.fullName);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              type="number" 
              domain={[0, 5]} 
              tickCount={6} 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={120} 
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 500 }} 
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }} />
            <Bar 
              dataKey="media" 
              radius={[0, 4, 4, 0]}
              barSize={24}
              className="cursor-pointer transition-all duration-300"
            >
              {data.map((entry, index) => {
                const isSelected = selectedDepartment === entry.fullName;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isSelected ? primaryColor : "hsl(var(--primary) / 0.4)"} 
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
