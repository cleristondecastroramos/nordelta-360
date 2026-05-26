import { SystemUser } from "@/lib/types";
import { X, Save, User as UserIcon, Mail, Building2, Briefcase, Lock, AlertTriangle } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { AccessLevelChip } from "./AccessLevelChip";
import { PermissionsMatrix } from "./PermissionsMatrix";

interface ProfileEditorPanelProps {
  user: SystemUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditorPanel({ user, isOpen, onClose }: ProfileEditorPanelProps) {
  if (!user) return null;

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Slide-over panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <h2 className="text-xl font-bold tracking-tight">Editar Perfil</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* User Info Header */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{user.nome}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5" /> {user.cargo}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <RoleBadge role={user.role} />
                <AccessLevelChip status={user.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1 border p-3 rounded-lg bg-card">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Matrícula
              </span>
              <span className="font-semibold">{user.matricula}</span>
            </div>
            <div className="flex flex-col gap-1 border p-3 rounded-lg bg-card">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Departamento
              </span>
              <span className="font-semibold">{user.departamento}</span>
            </div>
            <div className="flex flex-col gap-1 border p-3 rounded-lg bg-card col-span-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Corporativo
              </span>
              <span className="font-semibold">{user.email}</span>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4 pt-2 border-t border-border">
            <h4 className="font-semibold text-base">Configurações de Acesso</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Papel do Sistema (Role)</label>
                <select 
                  className="w-full text-sm bg-background border border-input rounded-md py-2 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                  defaultValue={user.role}
                >
                  <option value="Colaborador">Colaborador (Padrão)</option>
                  <option value="Gestor">Gestor</option>
                  <option value="Auditor">Auditor (Apenas Leitura)</option>
                  <option value="Administrador">Administrador (Acesso Total)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Status da Conta</label>
                <select 
                  className="w-full text-sm bg-background border border-input rounded-md py-2 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                  defaultValue={user.status}
                >
                  <option value="Ativo">🟢 Ativo</option>
                  <option value="Inativo">⚪ Inativo</option>
                  <option value="Bloqueado">🔴 Bloqueado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="pt-2">
            <PermissionsMatrix role={user.role} />
          </div>

          {user.role === "Administrador" && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg flex gap-3 text-amber-800 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-xs leading-relaxed">
                Este usuário possui privilégios de Administrador Global. Qualquer alteração em suas permissões afetará o acesso a dados sensíveis.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-card flex justify-end gap-3 mt-auto">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-input rounded-md hover:bg-accent transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </>
  );
}
