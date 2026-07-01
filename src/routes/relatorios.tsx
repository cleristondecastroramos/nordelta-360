import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/relatorios")({
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const handleExport = async (title: string) => {
    try {
      if (title.includes("Planilha")) {
        const headers = ["Matrícula", "Nome", "Departamento", "Nota Final", "Potencial", "Status"];
        const rows = [
          ["A1042", "Mariana Silva", "Comercial", "4.2", "Alto", "Aprovado"],
          ["S1005", "Roberto Medina", "Sucesso do Cliente", "2.8", "Médio", "Reprovado"],
          ["G1010", "Renata Nunes", "Produto", "4.4", "Alto", "Aprovado"],
          ["D1001", "João Silva", "Comercial", "4.2", "Muito Alto", "Aprovado"],
        ];
        
        const csvContent = [
          headers.join(";"),
          ...rows.map(row => row.join(";"))
        ].join("\n");
        
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${title.replace(/ /g, "_").toLowerCase()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // PDF Export using jsPDF dynamically
        const { default: jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text("NORDELTA 360 - Relatório Oficial", 20, 20);
        
        doc.setFontSize(16);
        doc.text(title, 20, 35);
        
        doc.setFontSize(12);
        doc.text("Gerado em: " + new Date().toLocaleString('pt-BR'), 20, 45);
        
        doc.text("Este documento contém informações confidenciais do ciclo de avaliação atual.", 20, 60);
        doc.text("Os dados completos podem ser acessados através da plataforma.", 20, 68);
        
        doc.save(`${title.replace(/ /g, "_").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()}.pdf`);
      }
    } catch (err) {
      console.error("Error exporting file:", err);
      alert("Ocorreu um erro ao gerar o arquivo. Tente novamente.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Relatórios e Exportação</h2>
        <p className="text-muted-foreground">Extraia matrizes, consolidados PDF e planilhas de dados.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Consolidado Geral (Planilha)", desc: "Dataset completo de notas do ciclo ativo." },
          { title: "Matriz 9 Box (PDF)", desc: "Cruzamento Potencial vs Desempenho." },
          { title: "Relatório de Departamentos (PDF)", desc: "Comparativo de médias por área." }
        ].map((item, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors flex flex-col h-full">
            <FileText className="h-8 w-8 text-primary/50 mb-4" />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1">{item.desc}</p>
            <button 
              onClick={() => handleExport(item.title)}
              className="mt-auto inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground shadow-sm w-full"
            >
              <Download className="mr-2 h-4 w-4" /> Exportar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
