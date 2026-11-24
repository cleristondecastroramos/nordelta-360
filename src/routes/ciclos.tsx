import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CycleConfig, CycleStatus } from "@/lib/cycle-types";
import { CycleList } from "@/components/ciclos/cycle-list";
import { CycleWizard } from "@/components/ciclos/cycle-wizard";
import { CycleMonitor } from "@/components/ciclos/cycle-monitor";

export const Route = createFileRoute("/ciclos")({
  component: CiclosPage,
});

const mockCycles: CycleConfig[] = [
  {
    id: "c-2024-1",
    nome: "Avaliação 360° - 1º Semestre 2024",
    objetivo: "Avaliação de performance semestral.",
    descricao:
      "Ciclo principal de avaliação de desempenho de 2024 com foco em plano de carreira e bônus.",
    dataInicio: "01/03/2024",
    dataFim: "30/03/2024",
    departamentos: ["Comercial", "Tecnologia", "Recursos Humanos", "Marketing", "Operações"],
    cargosElegiveis: ["Todos"],
    totalParticipantes: 614,
    permiteAutoavaliacao: true,
    paresAvaliamPares: true,
    gestorAvaliaSubordinado: true,
    minRespostasPorGrupo: 3,
    anonimatoAtivado: true,
    poolingMinimo: 3,
    comentariosSensiveisOcultos: true,
    status: "Encerrado",
  },
  {
    id: "c-2024-2",
    nome: "Avaliação de Liderança - Q3",
    objetivo: "Feedback exclusivo para gestores.",
    descricao:
      "Avaliação bottom-up para todos os líderes da companhia, focada no desenvolvimento de gestão de pessoas.",
    dataInicio: "15/08/2024",
    dataFim: "15/09/2024",
    departamentos: ["Comercial", "Tecnologia", "Operações"],
    cargosElegiveis: ["Diretor", "Gerente", "Coordenador"],
    totalParticipantes: 125,
    permiteAutoavaliacao: true,
    paresAvaliamPares: false,
    gestorAvaliaSubordinado: false,
    minRespostasPorGrupo: 3,
    anonimatoAtivado: true,
    poolingMinimo: 3,
    comentariosSensiveisOcultos: false,
    status: "Em andamento",
  },
];

type ViewState = "list" | "wizard" | "monitor";

function CiclosPage() {
  const [view, setView] = useState<ViewState>("list");
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [cycles, setCycles] = useState<CycleConfig[]>(mockCycles);

  const handleCreateNew = () => {
    setView("wizard");
    setActiveCycleId(null);
  };

  const handleViewCycle = (id: string) => {
    setActiveCycleId(id);
    setView("monitor");
  };

  const handleCancelWizard = () => {
    setView("list");
  };

  const handleSaveWizard = (newCycle: CycleConfig) => {
    setCycles((prev) => [newCycle, ...prev]);
    setView("list");
  };

  const handleBackToList = () => {
    setView("list");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {view === "list" && (
        <CycleList cycles={cycles} onCreateNew={handleCreateNew} onViewCycle={handleViewCycle} />
      )}

      {view === "wizard" && <CycleWizard onCancel={handleCancelWizard} onSave={handleSaveWizard} />}

      {view === "monitor" && activeCycleId && (
        <CycleMonitor
          cycleId={activeCycleId}
          cycleConfig={cycles.find((c) => c.id === activeCycleId)}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}
