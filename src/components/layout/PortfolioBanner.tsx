import { useState, useEffect } from "react";
import { X, Briefcase, Github, ExternalLink } from "lucide-react";

const STORAGE_KEY = "nordelta_portfolio_banner_dismissed";

export function PortfolioBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="w-full bg-slate-900 text-slate-100 print:hidden z-50 relative border-b border-slate-700/50">
      <div className="max-w-screen-2xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0 bg-primary/20 border border-primary/30 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Briefcase className="h-3 w-3" />
            Case de Portfólio
          </div>
          <p className="text-xs text-slate-300 truncate">
            <span className="font-semibold text-white">Nordelta 360°</span>
            {" "}é um sistema fictício criado por{" "}
            <span className="font-semibold text-white">Clériston de Castro Ramos</span>
            {" "}para demonstrar competências em People Analytics, Design de Produto e Engenharia Frontend.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/cleristondecastroramos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 rounded px-2 py-1"
          >
            <Github className="h-3 w-3" />
            GitHub
            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
          </a>
          <button
            onClick={dismiss}
            className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
            title="Fechar aviso"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
