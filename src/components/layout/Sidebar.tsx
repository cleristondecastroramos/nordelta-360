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
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Colaboradores", path: "/colaboradores", icon: Users },
    { name: "Ciclos 360°", path: "/ciclos", icon: GitBranch },
    { name: "Feedbacks", path: "/feedbacks", icon: MessageSquare },
    { name: "Relatórios", path: "/relatorios", icon: FileBarChart },
    { name: "Configurações", path: "/configuracoes", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary tracking-tight">Nordelta 360°</h1>
      </div>
      <div className="overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-lg p-2 text-base font-normal transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
