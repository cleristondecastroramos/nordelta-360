import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileBarChart,
  Settings,
  LogOut,
  Building,
  UserCheck,
  Target,
  TrendingUp,
  HelpCircle,
  PieChart,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function Sidebar({
  isCollapsed = false,
  onToggle,
}: {
  isCollapsed?: boolean;
  onToggle?: () => void;
}) {
  const location = useLocation();

  const navSections = [
    {
      title: "Performance & Analytics",
      items: [
        { name: "Dashboard Executivo", path: "/dashboard", icon: LayoutDashboard },
        { name: "Departamentos", path: "/departamentos", icon: Building },
        { name: "Demografia", path: "/demografia", icon: PieChart },
        { name: "Evolução Histórica", path: "/evolucao-historica", icon: TrendingUp },
      ],
    },
    {
      title: "Gestão de Talentos",
      items: [
        { name: "Colaboradores", path: "/colaboradores", icon: Users },
        { name: "Ficha Individual", path: "/ficha-individual", icon: UserCheck },
        { name: "Feedbacks", path: "/feedbacks", icon: MessageSquare },
      ],
    },
    {
      title: "Estratégia & Resultados",
      items: [
        { name: "Ciclos de Avaliação", path: "/ciclos", icon: Target },
        { name: "Relatórios", path: "/relatorios", icon: FileBarChart },
      ],
    },
    {
      title: "Sistema",
      items: [
        { name: "Configurações", path: "/configuracoes", icon: Settings },
        { name: "Administração de Perfis", path: "/administracao-perfis", icon: Shield },
        { name: "Ajuda", path: "/ajuda", icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen ${isCollapsed ? "w-20" : "w-64"} border-r border-slate-800 bg-slate-950 text-slate-200 transition-all duration-300 flex flex-col shadow-xl`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4 shrink-0">
        <div className={`flex items-center gap-2 ${isCollapsed ? "w-full justify-center" : ""}`}>
          <div className="h-8 w-8 rounded bg-primary/20 flex shrink-0 items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white tracking-tight">
              Nordelta <span className="text-primary font-medium">360°</span>
            </h1>
          )}
        </div>
        {!isCollapsed && onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
      {isCollapsed && onToggle && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className={`flex-1 overflow-y-auto py-6 space-y-6 ${isCollapsed ? "px-3" : "px-4"}`}>
        {navSections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <div className="mb-3 px-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </p>
              </div>
            )}
            <ul className="space-y-1.5">
              {section.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" &&
                    item.path !== "/dashboard" &&
                    location.pathname.startsWith(item.path));
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      title={isCollapsed ? item.name : undefined}
                      className={`flex items-center rounded-lg ${isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"} text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-slate-400"}`}
                      />
                      {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className={`p-4 mt-auto border-t border-slate-800 bg-slate-900/50 shrink-0 ${isCollapsed ? "flex flex-col items-center gap-4" : ""}`}
      >
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors`}
        >
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User avatar"
            className="w-9 h-9 rounded-full border-2 border-slate-700 object-cover shrink-0"
          />
          {!isCollapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-200 truncate">Ana Silva</p>
                <p className="text-xs text-slate-500 truncate">Admin RH</p>
              </div>
              <Link
                to="/"
                onClick={() => sessionStorage.removeItem("isAuthenticated")}
                className="p-1.5 hover:bg-slate-700 rounded-md transition-colors shrink-0"
                title="Sair"
              >
                <LogOut className="h-4 w-4 text-slate-400 hover:text-rose-400 transition-colors" />
              </Link>
            </>
          )}
        </div>
        {!isCollapsed && (
          <div className="mt-3 flex items-center justify-between px-2">
            <p className="text-[10px] text-slate-600 font-medium tracking-wide uppercase">
              Nordelta V2.1.0
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] text-slate-500">Online</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <Link
            to="/"
            onClick={() => sessionStorage.removeItem("isAuthenticated")}
            className="p-2 hover:bg-slate-700 rounded-md transition-colors"
            title="Sair"
          >
            <LogOut className="h-4 w-4 text-slate-400 hover:text-rose-400 transition-colors" />
          </Link>
        )}
      </div>
    </aside>
  );
}
