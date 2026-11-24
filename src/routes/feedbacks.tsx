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
    colaboradorMatricula: "D1001",
    colaboradorNome: "João Silva",
    colaboradorCargo: "Diretor de Vendas",
    colaboradorDepartamento: "Comercial",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/men/44.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 4.2,
    notaCalibrada: 4.2,
    pontosFortes: ["Orientação para Resultados", "Liderança Inspiradora", "Comunicação Assertiva"],
    oportunidades: ["Delegação de Tarefas", "Documentação de Processos"],
    resumoFeedback:
      "João apresenta um desempenho excepcional em liderar a equipe comercial para bater metas consistentes. O comitê observa, no entanto, que ele frequentemente sobrecarrega-se por não delegar adequadamente as operações táticas aos gerentes de conta.",
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
      },
    ],
  },
  {
    id: "f-1002",
    colaboradorMatricula: "G1002",
    colaboradorNome: "Maria Souza",
    colaboradorCargo: "Gerente de Projetos",
    colaboradorDepartamento: "Operações",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 3.8,
    notaCalibrada: 4.0,
    pontosFortes: ["Organização", "Trabalho em Equipe"],
    oportunidades: ["Visão Sistêmica", "Inovação"],
    resumoFeedback:
      "Maria é uma engrenagem fundamental nas operações, mantendo prazos e orçamentos sob controle. O feedback 360 aponta que ela pode ser mais flexível ao lidar com mudanças repentinas de escopo.",
    observacaoGestor:
      "Ajustei a nota para 4.0 pois a métrica original não levou em conta os projetos emergenciais que ela assumiu sozinha no Q1.",
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
        comentario: "Ajuste por conta dos projetos de contingência no Q1.",
      },
    ],
  },
  {
    id: "f-1003",
    colaboradorMatricula: "A1003",
    colaboradorNome: "Carlos Oliveira",
    colaboradorCargo: "Desenvolvedor Senior",
    colaboradorDepartamento: "Tecnologia",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 4.8,
    notaCalibrada: 4.8,
    pontosFortes: ["Conhecimento Técnico", "Resolução de Problemas", "Mentoria"],
    oportunidades: ["Comunicação Não-Técnica"],
    resumoFeedback:
      "Carlos é a principal referência técnica da equipe. Suas entregas são de altíssima qualidade. O único ponto de atenção é a forma como ele traduz requisitos técnicos para a equipe de negócios, que às vezes gera ruído.",
    observacaoGestor: "",
    observacaoRh: "",
    status: "Pendente",
    historico: [],
  },
  {
    id: "f-1004",
    colaboradorMatricula: "A1004",
    colaboradorNome: "Ana Beatriz Ramos",
    colaboradorCargo: "Analista de Marketing",
    colaboradorDepartamento: "Marketing",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 3.2,
    notaCalibrada: 3.5,
    pontosFortes: ["Criatividade", "Iniciativa"],
    oportunidades: ["Gestão de Tempo", "Análise de Dados"],
    resumoFeedback:
      "Ana tem ótimas ideias e traz uma energia contagiante para as campanhas. Contudo, tem enfrentado desafios para cumprir os prazos estabelecidos e mensurar o ROI de suas ações.",
    observacaoGestor: "Propus um PDI focado em ferramentas de análise.",
    observacaoRh: "",
    status: "Em Revisão",
    historico: [
      {
        id: "log-3",
        autor: "Fernando Lemos",
        cargoAutor: "Gerente de Marketing",
        dataHora: "26/05/2024 09:20",
        acao: "Edição de Nota",
        detalhe: "Nota calibrada de 3.20 para 3.50.",
        comentario:
          "Considerado o impacto positivo da campanha de maio, que não entrou na autoavaliação dela.",
      },
    ],
  },
  {
    id: "f-1005",
    colaboradorMatricula: "S1005",
    colaboradorNome: "Roberto Medina",
    colaboradorCargo: "Supervisor de Atendimento",
    colaboradorDepartamento: "Sucesso do Cliente",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/men/82.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 2.8,
    notaCalibrada: 2.8,
    pontosFortes: ["Resiliência", "Empatia com Clientes"],
    oportunidades: ["Gestão de Conflitos Internos", "Pontualidade"],
    resumoFeedback:
      "Excelente na linha de frente com o cliente, porém o clima da sua equipe tem caído. A avaliação 360 demonstrou insatisfação dos liderados quanto ao seu nível de exigência desproporcional.",
    observacaoGestor: "Feedback enviado para reprovação até que o plano de ação seja ajustado.",
    observacaoRh: "O comitê concorda. O líder deve passar por reciclagem.",
    status: "Reprovado",
    historico: [
      {
        id: "log-4",
        autor: "Comitê RH",
        cargoAutor: "Recursos Humanos",
        dataHora: "28/05/2024 16:45",
        acao: "Alteração de Status",
        detalhe: "Feedback rejeitado.",
        comentario: "Plano de ação insuficiente para a gravidade do gap em Gestão de Conflitos.",
      },
    ],
  },
  {
    id: "f-1006",
    colaboradorMatricula: "A1006",
    colaboradorNome: "Luciana Almeida",
    colaboradorCargo: "Analista Financeiro Pleno",
    colaboradorDepartamento: "Financeiro",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 4.5,
    notaCalibrada: 4.5,
    pontosFortes: ["Atenção aos Detalhes", "Ética", "Processos"],
    oportunidades: ["Comunicação Interpessoal"],
    resumoFeedback:
      "Desempenho impecável na conciliação contábil. Extremamente confiável. Deve focar em interagir mais com outras áreas para entender melhor os impactos cruzados de suas operações.",
    observacaoGestor: "",
    observacaoRh: "",
    status: "Aprovado",
    historico: [
      {
        id: "log-5",
        autor: "Sandra Gusmão",
        cargoAutor: "Gerente Financeira",
        dataHora: "20/05/2024 11:00",
        acao: "Alteração de Status",
        detalhe: "Feedback aprovado.",
      },
    ],
  },
  {
    id: "f-1007",
    colaboradorMatricula: "E1007",
    colaboradorNome: "Tiago Ventura",
    colaboradorCargo: "Engenheiro de Dados",
    colaboradorDepartamento: "Tecnologia",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 4.1,
    notaCalibrada: 4.1,
    pontosFortes: ["Visão Sistêmica", "Automatização"],
    oportunidades: ["Documentação", "Trabalho Sob Pressão"],
    resumoFeedback:
      "O trabalho de estruturação do Data Lake foi excepcional, mas frequentemente deixa as pipelines sem documentação, causando gargalos de dependência quando está ausente.",
    observacaoGestor: "",
    observacaoRh: "",
    status: "Pendente",
    historico: [],
  },
  {
    id: "f-1008",
    colaboradorMatricula: "C1008",
    colaboradorNome: "Carla Ferreira",
    colaboradorCargo: "Coordenadora de RH",
    colaboradorDepartamento: "Recursos Humanos",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/women/90.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 4.6,
    notaCalibrada: 4.8,
    pontosFortes: ["Desenvolvimento de Pessoas", "Inteligência Emocional", "Comunicação"],
    oportunidades: ["Orçamento e Custos"],
    resumoFeedback:
      "Carla revolucionou o onboarding deste semestre. É muito bem vista pelos pares. O próximo passo de desenvolvimento será gerenciar melhor a verba de endomarketing.",
    observacaoGestor: "Subi a nota calibrada em virtude do prêmio GPTW que ela capitaneou.",
    observacaoRh: "",
    status: "Aprovado",
    historico: [
      {
        id: "log-6",
        autor: "Diretoria",
        cargoAutor: "CHRO",
        dataHora: "21/05/2024 15:30",
        acao: "Edição de Nota",
        detalhe: "Nota calibrada de 4.60 para 4.80.",
        comentario: "Reconhecimento pelo prêmio GPTW.",
      },
      {
        id: "log-7",
        autor: "Diretoria",
        cargoAutor: "CHRO",
        dataHora: "21/05/2024 15:31",
        acao: "Alteração de Status",
        detalhe: "Feedback aprovado.",
      },
    ],
  },
  {
    id: "f-1009",
    colaboradorMatricula: "A1009",
    colaboradorNome: "Pedro Rocha",
    colaboradorCargo: "Assistente Administrativo",
    colaboradorDepartamento: "Administrativo",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/men/15.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 3.5,
    notaCalibrada: 3.5,
    pontosFortes: ["Agilidade", "Prontidão"],
    oportunidades: ["Atenção aos Detalhes", "Autonomia"],
    resumoFeedback:
      "Pedro é muito prestativo e veloz, mas a falta de atenção a pequenos detalhes tem gerado retrabalho nas planilhas de controle de frotas.",
    observacaoGestor: "",
    observacaoRh: "",
    status: "Pendente",
    historico: [],
  },
  {
    id: "f-1010",
    colaboradorMatricula: "G1010",
    colaboradorNome: "Renata Nunes",
    colaboradorCargo: "Gerente de Produto",
    colaboradorDepartamento: "Produto",
    colaboradorFotoUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    ciclo: "Ciclo 2024.1",
    notaOriginal: 4.4,
    notaCalibrada: 4.4,
    pontosFortes: ["Estratégia", "Negociação", "Foco no Cliente"],
    oportunidades: ["Delegação", "Equilíbrio Vida/Trabalho"],
    resumoFeedback:
      "A visão de produto da Renata direcionou o lançamento do novo app de forma brilhante. Contudo, as pesquisas de clima indicam que ela centraliza muitas decisões, desmotivando os product owners mais juniores.",
    observacaoGestor: "",
    observacaoRh: "Atenção especial ao risco de burnout, dado o histórico de horas extras.",
    status: "Aprovado",
    historico: [
      {
        id: "log-8",
        autor: "Comitê de Avaliação",
        cargoAutor: "Diretoria Plural",
        dataHora: "27/05/2024 10:00",
        acao: "Alteração de Status",
        detalhe: "Feedback aprovado.",
        comentario: "Aprovado em comitê com a ressalva de acompanhamento próximo pela BP de RH.",
      },
    ],
  },
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

  const handleSaveCalibration = (
    id: string,
    updates: Partial<CalibrationData>,
    comment?: string,
  ) => {
    setFeedbacks((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const newLog = {
            id: `log-${Date.now()}`,
            autor: "Usuário Atual",
            cargoAutor: "Analista de RH",
            dataHora: new Date().toLocaleString("pt-BR"),
            acao:
              updates.notaCalibrada && updates.notaCalibrada !== f.notaCalibrada
                ? "Edição de Nota"
                : "Alteração de Status",
            detalhe:
              updates.status === "Aprovado"
                ? "Feedback aprovado."
                : updates.status === "Reprovado"
                  ? "Feedback rejeitado."
                  : updates.status === "Em Revisão"
                    ? "Feedback salvo como rascunho."
                    : "Calibragem atualizada.",
            comentario: comment || updates.observacaoGestor || updates.observacaoRh,
          } as any;

          return {
            ...f,
            ...updates,
            historico: [newLog, ...f.historico],
          };
        }
        return f;
      }),
    );

    // Se aprovado ou reprovado, volta pra lista
    if (updates.status === "Aprovado" || updates.status === "Reprovado") {
      setView("list");
      setActiveFeedbackId(null);
    }
  };

  const activeFeedback = feedbacks.find((f) => f.id === activeFeedbackId);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {view === "list" && <FeedbackList data={feedbacks} onReview={handleReview} />}

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
