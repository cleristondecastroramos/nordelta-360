import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Target, TrendingUp, AlertTriangle, Medal } from "lucide-react";
import { getColaboradorResultados } from "@/lib/data-service";
import type { ColaboradorResultados } from "@/lib/types";
import { KpiCard } from "@/components/ui/kpi-card";
import { RadarChart } from "@/components/ui/radar-chart";
import { EmployeeProfileHeader } from "@/components/ui/employee-profile-header";
import { CompetencyTable } from "@/components/ui/competency-table";
import { AlertPanel } from "@/components/ui/alert-panel";
import { LineChart } from "@/components/ui/line-chart";
import { calculateTenure } from "@/lib/utils";

export const Route = createFileRoute("/colaboradores/$matricula")({
  component: ColaboradorFicha,
});

function ColaboradorFicha() {
  const { matricula } = Route.useParams();
  const [data, setData] = useState<ColaboradorResultados | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resumo");

  useEffect(() => {
    async function load() {
      const res = await getColaboradorResultados(matricula);
      setData(res);
      setLoading(false);
    }
    load();
  }, [matricula]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p>Carregando perfil do colaborador...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.colaborador) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <AlertPanel 
          title="Colaborador não encontrado" 
          items={[`A matrícula ${matricula} não foi encontrada na base de dados.`]} 
          type="error" 
          className="max-w-md w-full"
        />
        <button 
          onClick={() => window.history.back()}
          className="text-primary hover:underline text-sm font-medium mt-4"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  const { colaborador } = data;

  const radarData = data.competencias.map(c => ({
    competencia: c.competencia,
    Colaborador: c.mediaGeral,
    Departamento: c.mediaDepartamento,
    Empresa: c.mediaEmpresa,
  }));

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4 print:bg-white print:text-black animate-in fade-in duration-500">
      
      <div className="print:hidden">
        <EmployeeProfileHeader 
          colaborador={colaborador}
          onBack={() => window.history.back()}
          onExport={handleExport}
          onPhotoUpload={(file) => console.log("Simulando upload de foto", file.name)}
        />
      </div>
      
      {/* Print-only header fallback */}
      <div className="hidden print:block border-b-2 border-primary pb-4 mb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-primary">Relatório de Avaliação 360°</h1>
            <p className="text-lg mt-1">{colaborador.nome} - {colaborador.cargo}</p>
          </div>
          <div className="text-right text-sm">
            <p><strong>Matrícula:</strong> {colaborador.matricula}</p>
            <p><strong>Departamento:</strong> {colaborador.departamento}</p>
            <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 print:grid-cols-4 print:break-inside-avoid">
        <KpiCard title="Nota Média Geral" value={data.notaMediaGeral} icon={<Target className="h-4 w-4" />} />
        <KpiCard title="Percentil na Empresa" value={`${data.percentil}%`} icon={<Medal className="h-4 w-4" />} />
        <KpiCard title="Índice de Potencial" value={data.indicePotencial} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard title="Gap Gestor x Auto" value={data.gapGestorAuto} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      {/* Dossiê Pessoal - Dados Estendidos */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 print:break-inside-avoid">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Dossiê Profissional e Cadastral
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Idade</p>
            <p className="font-semibold">{colaborador.idade || "-"} anos</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Data de Admissão</p>
            <p className="font-semibold">{colaborador.data_admissao ? new Date(colaborador.data_admissao).toLocaleDateString('pt-BR') : "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Tempo de Empresa</p>
            <p className="font-semibold text-primary">{calculateTenure(colaborador.data_admissao)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Contato (Celular)</p>
            <p className="font-semibold">{colaborador.celular || colaborador.telefone || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">E-mail Corporativo</p>
            <p className="font-semibold text-primary truncate" title={colaborador.email}>{colaborador.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Nome da Mãe</p>
            <p className="font-medium text-sm">{colaborador.mae || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Nome do Pai</p>
            <p className="font-medium text-sm">{colaborador.pai || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">CPF</p>
            <p className="font-medium text-sm">{colaborador.cpf || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">RG</p>
            <p className="font-medium text-sm">{colaborador.rg || "-"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm print:border-none print:shadow-none">
        <div className="border-b px-4 print:hidden">
          <nav className="flex space-x-6 overflow-x-auto">
            {["Resumo", "Competências", "Comentários", "Evolução", "Plano", "Documentos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.toLowerCase()
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 print:p-0 print:pt-6">
          {(activeTab === "resumo" || activeTab === "competências") && ( // Show both in print mode
            <div className={`grid md:grid-cols-2 gap-8 ${activeTab === 'competências' ? 'print:hidden' : ''} print:block`}>
              <div className="print:break-inside-avoid">
                <h3 className="font-semibold text-lg mb-4">Análise Comparativa (Radar)</h3>
                <RadarChart 
                  data={data.competencias} 
                  keys={data.is_lideranca ? ["mediaAuto", "mediaGestor", "mediaPares", "mediaSubordinados"] : ["mediaAuto", "mediaGestor", "mediaPares"]}
                  colors={data.is_lideranca ? ["#94a3b8", "#dc2626", "#eab308", "#10b981"] : ["#94a3b8", "#dc2626", "#eab308"]}
                />
              </div>
              <div className="space-y-6 print:break-inside-avoid">
                <div>
                  <h4 className="font-semibold text-emerald-600 mb-2 flex items-center"><Medal className="mr-2 h-4 w-4" /> Principais Forças</h4>
                  <ul className="space-y-2 text-sm">
                    {data.competencias.sort((a,b) => b.mediaGeral - a.mediaGeral).slice(0, 3).map(c => (
                      <li key={c.competencia} className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/10 p-2.5 rounded-md border border-emerald-100 dark:border-emerald-900/50">
                        <span className="font-medium text-emerald-800 dark:text-emerald-300">{c.competencia}</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{c.mediaGeral.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-600 mb-2 flex items-center"><AlertTriangle className="mr-2 h-4 w-4" /> Oportunidades de Melhoria</h4>
                  <ul className="space-y-2 text-sm">
                    {data.competencias.sort((a,b) => a.mediaGeral - b.mediaGeral).slice(0, 2).map(c => (
                      <li key={c.competencia} className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/10 p-2.5 rounded-md border border-amber-100 dark:border-amber-900/50">
                        <span className="font-medium text-amber-800 dark:text-amber-300">{c.competencia}</span>
                        <span className="font-bold text-amber-700 dark:text-amber-400">{c.mediaGeral.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <AlertPanel 
                  title="Síntese Analítica" 
                  items={[`A percepção do gestor (${(data.competencias.reduce((acc, c) => acc + c.mediaGestor, 0) / data.competencias.length).toFixed(2)}) diverge da autoavaliação (${(data.competencias.reduce((acc, c) => acc + c.mediaAuto, 0) / data.competencias.length).toFixed(2)}).`, "Forte aderência cultural, necessita plano de ação focado nas oportunidades apontadas."]} 
                  type="info" 
                />
              </div>
            </div>
          )}

          <div className="print:block print:mt-12 print:break-before-page">
            {(activeTab === "competências" || activeTab === "resumo") && (
              <div className={`${activeTab === 'resumo' ? 'hidden print:block' : ''}`}>
                <h3 className="font-semibold text-lg mb-4 hidden print:block">Detalhamento das Competências</h3>
                <CompetencyTable competencias={data.competencias} isLideranca={data.is_lideranca} />
              </div>
            )}
          </div>

          <div className="print:block print:mt-12">
            {(activeTab === "comentários" || activeTab === "resumo") && (
              <div className={`space-y-4 max-w-4xl ${activeTab === 'resumo' ? 'hidden print:block' : ''}`}>
                <h3 className="font-semibold text-lg mb-2 hidden print:block">Feedback Qualitativo Consolidadado</h3>
                <p className="text-sm text-muted-foreground mb-6 print:hidden">
                  Os comentários abaixo foram consolidados e anonimizados para proteger a identidade dos avaliadores, com foco no desenvolvimento contínuo do profissional.
                </p>
                {data.comentariosAnonimizados.length === 0 ? (
                  <div className="p-8 text-center bg-muted/20 rounded-lg border border-dashed">
                    Nenhum comentário recebido neste ciclo.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 print:grid-cols-2">
                    {data.comentariosAnonimizados.map((c, i) => (
                      <div key={i} className="bg-background p-5 rounded-lg border shadow-sm print:shadow-none print:border-gray-300 break-inside-avoid">
                        <p className="text-sm italic text-foreground leading-relaxed print:text-black">"{c.comentario}"</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="h-px flex-1 bg-border print:bg-gray-200"></span>
                          <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded-md print:bg-transparent print:text-gray-500">{c.tipo_avaliador}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {activeTab === "evolução" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-1">Histórico de Desempenho</h3>
                <p className="text-sm text-muted-foreground mb-6">Acompanhamento da evolução da Média Geral ao longo dos ciclos de avaliação.</p>
              </div>
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <LineChart data={data.historicoCiclos} />
              </div>
              
              <div className="grid gap-4 md:grid-cols-3 mt-4">
                {data.historicoCiclos.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-muted/10">
                    <span className="font-medium">{h.ciclo}</span>
                    <span className="font-bold text-primary">{h.mediaGeral.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "plano" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Plano de Desenvolvimento Individual (PDI)</h3>
                  <p className="text-sm text-muted-foreground">Ações recomendadas com base nas oportunidades de melhoria identificadas.</p>
                </div>
                <button className="hidden sm:inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Nova Ação
                </button>
              </div>

              <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 font-medium text-muted-foreground border-b">
                      <tr>
                        <th className="p-4">Foco / Competência</th>
                        <th className="p-4">Ação de Desenvolvimento</th>
                        <th className="p-4">Prioridade</th>
                        <th className="p-4">Prazo</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.planoDesenvolvimento.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium text-foreground whitespace-nowrap">
                            {item.competencia}
                          </td>
                          <td className="p-4 min-w-[300px]">
                            {item.acaoSugerida}
                            <div className="mt-1 text-xs text-muted-foreground">Responsável: {item.responsavel}</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                              item.prioridade === 'Alta' 
                                ? 'bg-destructive/10 text-destructive border-destructive/20' 
                                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400'
                            }`}>
                              {item.prioridade}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground whitespace-nowrap">{item.prazo}</td>
                          <td className="p-4">
                            <select 
                              className="text-xs bg-transparent border border-input rounded p-1 max-w-[120px] focus:ring-1 focus:ring-primary"
                              defaultValue={item.status}
                            >
                              <option>Não Iniciado</option>
                              <option>Em Andamento</option>
                              <option>Concluído</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {["documentos"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/10 rounded-lg border border-dashed print:hidden">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Módulo em Desenvolvimento</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Esta aba ({activeTab}) faz parte da próxima fase de entregas do sistema Nordelta 360°.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
