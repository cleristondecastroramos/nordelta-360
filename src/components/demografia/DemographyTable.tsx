import { Colaborador } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Search } from "lucide-react";
import { useState } from "react";

interface DemographyTableProps {
  colaboradores: Colaborador[];
}

export function DemographyTable({ colaboradores }: DemographyTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = colaboradores.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.departamento || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.cargo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 pb-4 border-b bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold leading-none tracking-tight text-lg mb-1.5 flex items-center gap-2">
              Detalhamento de Colaboradores
            </h3>
            <p className="text-sm text-muted-foreground">Listagem completa com os recortes demográficos.</p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar por nome, cargo ou área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Colaborador</th>
              <th className="px-4 py-4 font-semibold whitespace-nowrap">Área / Departamento</th>
              <th className="px-4 py-4 font-semibold whitespace-nowrap">Gênero</th>
              <th className="px-4 py-4 font-semibold whitespace-nowrap text-center">Idade</th>
              <th className="px-4 py-4 font-semibold whitespace-nowrap hidden md:table-cell">Localização</th>
              <th className="px-4 py-4 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum colaborador encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              filtered.slice(0, 100).map((colab) => (
                <tr key={colab.matricula} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={colab.avatar_url} 
                        alt={colab.nome} 
                        className="w-9 h-9 rounded-full border border-border object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{colab.nome}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{colab.cargo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                    {colab.departamento || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground capitalize">
                      {colab.sexo || "Não Informado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {colab.idade ? `${colab.idade} anos` : "-"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {colab.estado_uf || "SP"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link 
                      to="/ficha-individual/$matricula"
                      params={{ matricula: colab.matricula }}
                      className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Ver Ficha"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filtered.length > 100 && (
          <div className="p-4 text-center text-xs text-muted-foreground bg-muted/10">
            Mostrando os 100 primeiros resultados. Refine sua busca para ver outros.
          </div>
        )}
      </div>
    </div>
  );
}
