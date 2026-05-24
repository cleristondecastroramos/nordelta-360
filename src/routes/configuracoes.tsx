import { createFileRoute } from "@tanstack/react-router";
import { Settings, Shield, Sliders, Database } from "lucide-react";

export const Route = createFileRoute("/configuracoes")({
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Parâmetros de sistema, acessos e regras de cálculo.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Regras de Anonimato</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Defina o número mínimo de avaliadores por grupo para que a nota não seja consolidada com outro grupo.
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pares (mínimo)</span>
              <input type="number" defaultValue={3} className="w-16 rounded-md border border-input px-3 py-1 text-sm" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Subordinados (mínimo)</span>
              <input type="number" defaultValue={3} className="w-16 rounded-md border border-input px-3 py-1 text-sm" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Sliders className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Pesos do Índice de Potencial</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Multiplicadores usados para calcular o potencial do colaborador com base nas notas de competência.
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Liderança</span>
              <input type="text" defaultValue="1.5x" className="w-16 rounded-md border border-input px-3 py-1 text-sm" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Inovação</span>
              <input type="text" defaultValue="1.2x" className="w-16 rounded-md border border-input px-3 py-1 text-sm" />
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Gerenciamento de Dados (CSV)</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Faça o upload manual dos arquivos de dados para atualizar o sistema em tempo real.
          </p>
          <div className="flex gap-4">
            <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              Atualizar Profiles (CSV)
            </button>
            <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              Atualizar Avaliações (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
