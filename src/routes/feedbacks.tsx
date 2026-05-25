import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CalibrationData, FeedbackStatus } from "@/lib/feedback-types";
import { FeedbackList } from "@/components/feedbacks/feedback-list";
import { CalibrationMatrix } from "@/components/feedbacks/calibration-matrix";

export const Route = createFileRoute("/feedbacks")({
  component: FeedbacksPage,
});

const mockData: CalibrationData[] = [
  {
    id: "f-1001",
    colaboradorMatricula: "1001",
    colaboradorNome: "João Silva",
    colaboradorCargo: "Diretor de Vendas",
    colaboradorDepartamento: "Comercial",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/men/44.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 4.2,
    notaCalibrada: 4.2,
    pontosFortes: ["Orientação para Resultados", "Liderança Inspiradora", "Comunicação Assertiva"],
    oportunidades: ["Delegação de Tarefas", "Documentação de Processos"],
    resumoFeedback: "João apresenta um desempenho excepcional em liderar a equipe comercial para bater metas consistentes. O comitê observa, no entanto, que ele frequentemente sobrecarrega-se por não delegar adequadamente as operações táticas aos gerentes de conta.",
    observacaoGestor: "",
    observacaoRh: "",
    status: "Aprovado",
    historico: [
      {
        id: "log-1",
        autor: "Mariana Costa",
        cargoAutor: "VP Comercial",
        dataHora: "24/05/2024 14:30",
        acao: "Alteração de Status",
        detalhe: "Feedback aprovado sem ressalvas.",
      }
    ]
  },
  {
    id: "f-1002",
    colaboradorMatricula: "1002",
    colaboradorNome: "Maria Souza",
    colaboradorCargo: "Gerente de Projetos",
    colaboradorDepartamento: "Operações",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 3.8,
    notaCalibrada: 4.0,
    pontosFortes: ["Organização", "Trabalho em Equipe"],
    oportunidades: ["Visão Sistêmica", "Inovação"],
    resumoFeedback: "Maria é uma engrenagem fundamental nas operações, mantendo prazos e orçamentos sob controle. O feedback 360 aponta que ela pode ser mais flexível ao lidar com mudanças repentinas de escopo.",
    observacaoGestor: "Ajustei a nota para 4.0 pois a métrica original não levou em conta os projetos emergenciais que ela assumiu sozinha no Q1.",
    observacaoRh: "De acordo. A entrega emergencial justifica o bump na nota de adaptação.",
    status: "Em Revisão",
    historico: [
      {
        id: "log-2",
        autor: "Roberto Alves",
        cargoAutor: "Diretor de Operações",
        dataHora: "22/05/2024 10:15",
        acao: "Edição de Nota",
        detalhe: "Nota calibrada de 3.80 para 4.00.",
        comentario: "Ajuste por conta dos projetos de contingência no Q1."
      }
    ]
  },
  {
    id: "f-1003",
    colaboradorMatricula: "1003",
    colaboradorNome: "Carlos Oliveira",
    colaboradorCargo: "Desenvolvedor Senior",
    colaboradorDepartamento: "Tecnologia",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 4.8,
    notaCalibrada: 4.8,
    pontosFortes: ["Conhecimento Técnico", "Resolução de Problemas", "Mentoria"],
    oportunidades: ["Comunicação Não-Técnica"],
    resumoFeedback: "Carlos é a principal referência técnica da equipe. Suas entregas são de altíssima qualidade. O único ponto de atenção é a forma como ele traduz requisitos técnicos para a equipe de negócios, que às vezes gera ruído.",
    observacaoGestor: "",
    observacaoRh: "",
    status: "Pendente",
    historico: []
  }
];

function FeedbacksPage() {
  const [view, setView] = useState<"list" | "calibration">("list");
  const [feedbacks, setFeedbacks] = useState<CalibrationData[]>(mockData);
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);

  const handleReview = (id: string) => {
    setActiveFeedbackId(id);
    setView("calibration");
  };

  const handleBack = () => {
    setView("list");
    setActiveFeedbackId(null);
  };

  const handleSaveCalibration = (id: string, updates: Partial<CalibrationData>, comment?: string) => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === id) {
        const newLog = {
          id: `log-${Date.now()}`,
          autor: "Usuário Atual",
          cargoAutor: "Analista de RH",
          dataHora: new Date().toLocaleString('pt-BR'),
          acao: (updates.notaCalibrada && updates.notaCalibrada !== f.notaCalibrada) ? "Edição de Nota" : "Alteração de Status",
          detalhe: updates.status === "Aprovado" ? "Feedback aprovado." : 
                   updates.status === "Reprovado" ? "Feedback rejeitado." : 
                   updates.status === "Em Revisão" ? "Feedback salvo como rascunho." : "Calibragem atualizada.",
          comentario: comment || updates.observacaoGestor || updates.observacaoRh
        } as any;

        return { 
          ...f, 
          ...updates,
          historico: [newLog, ...f.historico]
        };
      }
      return f;
    }));
    
    // Se aprovado ou reprovado, volta pra lista
    if (updates.status === "Aprovado" || updates.status === "Reprovado") {
      setView("list");
      setActiveFeedbackId(null);
    }
  };

  const activeFeedback = feedbacks.find(f => f.id === activeFeedbackId);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {view === "list" && (
        <FeedbackList 
          data={feedbacks} 
          onReview={handleReview} 
        />
      )}
      
      {view === "calibration" && activeFeedback && (
        <CalibrationMatrix 
          data={activeFeedback} 
          onBack={handleBack}
          onSave={handleSaveCalibration}
        />
      )}
    </div>
  );
}
