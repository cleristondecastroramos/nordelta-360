import {
  Wrench,
  CheckCircle,
  Clock,
  Users,
  MessageSquare,
  Award,
  Zap,
  Lightbulb,
  Headphones,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface CompetenceInfo {
  nome: string;
  descricao: string;
  icone: LucideIcon;
}

export const COMPETENCE_MAP: Record<string, CompetenceInfo> = {
  resp_competencia_tecnica: {
    nome: "Competências técnicas / Conhecimento do trabalho",
    descricao:
      "Domínio das atividades da função, conhecimento dos processos, ferramentas, normas e procedimentos necessários para executar o trabalho com segurança e qualidade.",
    icone: Wrench,
  },
  resp_qualidade_trabalho: {
    nome: "Qualidade do trabalho e precisão",
    descricao:
      "Nível de cuidado, organização, exatidão e consistência na entrega das atividades, com atenção aos detalhes e redução de erros.",
    icone: CheckCircle,
  },
  resp_produtividade: {
    nome: "Produtividade / Gestão do tempo",
    descricao:
      "Capacidade de produzir com eficiência, cumprir prazos, priorizar tarefas e administrar bem o tempo e os recursos disponíveis.",
    icone: Clock,
  },
  resp_trabalho_em_equipe: {
    nome: "Trabalho em equipe / Colaboração",
    descricao:
      "Disposição para cooperar, compartilhar informações, apoiar colegas, contribuir para objetivos comuns e manter bom relacionamento interpessoal.",
    icone: Users,
  },
  resp_comunicacao: {
    nome: "Comunicação (oral e escrita)",
    descricao:
      "Clareza ao falar e escrever, capacidade de se expressar com objetividade, escuta ativa e adaptação da mensagem ao contexto.",
    icone: MessageSquare,
  },
  resp_lideranca: {
    nome: "Liderança (se aplicável) — tomada de decisão, delegação",
    descricao:
      "Capacidade de orientar pessoas, tomar decisões, distribuir tarefas, dar direção e influenciar positivamente os resultados da equipe.",
    icone: Award,
  },
  resp_iniciativa: {
    nome: "Iniciativa e pró-atividade",
    descricao:
      "Agir sem depender de ordens constantes, antecipar problemas, propor soluções e assumir responsabilidades de forma espontânea.",
    icone: Zap,
  },
  resp_resolucao_problemas: {
    nome: "Capacidade de resolver problemas / Pensamento crítico",
    descricao:
      "Analisar situações com lógica, identificar causas, avaliar alternativas e escolher a melhor solução com base em fatos.",
    icone: Lightbulb,
  },
  resp_orientacao_cliente: {
    nome: "Orientação para o cliente / Atendimento",
    descricao:
      "Foco em atender bem o cliente interno ou externo, compreender necessidades, prestar suporte e buscar satisfação com qualidade.",
    icone: Headphones,
  },
  resp_etica: {
    nome: "Ética e comportamento profissional",
    descricao:
      "Postura íntegra, respeito às normas, confidencialidade, responsabilidade, transparência e conduta adequada no ambiente de trabalho.",
    icone: ShieldCheck,
  },
  resp_adaptacao: {
    nome: "Adaptação a mudanças / Flexibilidade",
    descricao:
      "Capacidade de lidar com mudanças, ajustar rotinas, aceitar novas demandas e responder bem a cenários diferentes.",
    icone: RefreshCw,
  },
  resp_desenvolvimento: {
    nome: "Desenvolvimento e aprendizagem contínua",
    descricao:
      "Abertura para aprender, evoluir, receber feedback, buscar capacitação e aplicar novos conhecimentos no trabalho.",
    icone: BookOpen,
  },
};

export function getCompetenceInfo(key: string): CompetenceInfo {
  // Tenta mapear pela chave exata (e.g. resp_comunicacao)
  if (COMPETENCE_MAP[key]) return COMPETENCE_MAP[key];

  // Fallback: se a chave já vier como "Comunicação", tentamos encontrar um nome parecido
  const cleanKey = key.toLowerCase();

  if (
    cleanKey.includes("técnica") ||
    cleanKey.includes("tecnica") ||
    cleanKey.includes("conhecimento")
  )
    return COMPETENCE_MAP["resp_competencia_tecnica"];
  if (cleanKey.includes("qualidade")) return COMPETENCE_MAP["resp_qualidade_trabalho"];
  if (cleanKey.includes("produtividade") || cleanKey.includes("tempo"))
    return COMPETENCE_MAP["resp_produtividade"];
  if (
    cleanKey.includes("equipe") ||
    cleanKey.includes("colaboração") ||
    cleanKey.includes("colaboracao")
  )
    return COMPETENCE_MAP["resp_trabalho_em_equipe"];
  if (cleanKey.includes("comunicação") || cleanKey.includes("comunicacao"))
    return COMPETENCE_MAP["resp_comunicacao"];
  if (cleanKey.includes("liderança") || cleanKey.includes("lideranca"))
    return COMPETENCE_MAP["resp_lideranca"];
  if (
    cleanKey.includes("iniciativa") ||
    cleanKey.includes("proatividade") ||
    cleanKey.includes("pró-atividade")
  )
    return COMPETENCE_MAP["resp_iniciativa"];
  if (
    cleanKey.includes("problemas") ||
    cleanKey.includes("crítico") ||
    cleanKey.includes("critico") ||
    cleanKey.includes("sistêmica")
  )
    return COMPETENCE_MAP["resp_resolucao_problemas"];
  if (cleanKey.includes("cliente") || cleanKey.includes("atendimento"))
    return COMPETENCE_MAP["resp_orientacao_cliente"];
  if (
    cleanKey.includes("ética") ||
    cleanKey.includes("etica") ||
    cleanKey.includes("profissional") ||
    cleanKey.includes("resultado")
  )
    return COMPETENCE_MAP["resp_etica"];
  if (
    cleanKey.includes("adaptação") ||
    cleanKey.includes("adaptacao") ||
    cleanKey.includes("flexibilidade") ||
    cleanKey.includes("inovação")
  )
    return COMPETENCE_MAP["resp_adaptacao"];
  if (cleanKey.includes("desenvolvimento") || cleanKey.includes("aprendizagem"))
    return COMPETENCE_MAP["resp_desenvolvimento"];

  // Se não encontrar nada, retorna genérico
  return {
    nome: key,
    descricao: "Competência avaliada no ciclo atual.",
    icone: Award,
  };
}
