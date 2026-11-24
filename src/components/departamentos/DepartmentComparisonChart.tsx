import { DepartmentStats } from "@/lib/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";

interface DepartmentComparisonChartProps {
  departamentos: DepartmentStats[];
  selectedDepartment: string | null;
  onSelectDepartment: (dept: string) => void;
  mediaGeral: number;
}

const CustomXAxisTick = ({ x, y, payload }: any) => {
  const words = payload.value.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word: string) => {
    if ((currentLine + word).length > 14) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  });
  if (currentLine) lines.push(currentLine.trim());

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="var(--muted-foreground)" fontSize={11}>
        {lines.map((line, index) => (
          <tspan x={0} dy={index === 0 ? 0 : 12} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export function DepartmentComparisonChart({
  departamentos,
  selectedDepartment,
  onSelectDepartment,
  mediaGeral,
}: DepartmentComparisonChartProps) {
  // Use tailwind primary color
  const primaryColor = "var(--primary)";

  // Parse media to ensure it is a number
  const data = [...departamentos].slice(0, 10).map((d) => ({
    name: d.departamento,
    fullName: d.departamento,
    media: Number(d.media) || 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-3 rounded-lg text-sm">
          <p className="font-semibold mb-1">{payload[0].payload.fullName}</p>
          <p className="text-muted-foreground">
            Média: <span className="font-bold text-foreground">{payload[0].value.toFixed(2)}</span>
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
          Desempenho Corporativo por Área
        </h3>
        <p className="text-sm text-muted-foreground">
          Comparativo das 10 principais áreas em nota média global.
        </p>
      </div>
      <div className="flex-1 min-h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 50, left: 10, bottom: 5 }}
            onClick={(state) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                onSelectDepartment(state.activePayload[0].payload.fullName);
              }
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="name"
              interval={0}
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="number"
              domain={[0, 4.0]}
              axisLine={false}
              tickLine={false}
              tick={false}
              width={0}
            />
            <RechartsTooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--muted)", opacity: 0.2 }}
            />
            {mediaGeral > 0 && (
              <ReferenceLine
                y={mediaGeral}
                stroke="#f97316"
                strokeDasharray="6 6"
                strokeWidth={3}
                label={{
                  value: mediaGeral.toFixed(2),
                  position: "right",
                  fill: "#f97316",
                  fontSize: 14,
                  fontWeight: "bold",
                  offset: 10,
                }}
              />
            )}
            <Bar
              dataKey="media"
              radius={[4, 4, 0, 0]}
              barSize={56}
              className="cursor-pointer transition-all duration-300"
            >
              <LabelList
                dataKey="media"
                position="top"
                formatter={(val: number) => val.toFixed(2)}
                fill="var(--foreground)"
                fontSize={12}
                fontWeight={600}
              />
              {data.map((entry, index) => {
                const isSelected = selectedDepartment === entry.fullName;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      isSelected
                        ? primaryColor
                        : "color-mix(in oklch, var(--primary) 40%, transparent)"
                    }
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
