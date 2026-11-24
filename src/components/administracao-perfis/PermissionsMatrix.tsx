import { useState } from "react";
import { Shield } from "lucide-react";

interface Permission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  manage: boolean;
}

interface PermissionsMatrixProps {
  role: string;
}

export function PermissionsMatrix({ role }: PermissionsMatrixProps) {
  // Mock default permissions based on role
  const isAdmin = role === "Administrador";
  const isGestor = role === "Gestor";
  const isAuditor = role === "Auditor";

  const [permissions, setPermissions] = useState<Permission[]>([
    { module: "Dashboard Executivo", read: true, write: isAdmin, delete: false, manage: isAdmin },
    {
      module: "Ficha Individual",
      read: true,
      write: isAdmin || isGestor,
      delete: isAdmin,
      manage: isAdmin,
    },
    {
      module: "Departamentos",
      read: true,
      write: isAdmin || isGestor,
      delete: false,
      manage: isAdmin,
    },
    {
      module: "Demografia",
      read: isAdmin || isAuditor,
      write: false,
      delete: false,
      manage: isAdmin,
    },
    { module: "Avaliação 360", read: true, write: true, delete: isAdmin, manage: isAdmin },
    {
      module: "Administração de Perfis",
      read: isAdmin || isAuditor,
      write: isAdmin,
      delete: isAdmin,
      manage: isAdmin,
    },
  ]);

  const togglePermission = (idx: number, field: keyof Permission) => {
    if (role === "Administrador") return; // Prevent changing default admin for the demo
    const updated = [...permissions];
    updated[idx] = { ...updated[idx], [field]: !updated[idx][field] };
    setPermissions(updated);
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Matriz de Acessos
        </h4>
        <span className="text-xs text-muted-foreground">Baseado no Papel (RBAC)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-background border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">Módulo</th>
              <th className="px-3 py-3 text-center font-medium">Ler</th>
              <th className="px-3 py-3 text-center font-medium">Editar</th>
              <th className="px-3 py-3 text-center font-medium">Excluir</th>
              <th className="px-3 py-3 text-center font-medium">Gerenciar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {permissions.map((p, idx) => (
              <tr key={p.module} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 font-medium text-foreground">{p.module}</td>
                {["read", "write", "delete", "manage"].map((field) => (
                  <td key={field} className="px-3 py-2.5 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                        checked={p[field as keyof Permission] as boolean}
                        onChange={() => togglePermission(idx, field as keyof Permission)}
                        disabled={isAdmin} // Admins always have everything in this mock
                      />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
