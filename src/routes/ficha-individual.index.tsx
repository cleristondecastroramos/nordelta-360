import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { colaboradoresQuery } from "@/lib/queries";
import { useState } from "react";
import { Search, UserCheck } from "lucide-react";

export const Route = createFileRoute("/ficha-individual/")({
  component: FichaIndividualIndex,
});

function FichaIndividualIndex() {
  const { data: colaboradores = [], isPending: loading } = useQuery(colaboradoresQuery);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = colaboradores.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.nome.toLowerCase().includes(search) ||
      c.matricula.includes(searchTerm) ||
      (c.cargo && c.cargo.toLowerCase().includes(search))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-primary" />
            Ficha Individual
          </h2>
          <p className="text-muted-foreground">
            Busque e selecione um colaborador para visualizar seu perfil detalhado de avaliação.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b bg-muted/10">
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome, matrícula ou cargo..."
              className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-900/20">
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Carregando colaboradores...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-12">
              <UserCheck className="h-16 w-16 text-slate-300 dark:text-slate-700" />
              <p className="text-lg">Nenhum colaborador encontrado.</p>
              <p className="text-sm text-slate-500">Tente buscar com outros termos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredData.slice(0, 24).map((colab) => (
                <Link
                  key={colab.matricula}
                  to="/ficha-individual/$matricula"
                  params={{ matricula: colab.matricula }}
                  className="flex items-center gap-4 p-4 rounded-xl border bg-background hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  {colab.avatar_url ? (
                    <img
                      src={colab.avatar_url}
                      alt={colab.nome}
                      className="h-12 w-12 rounded-full border border-border object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(colab.nome)}&background=1e40af&color=fff&size=48`;
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {colab.nome.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {colab.nome}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{colab.cargo}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                      {colab.matricula}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredData.length > 24 && (
            <div className="mt-8 text-center">
              <div className="text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800 p-3 rounded-lg inline-block mx-auto">
                Mostrando 24 de {filteredData.length} resultados. Use a busca acima para encontrar
                um colaborador específico.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
