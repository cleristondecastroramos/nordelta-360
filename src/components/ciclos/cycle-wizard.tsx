import { useState } from "react";
import { ArrowLeft, ArrowRight, Save, X, Check, CheckCircle2 } from "lucide-react";
import type { CycleConfig } from "@/lib/cycle-types";

interface CycleWizardProps {
  onCancel: () => void;
  onSave: (cycle: CycleConfig) => void;
}

const STEPS = [
  { id: 1, name: "Dados do Ciclo" },
  { id: 2, name: "Público-alvo" },
  { id: 3, name: "Regras de Avaliação" },
  { id: 4, name: "Confidencialidade" },
  { id: 5, name: "Revisão Final" },
];

export function CycleWizard({ onCancel, onSave }: CycleWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CycleConfig>>({
    nome: "",
    objetivo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    departamentos: [],
    cargosElegiveis: [],
    permiteAutoavaliacao: true,
    paresAvaliamPares: true,
    gestorAvaliaSubordinado: true,
    minRespostasPorGrupo: 3,
    anonimatoAtivado: true,
    poolingMinimo: 3,
    comentariosSensiveisOcultos: true,
  });

  const updateForm = (data: Partial<CycleConfig>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleFinish = () => {
    const newCycle: CycleConfig = {
      id: `c-new-${Date.now()}`,
      status: "Planejado",
      totalParticipantes: Math.floor(Math.random() * 300) + 50, // mock calculation
      ...(formData as any)
    };
    onSave(newCycle);
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !formData.nome || !formData.dataInicio || !formData.dataFim;
    }
    return false;
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Criar Novo Ciclo</h2>
          <p className="text-muted-foreground mt-1">Siga os passos para configurar uma nova campanha de avaliação.</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
          title="Cancelar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors duration-300
                    ${isActive ? "bg-primary border-primary text-primary-foreground" : 
                      isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                      "bg-background border-muted-foreground/30 text-muted-foreground"}
                  `}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className={`mt-2 text-xs font-medium hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-card border rounded-xl shadow-sm p-6 sm:p-8 min-h-[400px]">
        {currentStep === 1 && <StepInfo data={formData} update={updateForm} />}
        {currentStep === 2 && <StepAudience data={formData} update={updateForm} />}
        {currentStep === 3 && <StepRules data={formData} update={updateForm} />}
        {currentStep === 4 && <StepAnonymity data={formData} update={updateForm} />}
        {currentStep === 5 && <StepReview data={formData} />}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onCancel}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </button>
          
          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              Avançar
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 shadow-sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Criar Ciclo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== STEPS COMPONENTS ====================

function StepInfo({ data, update }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Informações Básicas</h3>
        <p className="text-sm text-muted-foreground">Defina o nome, objetivo e período do ciclo de avaliação.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nome do Ciclo <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="Ex: Ciclo de Avaliação 2024.1" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            value={data.nome || ''}
            onChange={(e) => update({ nome: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Objetivo Principal</label>
          <input 
            type="text" 
            placeholder="Ex: Feedback para desenvolvimento de carreira" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={data.objetivo || ''}
            onChange={(e) => update({ objetivo: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Data de Início <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              value={data.dataInicio || ''}
              onChange={(e) => update({ dataInicio: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Data de Encerramento <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              value={data.dataFim || ''}
              onChange={(e) => update({ dataFim: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Descrição / Mensagem aos participantes</label>
          <textarea 
            placeholder="Essa mensagem aparecerá no e-mail convite de todos os avaliadores." 
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={data.descricao || ''}
            onChange={(e) => update({ descricao: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

function StepAudience({ data, update }: any) {
  // Mock departments
  const allDeptos = ["Comercial", "Tecnologia", "Recursos Humanos", "Marketing", "Operações", "Financeiro"];
  
  const toggleDepto = (depto: string) => {
    const current = data.departamentos || [];
    if (current.includes(depto)) {
      update({ departamentos: current.filter((d: string) => d !== depto) });
    } else {
      update({ departamentos: [...current, depto] });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Público-Alvo</h3>
        <p className="text-sm text-muted-foreground">Selecione quais áreas e cargos participarão deste ciclo.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Departamentos Participantes</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allDeptos.map(depto => {
              const isSelected = (data.departamentos || []).includes(depto);
              return (
                <label 
                  key={depto} 
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-primary text-primary' : 'bg-background hover:bg-muted'}`}
                >
                  <input 
                    type="checkbox" 
                    className="accent-primary w-4 h-4"
                    checked={isSelected}
                    onChange={() => toggleDepto(depto)}
                  />
                  <span className="text-sm font-medium">{depto}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <label className="text-sm font-medium text-foreground">Cargos Elegíveis</label>
          <div className="p-4 rounded-md bg-muted/50 border text-sm text-muted-foreground flex items-center justify-center">
            Todos os cargos dos departamentos selecionados serão incluídos. 
            (Funcionalidade de filtro de cargo será implementada na v2).
          </div>
        </div>
      </div>
    </div>
  );
}

function StepRules({ data, update }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Regras de Avaliação</h3>
        <p className="text-sm text-muted-foreground">Configure quem pode avaliar quem na estrutura 360°.</p>
      </div>

      <div className="space-y-5">
        <label className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors">
          <div className="pt-0.5">
            <input 
              type="checkbox" 
              className="accent-primary w-5 h-5"
              checked={data.permiteAutoavaliacao}
              onChange={(e) => update({ permiteAutoavaliacao: e.target.checked })}
            />
          </div>
          <div>
            <p className="font-medium text-foreground">Autoavaliação</p>
            <p className="text-sm text-muted-foreground mt-1">O colaborador deve fazer uma autoavaliação antes de ver as notas dos outros.</p>
          </div>
        </label>

        <label className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors">
          <div className="pt-0.5">
            <input 
              type="checkbox" 
              className="accent-primary w-5 h-5"
              checked={data.paresAvaliamPares}
              onChange={(e) => update({ paresAvaliamPares: e.target.checked })}
            />
          </div>
          <div>
            <p className="font-medium text-foreground">Avaliação entre Pares (Peer Review)</p>
            <p className="text-sm text-muted-foreground mt-1">Colaboradores do mesmo departamento e nível hierárquico se avaliam.</p>
          </div>
        </label>

        <label className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 cursor-pointer transition-colors">
          <div className="pt-0.5">
            <input 
              type="checkbox" 
              className="accent-primary w-5 h-5"
              checked={data.gestorAvaliaSubordinado}
              onChange={(e) => update({ gestorAvaliaSubordinado: e.target.checked })}
            />
          </div>
          <div>
            <p className="font-medium text-foreground">Gestor avalia Subordinado (Top-down)</p>
            <p className="text-sm text-muted-foreground mt-1">Líderes diretos realizam avaliação de todos os membros de sua equipe.</p>
          </div>
        </label>
      </div>
    </div>
  );
}

function StepAnonymity({ data, update }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Confidencialidade</h3>
        <p className="text-sm text-muted-foreground">Defina as regras de anonimato para proteger os avaliadores.</p>
      </div>

      <div className="space-y-5">
        <label className="flex items-start gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 cursor-pointer">
          <div className="pt-0.5">
            <input 
              type="checkbox" 
              className="accent-emerald-600 w-5 h-5"
              checked={data.anonimatoAtivado}
              onChange={(e) => update({ anonimatoAtivado: e.target.checked })}
            />
          </div>
          <div>
            <p className="font-medium text-emerald-900 dark:text-emerald-400">Garantir Anonimato (Recomendado)</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-500 mt-1">As identidades dos pares e subordinados nunca serão reveladas ao avaliado.</p>
          </div>
        </label>

        <div className="p-4 rounded-lg border bg-card space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Pooling Mínimo para Exibição</label>
            <p className="text-xs text-muted-foreground mt-1 mb-3">Se um grupo (ex: pares) tiver menos respostas que esse valor, a nota não será mostrada para proteger a identidade.</p>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" max="5" 
              className="flex-1 accent-primary"
              value={data.poolingMinimo}
              onChange={(e) => update({ poolingMinimo: parseInt(e.target.value) })}
            />
            <div className="w-12 h-10 rounded-md border flex items-center justify-center font-bold text-primary bg-primary/5">
              {data.poolingMinimo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepReview({ data }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          Revisão Final
        </h3>
        <p className="text-sm text-muted-foreground">Confira os dados do ciclo antes de disparar os convites.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 p-5 rounded-lg border bg-muted/20">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Ciclo</span>
            <p className="font-semibold text-base mt-1">{data.nome}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Período</span>
            <p className="font-medium text-sm mt-1">{data.dataInicio || '---'} até {data.dataFim || '---'}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Público-alvo</span>
            <p className="font-medium text-sm mt-1">{(data.departamentos || []).length} departamento(s) selecionado(s)</p>
          </div>
        </div>

        <div className="space-y-4 p-5 rounded-lg border bg-muted/20">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Regras Ativas</span>
            <ul className="text-sm font-medium mt-2 space-y-1.5">
              <li className="flex items-center gap-2">
                {data.permiteAutoavaliacao ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-red-500" />}
                Autoavaliação
              </li>
              <li className="flex items-center gap-2">
                {data.paresAvaliamPares ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-red-500" />}
                Pares avaliam Pares
              </li>
              <li className="flex items-center gap-2">
                {data.gestorAvaliaSubordinado ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-red-500" />}
                Gestores avaliam Subordinados
              </li>
            </ul>
          </div>
          <div className="pt-2 border-t">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Confidencialidade</span>
            <p className="font-medium text-sm mt-1 text-emerald-600 dark:text-emerald-400">
              {data.anonimatoAtivado ? "Anonimato Garantido" : "Aberto"} (Pooling min: {data.poolingMinimo})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
