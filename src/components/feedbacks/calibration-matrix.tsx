import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Save,
  MessageSquare,
  History,
  User,
  AlertCircle,
} from "lucide-react";
import type { CalibrationData, FeedbackStatus } from "@/lib/feedback-types";
import { FeedbackStatusChip } from "./feedback-list";

interface CalibrationMatrixProps {
  data: CalibrationData;
  onBack: () => void;
  onSave: (id: string, updates: Partial<CalibrationData>, comment?: string) => void;
}

export function CalibrationDiffBadge({
  original,
  calibrada,
}: {
  original: number;
  calibrada: number;
}) {
  const diff = calibrada - original;
  if (diff === 0)
    return <span className="text-muted-foreground text-xs font-medium ml-2">Alinhado</span>;

  const isPositive = diff > 0;
  return (
    <span
      className={`text-xs font-bold ml-2 px-1.5 py-0.5 rounded ${isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
    >
      {isPositive ? "+" : ""}
      {diff.toFixed(2)}
    </span>
  );
}

export function CalibrationMatrix({ data, onBack, onSave }: CalibrationMatrixProps) {
  const [notaAtual, setNotaAtual] = useState(data.notaCalibrada);
  const [obsGestor, setObsGestor] = useState(data.observacaoGestor);
  const [obsRh, setObsRh] = useState(data.observacaoRh);
  const [commentLog, setCommentLog] = useState("");

  const handleAction = (status: FeedbackStatus) => {
    onSave(
      data.id,
      {
        notaCalibrada: notaAtual,
        observacaoGestor: obsGestor,
        observacaoRh: obsRh,
        status,
      },
      commentLog,
    );
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Painel de Calibragem</h2>
            <FeedbackStatusChip status={data.status} />
          </div>
          <p className="text-muted-foreground mt-1">Revisão gerencial do ciclo {data.ciclo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Central (Matriz e Formulários) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-muted/20">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <SlidersHorizontalIcon className="h-5 w-5 text-primary" />
                Matriz de Ajuste
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Box de Comparação de Notas */}
              <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-lg border bg-background">
                <div className="flex-1 space-y-1">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Nota Original (360°)
                  </span>
                  <div className="text-3xl font-bold text-foreground">
                    {data.notaOriginal.toFixed(2)}
                  </div>
                </div>
                <div className="w-px bg-border hidden sm:block"></div>
                <div className="flex-1 space-y-2">
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">
                    Nota Calibrada
                  </span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max="5"
                      className="w-24 text-3xl font-bold bg-transparent border-b-2 border-primary focus:outline-none focus:border-primary/70"
                      value={notaAtual}
                      onChange={(e) => setNotaAtual(parseFloat(e.target.value) || 0)}
                      disabled={data.status === "Aprovado"}
                    />
                    <CalibrationDiffBadge original={data.notaOriginal} calibrada={notaAtual} />
                  </div>
                </div>
              </div>

              {/* Formulário de Observações */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Justificativa do Gestor Direto
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                    placeholder="Explique os motivos do ajuste de nota (se houver)..."
                    value={obsGestor}
                    onChange={(e) => setObsGestor(e.target.value)}
                    disabled={data.status === "Aprovado"}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-500" />
                    Parecer do RH / Comitê
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50"
                    placeholder="Parecer final do comitê de calibragem..."
                    value={obsRh}
                    onChange={(e) => setObsRh(e.target.value)}
                    disabled={data.status === "Aprovado"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline de Auditoria */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 border-b flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Trilha de Auditoria</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {data.historico.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-4">
                    Nenhum registro de alteração ainda.
                  </p>
                ) : (
                  data.historico.map((log) => (
                    <div
                      key={log.id}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary text-secondary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {log.acao === "Alteração de Status" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <MessageSquare className="h-4 w-4" />
                        )}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border bg-background shadow-sm">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-sm">{log.autor}</div>
                          <time className="text-xs font-medium text-muted-foreground">
                            {log.dataHora}
                          </time>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium mb-2">
                          {log.cargoAutor}
                        </div>
                        <p className="text-sm text-foreground">{log.detalhe}</p>
                        {log.comentario && (
                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs italic">
                            "{log.comentario}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Painel Lateral (Resumo do Colaborador) e Actions */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden sticky top-6">
            <div className="p-6 border-b flex items-center gap-4 bg-muted/10">
              {data.colaboradorFotoUrl ? (
                <img
                  src={data.colaboradorFotoUrl}
                  alt={data.colaboradorNome}
                  className="w-16 h-16 rounded-full border-2 border-background shadow-sm object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shadow-sm border-2 border-background">
                  {data.colaboradorNome.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{data.colaboradorNome}</h3>
                <p className="text-sm text-muted-foreground">{data.colaboradorCargo}</p>
                <p className="text-xs font-medium text-primary mt-1">
                  {data.colaboradorDepartamento}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Síntese do Feedback
                </h4>
                <p className="text-sm leading-relaxed text-foreground bg-muted/30 p-3 rounded-lg border">
                  {data.resumoFeedback}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Pontos Fortes
                </h4>
                <ul className="space-y-2">
                  {data.pontosFortes.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Oportunidades
                </h4>
                <ul className="space-y-2">
                  {data.oportunidades.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Approval Action Bar */}
            <div className="p-6 bg-muted/20 border-t space-y-4">
              {data.status !== "Aprovado" && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Comentário de Log (Opcional)
                  </label>
                  <input
                    type="text"
                    className="w-full h-8 px-2 text-sm border rounded bg-background"
                    placeholder="Registrar na trilha de auditoria..."
                    value={commentLog}
                    onChange={(e) => setCommentLog(e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {data.status !== "Aprovado" ? (
                  <>
                    <button
                      onClick={() => handleAction("Reprovado")}
                      className="col-span-1 inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 py-2 text-sm font-medium transition-colors"
                    >
                      <XCircle className="mr-1.5 h-4 w-4" />
                      Rejeitar
                    </button>
                    <button
                      onClick={() => handleAction("Aprovado")}
                      className="col-span-1 inline-flex items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 py-2 text-sm font-medium transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleAction("Em Revisão")}
                      className="col-span-2 inline-flex items-center justify-center rounded-md border bg-background hover:bg-muted py-2 text-sm font-medium transition-colors"
                    >
                      <Save className="mr-1.5 h-4 w-4" />
                      Salvar como Em Revisão
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleAction("Em Revisão")}
                    className="col-span-2 inline-flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 py-2 text-sm font-medium transition-colors"
                  >
                    <History className="mr-1.5 h-4 w-4" />
                    Reabrir para Revisão
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon
function SlidersHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="21" y1="4" x2="14" y2="4" />
      <line x1="10" y1="4" x2="3" y2="4" />
      <line x1="21" y1="12" x2="12" y2="12" />
      <line x1="8" y1="12" x2="3" y2="12" />
      <line x1="21" y1="20" x2="16" y2="20" />
      <line x1="12" y1="20" x2="3" y2="20" />
      <line x1="14" y1="2" x2="14" y2="6" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="16" y1="18" x2="16" y2="22" />
    </svg>
  );
}
