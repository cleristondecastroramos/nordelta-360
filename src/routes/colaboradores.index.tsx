import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Eye, FileText, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
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
  const [cargoFilter, setCargoFilter] = useState("Todos");
  const [faixaEtariaFilter, setFaixaEtariaFilter] = useState("Todos");
  const [tempoEmpresaFilter, setTempoEmpresaFilter] = useState("Todos");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>({ key: 'notaMediaGeral', direction: 'desc' });

  useEffect(() => {
    async function load() {
      const data = await getColaboradoresList();
      setColaboradores(data);
      setLoading(false);
    }
    load();
  }, []);

  const departamentos = ["Todos", ...Array.from(new Set(colaboradores.map(c => c.departamento).filter(Boolean)))].sort();
  
  const cargos = ["Todos", ...Array.from(new Set(
    colaboradores
      .filter(c => departamentoFilter === "Todos" || c.departamento === departamentoFilter)
      .map(c => c.cargo)
      .filter(Boolean)
  ))].sort();

  const faixasEtarias = ["Todos", "18-25", "26-35", "36-45", "46-55", "56+"];
  const temposEmpresa = ["Todos", "Até 1 ano", "1 a 3 anos", "3 a 5 anos", "5 a 10 anos", "Mais de 10 anos"];

  const getIdadeGroup = (idade: number | undefined) => {
    if (!idade) return null;
    if (idade <= 25) return "18-25";
    if (idade <= 35) return "26-35";
    if (idade <= 45) return "36-45";
    if (idade <= 55) return "46-55";
    return "56+";
  };

  const getTenureGroup = (data_admissao: string | undefined) => {
    if (!data_admissao) return null;
    const admission = new Date(data_admissao);
    const diff = new Date().getTime() - admission.getTime();
    const anos = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (anos <= 1) return "Até 1 ano";
    if (anos <= 3) return "1 a 3 anos";
    if (anos <= 5) return "3 a 5 anos";
    if (anos <= 10) return "5 a 10 anos";
    return "Mais de 10 anos";
  };

  const filteredData = colaboradores.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.matricula.includes(searchTerm);
    const matchesDepto = departamentoFilter === "Todos" || c.departamento === departamentoFilter;
    const matchesCargo = cargoFilter === "Todos" || c.cargo === cargoFilter;
    const matchesIdade = faixaEtariaFilter === "Todos" || getIdadeGroup(c.idade) === faixaEtariaFilter;
    const matchesTempo = tempoEmpresaFilter === "Todos" || getTenureGroup(c.data_admissao) === tempoEmpresaFilter;
    
    return matchesSearch && matchesDepto && matchesCargo && matchesIdade && matchesTempo;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let aVal = a[key];
    let bVal = b[key];
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground opacity-40 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="ml-1.5 h-4 w-4 text-primary" /> 
      : <ChevronDown className="ml-1.5 h-4 w-4 text-primary" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Colaboradores</h2>
          <p className="text-muted-foreground">
            Gestão do ciclo 360° e acompanhamento de equipe.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-muted/10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar colaborador..."
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              value={departamentoFilter}
              onChange={(e) => {
                const newDept = e.target.value;
                setDepartamentoFilter(newDept);
                
                // Valida se o cargo atual existe no novo departamento
                const validCargos = Array.from(new Set(
                  colaboradores
                    .filter(c => newDept === "Todos" || c.departamento === newDept)
                    .map(c => c.cargo)
                ));
                if (cargoFilter !== "Todos" && !validCargos.includes(cargoFilter)) {
                  setCargoFilter("Todos");
                }
              }}
            >
              {departamentos.map(d => (
                <option key={d} value={d}>{d === "Todos" ? "Departamento" : d}</option>
              ))}
            </select>

            <select 
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              value={cargoFilter}
              onChange={(e) => setCargoFilter(e.target.value)}
            >
              {cargos.map(c => (
                <option key={c} value={c}>{c === "Todos" ? "Cargo" : c}</option>
              ))}
            </select>

            <select 
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              value={faixaEtariaFilter}
              onChange={(e) => setFaixaEtariaFilter(e.target.value)}
            >
              {faixasEtarias.map(f => (
                <option key={f} value={f}>{f === "Todos" ? "Faixa Etária" : f}</option>
              ))}
            </select>

            <select 
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              value={tempoEmpresaFilter}
              onChange={(e) => setTempoEmpresaFilter(e.target.value)}
            >
              {temposEmpresa.map(t => (
                <option key={t} value={t}>{t === "Todos" ? "Tempo de Empresa" : t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-slate-100 dark:bg-slate-800/80">
              <tr className="border-b transition-colors">
                <th 
                  className="h-12 px-4 text-left align-middle font-semibold text-foreground cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/60 group select-none transition-colors"
                  onClick={() => handleSort('matricula')}
                >
                  <div className="flex items-center">Matrícula {getSortIcon('matricula')}</div>
                </th>
                <th 
                  className="h-12 px-4 text-left align-middle font-semibold text-foreground cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/60 group select-none transition-colors"
                  onClick={() => handleSort('nome')}
                >
                  <div className="flex items-center">Nome {getSortIcon('nome')}</div>
                </th>
                <th 
                  className="h-12 px-4 text-left align-middle font-semibold text-foreground cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/60 group select-none transition-colors"
                  onClick={() => handleSort('cargo')}
                >
                  <div className="flex items-center">Cargo / Departamento {getSortIcon('cargo')}</div>
                </th>
                <th 
                  className="h-12 px-4 text-left align-middle font-semibold text-foreground cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/60 group select-none transition-colors"
                  onClick={() => handleSort('notaMediaGeral')}
                >
                  <div className="flex items-center">Nota Atual {getSortIcon('notaMediaGeral')}</div>
                </th>
                <th 
                  className="h-12 px-4 text-left align-middle font-semibold text-foreground cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/60 group select-none transition-colors"
                  onClick={() => handleSort('estado')}
                >
                  <div className="flex items-center">Status {getSortIcon('estado')}</div>
                </th>
                <th className="h-12 px-4 text-right align-middle font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center">Carregando colaboradores...</td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-muted-foreground">Nenhum colaborador encontrado.</td>
                </tr>
              ) : (
                sortedData.map((colab) => (
                  <tr key={colab.matricula} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{colab.matricula}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        {colab.avatar_url ? (
                          <img 
                            src={colab.avatar_url} 
                            alt={colab.nome} 
                            className="h-8 w-8 rounded-full border border-border object-cover" 
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(colab.nome)}&background=1e40af&color=fff&size=32`;
                            }}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {colab.nome.substring(0, 2).toUpperCase()}
                          </div>
                        )}
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
