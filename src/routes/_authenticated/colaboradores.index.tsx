import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/colaboradores/")({
  component: ColaboradoresList,
  head: () => ({ meta: [{ title: "Colaboradores — Nordelta 360°" }] }),
});

function ColaboradoresList() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["colaboradores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("matricula, nome, cargo, departamento, email, estado")
        .order("nome")
        .limit(1000);
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = q.trim().toLowerCase();
    if (!term) return data;
    return data.filter(
      (c) =>
        c.nome?.toLowerCase().includes(term) ||
        c.matricula?.toLowerCase().includes(term) ||
        c.cargo?.toLowerCase().includes(term) ||
        c.departamento?.toLowerCase().includes(term),
    );
  }, [data, q]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Colaboradores</h1>
          <p className="text-sm text-muted-foreground">
            {data ? `${data.length} colaboradores cadastrados` : "Carregando…"}
          </p>
        </div>
        <Input
          placeholder="Buscar por nome, matrícula, cargo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matrícula</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Carregando…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum colaborador encontrado.
                </TableCell>
              </TableRow>
            )}
            {filtered.slice(0, 200).map((c) => (
              <TableRow key={c.matricula}>
                <TableCell className="font-mono text-xs">{c.matricula}</TableCell>
                <TableCell className="font-medium">
                  <Link
                    to="/colaboradores/$matricula"
                    params={{ matricula: c.matricula }}
                    className="hover:underline"
                  >
                    {c.nome}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.cargo ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.departamento ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={c.estado === "ATIVO" ? "default" : "secondary"}>
                    {c.estado ?? "—"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length > 200 && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            Mostrando 200 de {filtered.length} resultados — refine a busca.
          </div>
        )}
      </Card>
    </div>
  );
}