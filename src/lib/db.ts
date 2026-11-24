// Acesso aos dados no Supabase (tabelas colaboradores, feedbacks_finais e a view avaliacoes_anonimas).
//
// - As matrículas no banco estão no formato bruto ("c0561"); o app usa o formato
//   transformado ("C0561" = inicial do cargo + número). A conversão acontece aqui.
// - As notas por competência e a nota média vêm de src/lib/real_scores.json (mesmo
//   comportamento de antes); do banco vêm cadastro, percentil, gap e índice de potencial.
// - As duas tabelas são lidas uma vez e ficam em cache durante a sessão.
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import realScoresJson from "./real_scores.json";

type ColaboradorDb = Tables<"colaboradores">;

export type ColaboradorRow = ColaboradorDb & { matricula_db: string };

export interface FeedbackRow {
  avaliado_matricula: string;
  indicadores: Record<string, number>;
  nota_media: number;
  percentil_empresa: number | null;
  gap_gestor_auto: number | null;
  indice_potencial: number | null;
}

interface RealScore {
  avaliado_matricula: string;
  indicadores: Record<string, number>;
  nota_media: number;
}

// Mesma regra de transformMatricula() em data-service.ts (repetida para evitar import circular).
function toAppMatricula(matricula: string, cargo: string | null): string {
  const num = matricula.replace(/\D/g, "").padStart(4, "0");
  let first = (cargo || "Desconhecido").trim().charAt(0).toUpperCase();
  if (!/^[A-Z]$/.test(first)) first = "D";
  return `${first}${num}`;
}

// "comentario" vem do questionário como nota numérica, não é competência.
const NAO_COMPETENCIAS = new Set(["comentario"]);

const scorePorMatricula = new Map(
  (realScoresJson as RealScore[]).map((r) => [
    r.avaliado_matricula,
    {
      nota_media: r.nota_media,
      indicadores: Object.fromEntries(
        Object.entries(r.indicadores).filter(([k]) => !NAO_COMPETENCIAS.has(k)),
      ),
    },
  ]),
);

interface Snapshot {
  colaboradores: ColaboradorRow[];
  feedbacks: FeedbackRow[];
  colabPorMatricula: Map<string, ColaboradorRow>;
  feedbackPorMatricula: Map<string, FeedbackRow>;
}

async function fetchSnapshot(): Promise<Snapshot> {
  const [colabRes, fbRes] = await Promise.all([
    supabase.from("colaboradores").select("*"),
    supabase
      .from("feedbacks_finais")
      .select(
        "avaliado_matricula, indicadores, nota_media, percentil_empresa, gap_gestor_auto, indice_potencial",
      ),
  ]);
  if (colabRes.error) throw colabRes.error;
  if (fbRes.error) throw fbRes.error;

  const colaboradores: ColaboradorRow[] = colabRes.data.map((c) => ({
    ...c,
    matricula_db: c.matricula,
    matricula: toAppMatricula(c.matricula, c.cargo),
  }));
  const colabPorMatricula = new Map(colaboradores.map((c) => [c.matricula, c]));
  const colabPorMatriculaDb = new Map(colaboradores.map((c) => [c.matricula_db, c]));

  const feedbacks: FeedbackRow[] = fbRes.data.flatMap((fb) => {
    const colab = colabPorMatriculaDb.get(fb.avaliado_matricula);
    if (!colab) return [];
    const score = scorePorMatricula.get(colab.matricula);
    const indicadoresDb = (fb.indicadores ?? {}) as Record<string, number>;
    return [
      {
        avaliado_matricula: colab.matricula,
        indicadores:
          score?.indicadores ??
          Object.fromEntries(
            Object.entries(indicadoresDb).filter(([k]) => !NAO_COMPETENCIAS.has(k)),
          ),
        nota_media: score?.nota_media ?? Number(fb.nota_media ?? 0),
        percentil_empresa: fb.percentil_empresa,
        gap_gestor_auto: fb.gap_gestor_auto,
        indice_potencial: fb.indice_potencial,
      },
    ];
  });
  const feedbackPorMatricula = new Map(feedbacks.map((f) => [f.avaliado_matricula, f]));

  return { colaboradores, feedbacks, colabPorMatricula, feedbackPorMatricula };
}

let snapshotPromise: Promise<Snapshot> | null = null;

const EMPTY: Snapshot = {
  colaboradores: [],
  feedbacks: [],
  colabPorMatricula: new Map(),
  feedbackPorMatricula: new Map(),
};

async function getSnapshot(): Promise<Snapshot> {
  if (!snapshotPromise) {
    snapshotPromise = fetchSnapshot().catch((err) => {
      console.error("[db] Falha ao carregar dados do Supabase:", err);
      snapshotPromise = null; // permite nova tentativa na próxima navegação
      return EMPTY;
    });
  }
  return snapshotPromise;
}

// Sempre devolvemos cópias: o data-service altera alguns campos dos objetos.
const copyFeedback = (f: FeedbackRow): FeedbackRow => ({ ...f, indicadores: { ...f.indicadores } });

export async function listColaboradores(): Promise<ColaboradorRow[]> {
  return (await getSnapshot()).colaboradores.map((c) => ({ ...c }));
}

export async function findColaborador(matricula: string): Promise<ColaboradorRow | null> {
  const c = (await getSnapshot()).colabPorMatricula.get(matricula.toUpperCase());
  return c ? { ...c } : null;
}

export async function listFeedbacks(): Promise<FeedbackRow[]> {
  return (await getSnapshot()).feedbacks.map(copyFeedback);
}

export async function findFeedback(matricula: string): Promise<FeedbackRow | null> {
  const f = (await getSnapshot()).feedbackPorMatricula.get(matricula.toUpperCase());
  return f ? copyFeedback(f) : null;
}

export async function listComentarios(matriculaDb: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("avaliacoes_anonimas")
    .select("comentario")
    .eq("avaliado_matricula", matriculaDb)
    .not("comentario", "is", null);
  if (error) {
    console.error("[db] Falha ao carregar comentários:", error);
    return [];
  }
  return data.map((a) => a.comentario).filter((c): c is string => !!c);
}
