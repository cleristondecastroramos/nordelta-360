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
  estado_uf?: string;
  altura?: string;
  peso?: string;
  is_lideranca?: boolean;
}

export interface Avaliacao360 {
  matricula: string;
  ciclo: string;
  tipo_avaliador: string;
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
  competenciasDetalhadas?: { competencia: string; media: number; mediaEmpresa: number }[];
}

export interface GapAnalysis {
  departamento: string;
  competencia: string;
  descricao?: string;
  gap: number;
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
  mediasPorCompetencia: {
    competencia: string;
    descricao?: string;
    media: number;
    mediaAnterior?: number;
  }[];
  departamentos: DepartmentStats[];
  ranking: {
    matricula: string;
    nome: string;
    nota: number;
    potencial: number;
    percentil: number;
    avatar_url?: string;
  }[];
  alertas: string[];
  insights: InsightText[];
  gapHeatmap: GapAnalysis[];
  distribuicaoNotas: DistributionData[];
}

export interface DemographyMetrics {
  totalColaboradores: number;
  idadeMedia: number;
  percentualFeminino: number;
  departamentoMaior: string;
  totalLideranca: number;
  genderData: { name: string; value: number; color: string }[];
  ageData: { name: string; value: number }[];
  tenureData: { name: string; value: number; color: string }[];
  departmentData: { name: string; total: number; lideranca: number; operacao: number }[];
  locationData: { name: string; value: number }[];
  insights: InsightText[];
}

export interface EvolutionCycleData {
  ciclo: string;
  mediaGeral: number;
  [key: string]: string | number;
}

export interface CompetencyEvolution {
  competencia: string;
  ciclos: { ciclo: string; media: number }[];
  tendencia: "up" | "down" | "stable";
  variacao: number;
}

export interface DepartmentEvolution {
  departamento: string;
  ciclos: { ciclo: string; media: number }[];
  tendencia: "up" | "down" | "stable";
  variacao: number;
}

export interface EvolutionMetrics {
  notaMediaAtual: number;
  variacaoCicloAnterior: number;
  melhorCiclo: { ciclo: string; media: number };
  maiorVariacaoPositiva: { departamento: string; variacao: number };
  maiorVariacaoNegativa: { departamento: string; variacao: number };
  totalCiclos: number;
  historicoGeral: EvolutionCycleData[];
  evolucaoCompetencias: CompetencyEvolution[];
  evolucaoDepartamentos: DepartmentEvolution[];
  insights: InsightText[];
}

export type RoleType = "Administrador" | "Auditor" | "Gestor" | "Colaborador";
export type StatusType = "Ativo" | "Bloqueado" | "Inativo";

export interface SystemUser {
  id: string;
  matricula: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  status: StatusType;
  role: RoleType;
  ultimoAcesso: string;
  modulos: string[];
}

export interface AuditLog {
  id: string;
  usuarioAdmin: string;
  acao: string;
  detalhe: string;
  dataHora: string;
  status: "Sucesso" | "Aviso" | "Erro";
}

export interface AdminMetrics {
  totalUsuarios: number;
  perfisAtivos: number;
  totalAdministradores: number;
  perfisRestritos: number;
  alteracoesRecentes: number;
  usuariosPendentes: number;
  usuarios: SystemUser[];
  auditoria: AuditLog[];
}
