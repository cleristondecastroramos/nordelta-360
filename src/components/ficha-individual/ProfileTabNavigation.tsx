import { Target, Layers, MessageSquare, TrendingUp, Compass } from "lucide-react";

interface ProfileTabNavigationProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export function ProfileTabNavigation({ activeTab, onChangeTab }: ProfileTabNavigationProps) {
  const tabs = [
    { id: "resumo", label: "Resumo Executivo", icon: <Target className="h-4 w-4 mr-2" /> },
    { id: "competencias", label: "Competências", icon: <Layers className="h-4 w-4 mr-2" /> },
    { id: "comentarios", label: "Comentários", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { id: "evolucao", label: "Evolução Histórica", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
    { id: "pdi", label: "Plano de Desenvolvimento", icon: <Compass className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="w-full border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 px-6 pt-2 overflow-x-auto custom-scrollbar rounded-t-xl">
      <nav className="flex space-x-6 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 relative ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-md animate-in fade-in zoom-in duration-300"></span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
