import React from "react";

interface LocationMapChartProps {
  data: { name: string; value: number }[];
}

export function LocationMapChart({ data }: LocationMapChartProps) {
  // Sort data so the highest is at the top (data should already be sorted from data-service, but just in case)
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = sortedData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6 h-full max-h-[500px]">
      <div className="mb-4 shrink-0">
        <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5">
          Distribuição Regional
        </h3>
        <p className="text-sm text-muted-foreground">Listagem completa de polos e bairros.</p>
      </div>

      <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 border rounded-md">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-muted/50 sticky top-0 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Localidade</th>
              <th className="px-4 py-3 font-medium text-right">Headcount</th>
              <th className="px-4 py-3 font-medium text-right">%</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedData.map((item, index) => {
              const perc = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
              return (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-medium">{item.name}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-primary">
                    {item.value}
                  </td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{perc}%</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0 bg-muted/80 backdrop-blur-sm border-t font-semibold">
            <tr>
              <td className="px-4 py-3">Total</td>
              <td className="px-4 py-3 text-right text-primary">{total}</td>
              <td className="px-4 py-3 text-right">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
