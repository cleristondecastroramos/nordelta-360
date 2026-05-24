import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Eye, FileText } from "lucide-react";
import { getColaboradoresList } from "@/lib/data-service";
import { StatusChip } from "@/components/ui/status-chip";

export const Route = createFileRoute("/colaboradores/")({
  component: ColaboradoresList,
});

function ColaboradoresList() {
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departamentoFilter, setDepartamentoFilter] = useState("Todos");

  useEffect(() => {
    async function load() {
      const data = await getColaboradoresList();
      setColaboradores(data);
      setLoading(false);
    }
    load();
  }, []);

  const departamentos = ["Todos", ...Array.from(new Set(colaboradores.map(c => c.departamento)))].sort();

  const filteredData = colaboradores.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.matricula.includes(searchTerm);
    const matchesDepto = departamentoFilter === "Todos" || c.departamento === departamentoFilter;
    return matchesSearch && matchesDepto;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Colaboradores</h2>
          <p className="text-muted-foreground">
            Gestão do ciclo 360° e acompanhamento de equipe.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-muted/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou matrícula..."
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <select 
              className="flex h-9 w-full sm:w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={departamentoFilter}
              onChange={(e) => setDepartamentoFilter(e.target.value)}
            >
              {departamentos.map(d => (
                <option key={d} value={d}>{d === "Todos" ? "Todos os Departamentos" : d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Matrícula</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cargo / Departamento</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nota Atual</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center">Carregando colaboradores...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-muted-foreground">Nenhum colaborador encontrado.</td>
                </tr>
              ) : (
                filteredData.map((colab) => (
                  <tr key={colab.matricula} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{colab.matricula}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {colab.nome.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{colab.nome}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span>{colab.cargo}</span>
                        <span className="text-xs text-muted-foreground">{colab.departamento}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle font-semibold text-primary">
                      {colab.notaMediaGeral.toFixed(2)}
                    </td>
                    <td className="p-4 align-middle">
                      <StatusChip variant={colab.estado === "Ativo" ? "success" : "default"}>
                        {colab.estado}
                      </StatusChip>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/colaboradores/${colab.matricula}`}
                          className="inline-flex items-center justify-center rounded-md border border-input bg-background h-8 w-8 hover:bg-accent hover:text-accent-foreground"
                          title="Ficha Individual"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button 
                          className="inline-flex items-center justify-center rounded-md border border-input bg-background h-8 w-8 hover:bg-accent hover:text-accent-foreground"
                          title="Relatório PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
