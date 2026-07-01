import { ArrowLeft, BarChart3, BellRing, Users, Target, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { CycleConfig, CycleMonitorData } from "@/lib/cycle-types";

interface CycleMonitorProps {
  cycleId: string;
  cycleConfig?: CycleConfig;
  onBack: () => void;
}

export function CycleMonitor({ cycleId, cycleConfig, onBack }: CycleMonitorProps) {
  // Dados mockados para simular o monitoramento em tempo real
  const data: CycleMonitorData = {
    config: cycleConfig || {
      id: cycleId,
      nome: "Ciclo Ativo",
      status: "Em andamento",
      totalParticipantes: 120,
    } as any,
    totalAvaliacoesEsperadas: 480, // Cada pessoa avalia ~4
    avaliacoesRealizadas: 325,
    progressoGeral: 68,
    pendenciasCriticas: 12,
    departamentosStats: [
      { departamento: "Comercial", totalParticipantes: 45, respostasCompletas: 40, taxaAdesao: 88 },
      { departamento: "Tecnologia", totalParticipantes: 30, respostasCompletas: 28, taxaAdesao: 93 },
      { departamento: "Recursos Humanos", totalParticipantes: 10, respostasCompletas: 10, taxaAdesao: 100 },
      { departamento: "Marketing", totalParticipantes: 15, respostasCompletas: 8, taxaAdesao: 53 },
      { departamento: "Operações", totalParticipantes: 20, respostasCompletas: 5, taxaAdesao: 25 },
    ]
  };

  const handleSendReminder = () => {
    alert("Lembretes enviados com sucesso para todos os avaliadores com pendências!");
  };

  const handleCloseCycle = () => {
    if (confirm("Tem certeza que deseja encerrar este ciclo? Não será mais possível receber respostas.")) {
      alert("Ciclo encerrado e dados enviados para consolidação!");
      onBack();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">{data.config.nome}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                Monitoramento
              </span>
            </div>
            <p className="text-muted-foreground mt-1">Status em tempo real das respostas do ciclo.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSendReminder}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <BellRing className="mr-2 h-4 w-4" />
            Lembrete em Massa
          </button>
          <button 
            onClick={handleCloseCycle}
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 shadow-sm"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Encerrar Ciclo
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CycleStatusCard 
          title="Progresso Geral" 
          value={`${data.progressoGeral}%`} 
          subtitle={`${data.avaliacoesRealizadas} de ${data.totalAvaliacoesEsperadas} avaliações`}
          icon={<BarChart3 className="h-4 w-4 text-primary" />}
        />
        <CycleStatusCard 
          title="Participantes" 
          value={data.config.totalParticipantes.toString()} 
          subtitle="Avaliadores elegíveis"
          icon={<Users className="h-4 w-4 text-emerald-500" />}
        />
        <CycleStatusCard 
          title="Faltam Responder" 
          value={(data.totalAvaliacoesEsperadas - data.avaliacoesRealizadas).toString()} 
          subtitle="Avaliações pendentes"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <CycleStatusCard 
          title="Atrasos Críticos" 
          value={data.pendenciasCriticas.toString()} 
          subtitle="Gestores pendentes"
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          alert
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CycleDepartmentBreakdown stats={data.departamentosStats} />
        </div>
        <div className="lg:col-span-1">
          <ReminderPanel 
            alertCount={data.pendenciasCriticas} 
            totalPending={data.totalAvaliacoesEsperadas - data.avaliacoesRealizadas} 
          />
        </div>
      </div>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

function CycleStatusCard({ title, value, subtitle, icon, alert = false }: any) {
  return (
    <div className={`rounded-xl border bg-card text-card-foreground shadow-sm p-6 ${alert ? 'border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-900/10' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-md ${alert ? 'bg-red-100 dark:bg-red-900/50' : 'bg-muted'}`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className={`text-3xl font-bold ${alert ? 'text-red-600 dark:text-red-400' : ''}`}>{value}</span>
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  );
}

function CycleDepartmentBreakdown({ stats }: { stats: CycleMonitorData["departamentosStats"] }) {
  const sorted = [...stats].sort((a, b) => b.taxaAdesao - a.taxaAdesao);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col h-full">
      <div className="p-6 pb-4 border-b">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Adesão por Departamento
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Acompanhamento detalhado da taxa de resposta.</p>
      </div>
      <div className="p-6 flex-1">
        <div className="space-y-6">
          {sorted.map(depto => (
            <div key={depto.departamento} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">{depto.departamento}</span>
                <span className="text-muted-foreground">
                  <span className="font-bold text-foreground">{depto.taxaAdesao}%</span> 
                  <span className="text-xs ml-1">({depto.respostasCompletas}/{depto.totalParticipantes})</span>
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden flex">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    depto.taxaAdesao > 80 ? 'bg-emerald-500' : 
                    depto.taxaAdesao > 40 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${depto.taxaAdesao}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReminderPanel({ alertCount, totalPending }: any) {
  const handleExportCSV = () => {
    const headers = ["Matrícula", "Nome", "Departamento", "Tipo Pendência", "Dias Atraso"];
    const rows = [
      ["G1042", "Mariana Silva", "Comercial", "Avaliação de Liderado", "2"],
      ["S1005", "Roberto Medina", "Sucesso do Cliente", "Autoavaliação", "5"],
      ["A1012", "Fernando Costa", "Operações", "Avaliação de Par", "1"],
      ["D1001", "João Silva", "Comercial", "Avaliação de Liderado", "3"],
    ];
    
    // Using semicolon for excel compatibility in PT-BR environments
    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.join(";"))
    ].join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'pendencias_ciclo_ativo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col h-full">
      <div className="p-6 pb-4 border-b">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <BellRing className="h-5 w-5 text-amber-500" />
          Ações Recomendadas
        </h3>
      </div>
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-400 text-sm">Atenção Necessária</h4>
              <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">Existem {alertCount} gestores que ainda não iniciaram a avaliação de seus times.</p>
              <button className="mt-3 text-xs font-semibold bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-400 px-3 py-1.5 rounded hover:bg-amber-300 dark:hover:bg-amber-900 transition-colors">
                Cobrar Gestores
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-muted/30">
          <h4 className="font-semibold text-sm">Follow-up Automático</h4>
          <p className="text-xs text-muted-foreground mt-1">O sistema enviará um lembrete automático em 2 dias para os {totalPending} avaliadores pendentes.</p>
        </div>
        
        <div className="mt-auto pt-4">
          <button 
            onClick={handleExportCSV}
            className="w-full inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground shadow-sm"
          >
            Exportar Pendências (Planilha)
          </button>
        </div>
      </div>
    </div>
  );
}
