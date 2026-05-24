import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";

export const Route = createFileRoute("/ciclos")({
  component: CiclosPage,
});

function CiclosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ciclos 360°</h2>
          <p className="text-muted-foreground">Administre as campanhas de avaliação de desempenho.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Ciclo
        </button>
      </div>

      <div className="rounded-xl border bg-card p-8 text-center text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold">Módulo de Ciclos em Breve</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          A interface para criação e monitoramento de ciclos em tempo real (com wizard multi-step) será implementada na próxima iteração do sistema.
        </p>
      </div>
    </div>
  );
}
