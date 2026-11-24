import { useState } from "react";
import { SystemUser } from "@/lib/types";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { AccessLevelChip } from "./AccessLevelChip";

interface ProfileUsersTableProps {
  users: SystemUser[];
  onEditUser: (user: SystemUser) => void;
}

export function ProfileUsersTable({ users, onEditUser }: ProfileUsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Filter
  const filteredUsers = users.filter(
    (u) =>
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.matricula.includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border bg-muted/10 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, matrícula ou e-mail..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:ring-1 focus:ring-primary focus:outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4">
            <Filter className="mr-2 h-4 w-4" /> Filtros Avançados
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Colaborador</th>
              <th className="px-4 py-4 font-semibold">Papel (Role)</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold">Módulos Autorizados</th>
              <th className="px-4 py-4 font-semibold">Último Acesso</th>
              <th className="px-4 py-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum usuário encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{user.nome}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        Mat: {user.matricula}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <AccessLevelChip status={user.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap max-w-[200px]">
                      <span
                        className="text-xs text-muted-foreground truncate"
                        title={user.modulos.join(", ")}
                      >
                        {user.modulos.length} módulo(s) liberados
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-medium">
                    {user.ultimoAcesso}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onEditUser(user)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Gerenciar Permissões"
                    >
                      {user.role === "Administrador" ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Edit className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Mostrando{" "}
          <span className="font-medium text-foreground">{(page - 1) * itemsPerPage + 1}</span> a{" "}
          <span className="font-medium text-foreground">
            {Math.min(page * itemsPerPage, filteredUsers.length)}
          </span>{" "}
          de <span className="font-medium text-foreground">{filteredUsers.length}</span> usuários
        </div>
        <div className="flex gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1 rounded border bg-background hover:bg-muted disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="p-1 rounded border bg-background hover:bg-muted disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
