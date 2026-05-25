export type FeedbackStatus = "Pendente" | "Em Revisão" | "Aprovado" | "Reprovado";

export interface AuditLog {
  id: string;
  autor: string;
  cargoAutor: string;
  dataHora: string; // ISO ou formatado
  acao: "Edição de Nota" | "Alteração de Status" | "Comentário";
  detalhe: string;
  notaAnterior?: number;
  notaNova?: number;
  comentario?: string;
}

export interface CalibrationData {
  id: string;
  colaboradorMatricula: string;
  colaboradorNome: string;
  colaboradorCargo: string;
  colaboradorDepartamento: string;
  colaboradorFotoUrl?: string;
  ciclo: string;
  
  // Notas
  notaOriginal: number; // Média calculada automaticamente
  notaCalibrada: number; // Média ajustada pelo comitê
  
  // Informações qualitativas
  pontosFortes: string[];
  oportunidades: string[];
  resumoFeedback: string;
  
  // Observações internas de calibragem
  observacaoGestor: string;
  observacaoRh: string;
  
  status: FeedbackStatus;
  historico: AuditLog[];
}
