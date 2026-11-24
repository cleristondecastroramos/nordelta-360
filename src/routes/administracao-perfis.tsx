import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminMetrics } from "@/lib/data-service";
import type { AdminMetrics, SystemUser } from "@/lib/types";
import { Shield, ShieldCheck, Users, Lock, Download, Activity, FileText } from "lucide-react";

// Components
import { ProfileKpiCard } from "@/components/administracao-perfis/ProfileKpiCard";
import { ProfileUsersTable } from "@/components/administracao-perfis/ProfileUsersTable";
import { ProfileEditorPanel } from "@/components/administracao-perfis/ProfileEditorPanel";
import { AuditTrailList } from "@/components/administracao-perfis/AuditTrailList";

export const Route = createFileRoute("/administracao-perfis")({
  component: AdministracaoPerfisPage,
});

function AdministracaoPerfisPage() {
  const [data, setData] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getAdminMetrics();
        setData(res);
      } catch (error) {
        console.error("Erro ao carregar governança:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleExportAudit = () => {
    if (!data || !data.auditoria) return;

    const headers = ["Status", "Ação", "Detalhe", "Responsável", "Data/Hora"];
    const rows = data.auditoria.map((log) => [
      log.status,
      log.acao,
      log.detalhe,
      log.usuarioAdmin,
      log.dataHora,
    ]);

    const csvContent = [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `auditoria_completa.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewProfile = () => {
    setSelectedUser({
      id: `new-${Date.now()}`,
      matricula: "",
      nome: "",
      email: "",
      cargo: "",
      departamento: "",
      status: "Ativo",
      role: "Colaborador",
      ultimoAcesso: "Nunca",
      modulos: [],
    });
  };

  if (loading || !data) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
          <Shield className="h-10 w-10 text-primary animate-pulse" />
          <p className="font-medium">Carregando governança de segurança...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Administração de Perfis
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Governança centralizada de acessos. Gerencie papéis (RBAC), controle permissões por
            módulo e monitore a trilha de auditoria do sistema.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAudit}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar Auditoria
          </button>
          <button
            onClick={handleNewProfile}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
          >
            <ShieldCheck className="mr-2 h-4 w-4" /> Novo Perfil
          </button>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <ProfileKpiCard
          title="Total de Usuários"
          value={data.totalUsuarios}
          icon={<Users className="h-5 w-5" />}
        />
        <ProfileKpiCard
          title="Perfis Ativos"
          value={data.perfisAtivos}
          icon={<Activity className="h-5 w-5" />}
          tooltipDesc="Usuários que podem realizar login no sistema."
        />
        <ProfileKpiCard
          title="Administradores Globais"
          value={data.totalAdministradores}
          icon={<Lock className="h-5 w-5" />}
          tooltipTitle="Acesso Total"
          tooltipDesc="Usuários com a role Administrador. É recomendado manter esse número o menor possível."
        />
        <ProfileKpiCard
          title="Bloqueados / Inativos"
          value={data.perfisRestritos}
          icon={<Shield className="h-5 w-5" />}
        />
        <ProfileKpiCard
          title="Logs Recentes"
          value={data.alteracoesRecentes}
          icon={<FileText className="h-5 w-5" />}
          tooltipDesc="Ações administrativas registradas na trilha de auditoria nas últimas 24h."
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid xl:grid-cols-5 gap-8">
        {/* USERS TABLE */}
        <div className="xl:col-span-3">
          <ProfileUsersTable users={data.usuarios} onEditUser={(user) => setSelectedUser(user)} />
        </div>

        {/* AUDIT TRAIL */}
        <div className="xl:col-span-2">
          <AuditTrailList logs={data.auditoria} />
        </div>
      </div>

      {/* EDITOR SLIDE-OVER */}
      <ProfileEditorPanel
        user={selectedUser}
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
