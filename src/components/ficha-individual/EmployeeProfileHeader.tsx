import { Colaborador } from "@/lib/types";
import { calculateTenure } from "@/lib/utils";
import { Camera, Download, ChevronLeft, MapPin, Building2, Briefcase } from "lucide-react";

interface EmployeeProfileHeaderProps {
  colaborador: Colaborador;
  onBack: () => void;
  onExport: () => void;
}

export function EmployeeProfileHeader({ colaborador, onBack, onExport }: EmployeeProfileHeaderProps) {
  const isLideranca = ["Diretor", "Gerente", "Coordenador", "Head", "Líder"].some(c => (colaborador.cargo || "").includes(c));

  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden relative">
      {/* Abstract Background Banner */}
      <div className="h-24 md:h-32 bg-gradient-to-r from-slate-900 via-primary to-slate-800 relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-black/20 hover:bg-black/40 text-white h-9 px-4 backdrop-blur-sm"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
        </button>
        <button 
          onClick={onExport}
          className="absolute top-4 right-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 text-white border border-white/20 h-9 px-4 backdrop-blur-sm"
        >
          <Download className="mr-2 h-4 w-4" /> Exportar PDF
        </button>
      </div>

      <div className="px-6 pb-6 pt-0 flex flex-col md:flex-row gap-6 items-start md:items-end relative -mt-12 md:-mt-16">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-card bg-muted overflow-hidden shadow-lg">
            {colaborador.avatar_url ? (
              <img 
                src={colaborador.avatar_url} 
                alt={colaborador.nome} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Briefcase className="h-10 w-10" />
              </div>
            )}
          </div>
          <button className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 w-full flex flex-col md:flex-row md:items-center justify-between gap-4 md:mb-2">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {colaborador.nome}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                (colaborador as any).estado === "Ativo" 
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                  : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
              }`}>
                {(colaborador as any).estado || "Ativo"}
              </span>
              {isLideranca && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  Liderança
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 text-foreground/80">
                <Briefcase className="h-4 w-4" /> {colaborador.cargo}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> {colaborador.departamento}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {colaborador.cidade || "Sede"} / {colaborador.estado_uf || "SP"}
              </span>
            </div>
          </div>

          <div className="flex gap-4 border-t md:border-t-0 pt-4 md:pt-0 md:border-l pl-0 md:pl-6 border-border">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Matrícula</span>
              <span className="font-bold text-foreground">{colaborador.matricula}</span>
            </div>
            <div className="w-px bg-border h-10 hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tempo de Casa</span>
              <span className="font-bold text-primary">{calculateTenure(colaborador.data_admissao)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
