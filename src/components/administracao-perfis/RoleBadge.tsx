import { RoleType } from "@/lib/types";
import { Shield, ShieldAlert, ShieldCheck, User } from "lucide-react";

export function RoleBadge({ role, className = "" }: { role: RoleType; className?: string }) {
  let colorClass = "";
  let icon = null;

  switch (role) {
    case "Administrador":
      colorClass =
        "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50";
      icon = <ShieldAlert className="w-3.5 h-3.5 mr-1" />;
      break;
    case "Auditor":
      colorClass =
        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50";
      icon = <Shield className="w-3.5 h-3.5 mr-1" />;
      break;
    case "Gestor":
      colorClass = "bg-primary/10 text-primary border-primary/20";
      icon = <ShieldCheck className="w-3.5 h-3.5 mr-1" />;
      break;
    default:
      colorClass =
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      icon = <User className="w-3.5 h-3.5 mr-1" />;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${colorClass} ${className}`}
    >
      {icon}
      {role}
    </span>
  );
}
