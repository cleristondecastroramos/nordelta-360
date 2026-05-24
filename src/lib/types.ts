export interface Colaborador {
  matricula: string;
  nome: string;
  cargo: string;
  departamento: string;
  estado: string;
  foto_url: string;
  email: string;
  telefone: string;
}

export interface Avaliacao360 {
  matricula: string;
  ciclo: string;
  tipo_avaliador: string; // Autoavaliação, Gestor, Par, Subordinado
  avaliador_id: string;
  competencia: string;
  nota: number;
  comentario?: string;
}

export interface CompetenciaScore {
  competencia: string;
  mediaGeral: number;
  mediaAuto: number;
  mediaGestor: number;
  mediaPares: number;
  mediaSubordinados: number;
  min: number;
  max: number;
  distribuicao?: { nota: number; quantidade: number }[];
}

export interface HistoricoCiclo {
  ciclo: string;
  mediaGeral: number;
}

export interface PlanoDesenvolvimento {
  id: string;
  competencia: string;
  acaoSugerida: string;
  prioridade: "Alta" | "Média" | "Baixa";
  prazo: string;
  status: "Não Iniciado" | "Em Andamento" | "Concluído";
  responsavel: string;
}

export interface ColaboradorResultados {
  colaborador: Colaborador;
  notaMediaGeral: number;
  gapGestorAuto: number;
  indicePotencial: number;
  percentil: number;
  competencias: CompetenciaScore[];
  comentariosAnonimizados: { tipo_avaliador: string; comentario: string }[];
  historicoCiclos: HistoricoCiclo[];
  planoDesenvolvimento: PlanoDesenvolvimento[];
}

export interface DepartmentStats {
  departamento: string;
  media: number;
  potencial: number;
  participacao: number;
  gapMedio: number;
}

export interface GapAnalysis {
  departamento: string;
  competencia: string;
  gap: number; // Gestor - Auto
}

export interface DistributionData {
  range: string;
  quantidade: number;
}

export interface InsightText {
  tipo: "success" | "warning" | "info";
  texto: string;
}

export interface DashboardMetrics {
  totalColaboradores: number;
  notaMediaGeral: number;
  mediaPotencial: number;
  totalDepartamentos: number;
  totalCompetencias: number;
  participacaoCiclo: number;
  percentilMedio: number;
  mediasPorCompetencia: { competencia: string; media: number; mediaAnterior?: number }[];
  departamentos: DepartmentStats[];
  ranking: { matricula: string; nome: string; nota: number; potencial: number; percentil: number }[];
  alertas: string[];
  insights: InsightText[];
  gapHeatmap: GapAnalysis[];
  distribuicaoNotas: DistributionData[];
}
