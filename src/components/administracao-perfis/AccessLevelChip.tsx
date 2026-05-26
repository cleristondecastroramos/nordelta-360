import { StatusType } from "@/lib/types";

export function AccessLevelChip({ status, className = "" }: { status: StatusType; className?: string }) {
  let colorClass = "";

  switch (status) {
    case "Ativo":
      colorClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      break;
    case "Bloqueado":
      colorClass = "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
      break;
    default:
      colorClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClass} ${className}`}>
      {status === 'Ativo' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
      {status === 'Bloqueado' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>}
      {status === 'Inativo' && <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>}
      {status}
    </span>
  );
}
