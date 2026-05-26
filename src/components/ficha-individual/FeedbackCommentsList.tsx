import { ColaboradorResultados } from "@/lib/types";
import { MessageSquareQuote, ShieldAlert } from "lucide-react";

interface FeedbackCommentsListProps {
  comentarios: ColaboradorResultados["comentariosAnonimizados"];
}

export function FeedbackCommentsList({ comentarios }: FeedbackCommentsListProps) {
  if (comentarios.length === 0) {
    return (
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageSquareQuote className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Nenhum feedback qualitativo</h3>
        <p className="text-muted-foreground max-w-sm">
          Este colaborador não recebeu comentários em texto neste ciclo de avaliação.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl">
        <div className="flex gap-3">
          <ShieldAlert className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Privacidade Assegurada</h4>
            <p className="text-sm text-blue-700/80 dark:text-blue-400/80 mt-1 leading-relaxed">
              Os comentários abaixo são apresentados em caráter confidencial. Identidades (exceto do Gestor) foram anonimizadas para proteger a integridade do processo 360° e garantir segurança psicológica aos avaliadores.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {comentarios.map((c, idx) => (
          <div key={idx} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Decoração superior */}
            <div className={`absolute top-0 left-0 w-full h-1 ${
              c.tipo_avaliador === 'Gestor' ? 'bg-primary' : 
              c.tipo_avaliador === 'Par' ? 'bg-amber-400' : 'bg-emerald-500'
            }`}></div>
            
            <MessageSquareQuote className="h-8 w-8 text-muted-foreground/10 absolute top-4 right-4 group-hover:scale-110 transition-transform" />
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                c.tipo_avaliador === 'Gestor' ? 'bg-primary/10 text-primary' : 
                c.tipo_avaliador === 'Par' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              }`}>
                {c.tipo_avaliador}
              </span>
            </div>
            
            <p className="text-foreground/90 leading-relaxed italic">
              "{c.comentario}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
