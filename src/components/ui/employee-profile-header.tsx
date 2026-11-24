import { Mail, Phone, ArrowLeft, Download, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AvatarUpload } from "./avatar-upload";
import { StatusChip } from "./status-chip";
import type { Colaborador } from "@/lib/types";

interface EmployeeProfileHeaderProps {
  colaborador: Colaborador;
  onBack: () => void;
  onExport: () => void;
  onPhotoUpload?: (file: File) => void;
}

export function EmployeeProfileHeader({
  colaborador,
  onBack,
  onExport,
  onPhotoUpload,
}: EmployeeProfileHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Início
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <Link to="/colaboradores" className="hover:text-primary transition-colors">
            Colaboradores
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <span className="text-foreground line-clamp-1">{colaborador.nome}</span>
        </nav>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" /> Gerar PDF
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-center md:items-start relative overflow-hidden">
        {/* Subtle decorative background blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <AvatarUpload
          name={colaborador.nome}
          initialImage={
            colaborador.avatar_url ||
            (colaborador.foto_url !== "/placeholder.svg" ? colaborador.foto_url : undefined)
          }
          onUpload={onPhotoUpload}
        />

        <div className="flex-1 space-y-3 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            <h2 className="text-3xl font-bold tracking-tight">{colaborador.nome}</h2>
            <StatusChip
              variant={colaborador.estado.toLowerCase() === "ativo" ? "success" : "default"}
            >
              {colaborador.estado}
            </StatusChip>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
            <span className="text-foreground text-base">{colaborador.cargo}</span>
            <span className="hidden md:inline">•</span>
            <span className="bg-muted px-2.5 py-0.5 rounded-full">{colaborador.departamento}</span>
            <span className="hidden md:inline">•</span>
            <span>Matrícula: {colaborador.matricula}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm pt-2 text-muted-foreground">
            <span className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
              <Mail className="h-4 w-4" /> {colaborador.email}
            </span>
            <span className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
              <Phone className="h-4 w-4" /> {colaborador.telefone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
