export interface Colaborador {
  matricula: string;
  nome: string;
  cargo: string;
  departamento: string;
  estado: string;
  foto_url: string;
  avatar_url?: string;
  email: string;
  telefone?: string;
  celular?: string;
  telefone_fixo?: string;
  sexo?: string | null;
  idade?: number;
  cpf?: string;
  rg?: string;
  data_nasc?: string;
  data_admissao?: string;
  mae?: string;
  pai?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado_uf?: string; // Evitar conflito com 'estado' (Ativo/Inativo)
  altura?: string;
  peso?: string;
  is_lideranca?: boolean;
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
  descricao?: string;
  mediaGeral: number;
  mediaAuto: number;
  mediaGestor: number;
  mediaPares: number;
  mediaSubordinados: number;
  min: number;
  max: number;
  mediaDepartamento?: number;
  mediaEmpresa?: number;
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
  is_lideranca: boolean;
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
  descricao?: string;
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
  mediasPorCompetencia: { competencia: string; descricao?: string; media: number; mediaAnterior?: number }[];
  departamentos: DepartmentStats[];
  ranking: { matricula: string; nome: string; nota: number; potencial: number; percentil: number; avatar_url?: string }[];
  alertas: string[];
  insights: InsightText[];
  gapHeatmap: GapAnalysis[];
  distribuicaoNotas: DistributionData[];
}
