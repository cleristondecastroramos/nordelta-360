import { ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadarChart as RechartsRadar, Radar, Legend, Tooltip as RechartsTooltip } from "recharts";
import { Info } from "lucide-react";

interface RadarComparisonPanelProps {
  data: any[];
  isLideranca: boolean;
}

export function RadarComparisonPanel({ data, isLideranca }: RadarComparisonPanelProps) {
  // Format data for Recharts
  const chartData = data.map(c => ({
    competencia: c.competencia.split(" ")[0], // Use short name for radar
    fullCompetencia: c.competencia,
    Autoavaliação: c.mediaAuto,
    Gestor: c.mediaGestor,
    Pares: c.mediaPares,
    ...(isLideranca ? { Subordinados: c.mediaSubordinados } : {})
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fullLabel = chartData.find(d => d.competencia === label)?.fullCompetencia || label;
      return (
        <div className="bg-popover text-popover-foreground border border-border shadow-xl p-4 rounded-xl text-sm min-w-[200px]">
          <p className="font-bold text-base mb-3 border-b pb-2">{fullLabel}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-muted-foreground font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-foreground">{Number(entry.value).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full min-h-[450px]">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">Radar Analítico 360°</h3>
          <p className="text-sm text-muted-foreground">Comparativo de percepção entre todos os grupos avaliadores.</p>
        </div>
        <div className="p-2 bg-muted/50 rounded-md" title="Mapeamento completo das 12 competências do ciclo.">
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex-1 w-full flex items-center justify-center mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="competencia" 
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }} 
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 5]} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickCount={6}
            />
            
            <Radar 
              name="Autoavaliação" 
              dataKey="Autoavaliação" 
              stroke="#94a3b8" 
              fill="#94a3b8" 
              fillOpacity={0.1} 
              strokeWidth={2}
            />
            <Radar 
              name="Gestor" 
              dataKey="Gestor" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.3} 
              strokeWidth={2.5}
            />
            <Radar 
              name="Pares" 
              dataKey="Pares" 
              stroke="#eab308" 
              fill="#eab308" 
              fillOpacity={0.1} 
              strokeWidth={2}
            />
            {isLideranca && (
              <Radar 
                name="Subordinados" 
                dataKey="Subordinados" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.1} 
                strokeWidth={2}
              />
            )}
            
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500 }} 
              iconType="circle" 
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
