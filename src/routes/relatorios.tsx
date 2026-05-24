import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/relatorios")({
  component: RelatoriosPage,
});

function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Relatórios e Exportação</h2>
        <p className="text-muted-foreground">Extraia matrizes, consolidados PDF e planilhas de dados.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Consolidado Geral (CSV)", desc: "Dataset completo de notas do ciclo ativo." },
          { title: "Matriz 9 Box (PDF)", desc: "Cruzamento Potencial vs Desempenho." },
          { title: "Relatório de Departamentos (PDF)", desc: "Comparativo de médias por área." }
        ].map((item, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors">
            <FileText className="h-8 w-8 text-primary/50 mb-4" />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{item.desc}</p>
            <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center">
              <Download className="mr-2 h-4 w-4" /> Exportar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
