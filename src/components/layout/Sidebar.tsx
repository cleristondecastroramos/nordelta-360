import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  MessageSquare,
  FileBarChart,
  Settings,
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();
  
  const navSections = [
    {
      title: "Recursos Humanos",
      items: [
        { name: "Dashboard 360", path: "/", icon: LayoutDashboard },
        { name: "Colaboradores", path: "/colaboradores", icon: Users },
        { name: "Feedbacks", path: "/feedbacks", icon: MessageSquare },
      ]
    },
    {
      title: "People Analytics",
      items: [
        { name: "Demografia", path: "/demografia", icon: FileBarChart },
        { name: "Evolução Histórica", path: "/relatorios", icon: GitBranch },
      ]
    },
    {
      title: "Administração",
      items: [
        { name: "Gestão de Ciclos", path: "/ciclos", icon: Settings },
        { name: "Configurações", path: "/configuracoes", icon: Settings },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-slate-950 text-slate-200 transition-transform flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Nordelta <span className="text-primary font-medium">360°</span></h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="mb-3 px-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{section.title}</p>
            </div>
            <ul className="space-y-1.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
                const Icon = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-slate-400"}`} />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 mt-auto border-t border-slate-800 bg-slate-900/50 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
          <img 
            src="https://randomuser.me/api/portraits/women/44.jpg" 
            alt="User avatar" 
            className="w-9 h-9 rounded-full border-2 border-slate-700 object-cover"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-200 truncate">Ana Silva</p>
            <p className="text-xs text-slate-500 truncate">Admin RH</p>
          </div>
          <Settings className="h-4 w-4 text-slate-500 hover:text-slate-300 transition-colors" />
        </div>
        <div className="mt-3 flex items-center justify-between px-2">
          <p className="text-[10px] text-slate-600 font-medium tracking-wide uppercase">Nordelta V2.1.0</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] text-slate-500">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
