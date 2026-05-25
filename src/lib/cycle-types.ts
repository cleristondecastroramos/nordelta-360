export type CycleStatus = "Planejado" | "Em andamento" | "Pausado" | "Encerrado" | "Consolidando";

export interface CycleConfig {
  id: string;
  nome: string;
  objetivo: string;
  descricao: string;
  dataInicio: string; // ISO date
  dataFim: string; // ISO date
  
  // Público-alvo
  departamentos: string[];
  cargosElegiveis: string[];
  totalParticipantes: number;
  
  // Regras
  permiteAutoavaliacao: boolean;
  paresAvaliamPares: boolean;
  gestorAvaliaSubordinado: boolean;
  minRespostasPorGrupo: number;
  
  // Confidencialidade
  anonimatoAtivado: boolean;
  poolingMinimo: number;
  comentariosSensiveisOcultos: boolean;
  
  status: CycleStatus;
}

export interface CycleDepartmentStat {
  departamento: string;
  totalParticipantes: number;
  respostasCompletas: number;
  taxaAdesao: number; // 0 to 100
}

export interface CycleMonitorData {
  config: CycleConfig;
  totalAvaliacoesEsperadas: number;
  avaliacoesRealizadas: number;
  progressoGeral: number; // 0 to 100
  departamentosStats: CycleDepartmentStat[];
  pendenciasCriticas: number; // e.g. leaders that haven't evaluated
}
