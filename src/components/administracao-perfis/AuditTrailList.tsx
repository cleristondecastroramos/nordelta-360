import { AuditLog } from "@/lib/types";
import { Clock, ShieldAlert, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface AuditTrailListProps {
  logs: AuditLog[];
}

export function AuditTrailList({ logs }: AuditTrailListProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-card text-muted-foreground min-h-[200px]">
        <Clock className="w-8 h-8 mb-3 opacity-20" />
        <p>Nenhuma atividade recente registrada no sistema.</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Sucesso": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "Aviso": return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "Erro": return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default: return <ShieldCheck className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Trilha de Auditoria
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Registro imutável das últimas alterações administrativas.</p>
        </div>
      </div>
      <div className="p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Ação Realizada</th>
                <th className="px-4 py-3 font-semibold">Detalhe</th>
                <th className="px-4 py-3 font-semibold">Responsável</th>
                <th className="px-6 py-3 font-semibold text-right">Data / Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className="font-medium text-xs uppercase tracking-wider">{log.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-foreground whitespace-nowrap">
                    {log.acao}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground min-w-[250px]">
                    {log.detalhe}
                  </td>
                  <td className="px-4 py-4 font-medium">
                    {log.usuarioAdmin}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground whitespace-nowrap font-mono text-xs">
                    {log.dataHora}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
