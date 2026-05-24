import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feedbacks")({
  component: FeedbacksPage,
});

function FeedbacksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Feedbacks Consolidados</h2>
        <p className="text-muted-foreground">Visão geral gerencial de aprovação de feedbacks.</p>
      </div>

      <div className="rounded-xl border bg-card p-8 text-center text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold">Módulo de Feedbacks em Breve</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          A matriz de calibragem gerencial e aprovação de resumos de feedback será disponibilizada em breve.
        </p>
      </div>
    </div>
  );
}
