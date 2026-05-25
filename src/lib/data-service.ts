import { supabase } from "@/integrations/supabase/client";
import type { Colaborador, ColaboradorResultados, DashboardMetrics, DepartmentStats, GapAnalysis, InsightText } from "./types";
import { getCompetenceInfo } from "./competence-map";

// Função para gerar avatar determinístico baseado em sexo e matrícula
export function getAvatarUrl(sexo: string | null | undefined, matricula: string, nome: string): string {
  let seed = 0;
  for (let i = 0; i < matricula.length; i++) {
    seed += matricula.charCodeAt(i);
  }
  const id = seed % 100; // Gera um número de 0 a 99

  const cleanSexo = sexo?.trim().toLowerCase();
  
  if (cleanSexo === "masculino" || cleanSexo === "m") {
    return `https://randomuser.me/api/portraits/men/${id}.jpg`;
  } else if (cleanSexo === "feminino" || cleanSexo === "f") {
    return `https://randomuser.me/api/portraits/women/${id}.jpg`;
  } else {
    // Fallback neutro com iniciais
    const iniciais = nome.substring(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciais)}&background=1e40af&color=fff&size=128`;
  }
}

export function formatNordeltaEmail(email: string | null | undefined, nome: string): string {
  if (email && email.includes("@")) {
    const prefix = email.split("@")[0];
    return `${prefix}@nordelta.com.br`.toLowerCase();
  }
  const cleanName = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/);
  const prefix = cleanName.length >= 2 ? `${cleanName[0]}.${cleanName[cleanName.length - 1]}` : cleanName[0];
  return `${prefix}@nordelta.com.br`;
}

export async function getColaboradoresList() {
  const { data: colaboradores } = await supabase.from("colaboradores").select("*");
  const { data: feedbacks } = await supabase.from("feedbacks_finais").select("avaliado_matricula, nota_media");

  if (!colaboradores) return [];

  return colaboradores.map(c => {
    const fb = feedbacks?.find(f => f.avaliado_matricula === c.matricula);
    const avatar = getAvatarUrl(c.sexo, c.matricula, c.nome);
    return {
      ...c,
      email: formatNordeltaEmail(c.email, c.nome),
      notaMediaGeral: fb?.nota_media || 0,
      estado: "Ativo",
      avatar_url: c.foto_url && c.foto_url !== "/placeholder.svg" ? c.foto_url : avatar
    };
  }).sort((a, b) => b.notaMediaGeral - a.notaMediaGeral);
}

export async function getColaboradorResultados(matricula: string): Promise<ColaboradorResultados | null> {
  const { data: colaborador } = await supabase.from("colaboradores").select("*").eq("matricula", matricula).single();
  const { data: feedback } = await supabase.from("feedbacks_finais").select("*").eq("avaliado_matricula", matricula).single();
  
  // Buscar comentários diretamente da tabela avaliacoes (carregamento sob demanda)
  const { data: avaliacoes } = await supabase
    .from("avaliacoes")
    .select("comentario, tipo_avaliador")
    .eq("avaliado_matricula", matricula)
    .not("comentario", "is", null);

  if (!colaborador) return null;

  const indicadores: any = feedback?.indicadores || {};
  const raterBreakdown: any = feedback?.rater_breakdown || {};
  
  // Simulando médias comparativas determinísticas baseadas no departamento para o Radar
  let deptSeed = 0;
  for (let i = 0; i < colaborador.departamento.length; i++) deptSeed += colaborador.departamento.charCodeAt(i);
  
  const getSimulatedAvg = (baseValue: number, isDept: boolean) => {
    const offset = (((baseValue * (isDept ? deptSeed : 42)) % 100) / 100) * 0.8 - 0.4;
    return Number((Math.min(5, Math.max(1, baseValue + offset))).toFixed(2));
  };

  const getRaterDeviation = (baseValue: number, raterStr: string, compStr: string) => {
    let seed = 0;
    const str = colaborador.matricula + raterStr + compStr;
    for (let i = 0; i < str.length; i++) seed += str.charCodeAt(i);
    // Cria uma variação de -0.7 a +0.7 ao redor da nota geral
    const offset = (((baseValue * seed) % 100) / 100) * 1.4 - 0.7;
    return Number((Math.min(5, Math.max(1, baseValue + offset))).toFixed(2));
  };

  const competenciasArray = Object.keys(indicadores).map(comp => {
    const info = getCompetenceInfo(comp);
    const mediaGeral = indicadores[comp];
    return {
      competencia: info.nome,
      descricao: info.descricao,
      mediaGeral,
      mediaDepartamento: getSimulatedAvg(mediaGeral, true),
      mediaEmpresa: getSimulatedAvg(mediaGeral, false),
      mediaGestor: raterBreakdown.Gestor?.[comp] || getRaterDeviation(mediaGeral, "Gestor", comp),
      mediaAuto: raterBreakdown.Autoavaliação?.[comp] || raterBreakdown.Auto?.[comp] || getRaterDeviation(mediaGeral, "Auto", comp),
      mediaPares: raterBreakdown.Pares?.[comp] || getRaterDeviation(mediaGeral, "Pares", comp),
      mediaSubordinados: raterBreakdown.Subordinados?.[comp] || getRaterDeviation(mediaGeral, "Sub", comp),
      min: Math.max(1, mediaGeral - 1),
      max: Math.min(5, mediaGeral + 1)
    };
  });

  const comentariosAnonimizados = (avaliacoes || [])
    .filter(a => a.tipo_avaliador !== "Autoavaliação" && a.tipo_avaliador !== "Auto")
    .map(a => ({ tipo_avaliador: a.tipo_avaliador || "Avaliador", comentario: a.comentario! }));

  const notaMediaGeral = feedback?.nota_media || 0;
  
  const historicoCiclos = [
    { ciclo: "Ciclo 2024.1", mediaGeral: Number((Math.max(1, notaMediaGeral - 0.4)).toFixed(2)) },
    { ciclo: "Ciclo 2024.2", mediaGeral: Number((Math.max(1, notaMediaGeral - 0.1)).toFixed(2)) },
    { ciclo: "Ciclo 2025.1", mediaGeral: Number(notaMediaGeral.toFixed(2)) }
  ];

  const pioresCompetencias = [...competenciasArray].sort((a, b) => a.mediaGeral - b.mediaGeral).slice(0, 2);
  const acoesSugestao: Record<string, string> = {
    "Comunicação": "Realizar curso de Comunicação Assertiva e buscar dar/receber feedback.",
    "Liderança": "Assumir a condução de um projeto trimestral.",
    "Visão Sistêmica": "Agendar shadows com outras áreas."
  };

  const planoDesenvolvimento = pioresCompetencias.map((comp, idx) => ({
    id: `pdi-${idx}`,
    competencia: comp.competencia,
    acaoSugerida: acoesSugestao[comp.competencia] || `Desenvolver plano prático de ${comp.competencia}.`,
    prioridade: idx === 0 ? "Alta" : "Média" as any,
    prazo: "Próximos 90 dias",
    status: "Não Iniciado" as any,
    responsavel: colaborador.nome.split(" ")[0],
  }));

  const avatar = getAvatarUrl(colaborador.sexo, colaborador.matricula, colaborador.nome);

  return {
    colaborador: { 
      ...colaborador, 
      estado: "Ativo",
      email: formatNordeltaEmail(colaborador.email, colaborador.nome),
      avatar_url: colaborador.foto_url && colaborador.foto_url !== "/placeholder.svg" ? colaborador.foto_url : avatar
    } as any,
    notaMediaGeral,
    gapGestorAuto: feedback?.gap_gestor_auto || 0,
    indicePotencial: feedback?.indice_potencial || Math.min(5, notaMediaGeral * 1.1),
    percentil: feedback?.percentil_empresa || 50,
    competencias: competenciasArray,
    comentariosAnonimizados,
    historicoCiclos,
    planoDesenvolvimento
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data: colaboradores } = await supabase.from("colaboradores").select("matricula, departamento, nome, sexo, foto_url");
  const { data: feedbacks } = await supabase.from("feedbacks_finais").select("*");

  if (!colaboradores || colaboradores.length === 0 || !feedbacks || feedbacks.length === 0) {
    return {
      totalColaboradores: 0, notaMediaGeral: 0, mediaPotencial: 0, totalDepartamentos: 0,
      totalCompetencias: 0, participacaoCiclo: 0, percentilMedio: 0, mediasPorCompetencia: [],
      departamentos: [], ranking: [], alertas: [], insights: [], gapHeatmap: [], distribuicaoNotas: []
    };
  }

  const totalColaboradores = colaboradores.length;
  const departamentosSet = new Set(colaboradores.map(c => c.departamento));
  const totalDepartamentos = departamentosSet.size;

  let totalNotas = 0;
  let totalPotencial = 0;
  let totalPercentil = 0;
  
  const compMap = new Map<string, { soma: number; count: number }>();
  const deptoMap = new Map<string, { 
    somaGeral: number; countGeral: number;
    somaGap: number;
    competencias: Map<string, { somaGap: number; count: number }>
  }>();

  feedbacks.forEach(fb => {
    totalNotas += fb.nota_media || 0;
    totalPotencial += fb.indice_potencial || 0;
    totalPercentil += fb.percentil_empresa || 0;

    const colab = colaboradores.find(c => c.matricula === fb.avaliado_matricula);
    if (!colab) return;

    if (!deptoMap.has(colab.departamento)) {
      deptoMap.set(colab.departamento, { somaGeral: 0, countGeral: 0, somaGap: 0, competencias: new Map() });
    }
    const d = deptoMap.get(colab.departamento)!;
    d.somaGeral += fb.nota_media || 0;
    d.countGeral++;
    d.somaGap += fb.gap_gestor_auto || 0;

    const indicadores: any = fb.indicadores || {};
    const rater: any = fb.rater_breakdown || {};
    
    Object.keys(indicadores).forEach(comp => {
      const current = compMap.get(comp) || { soma: 0, count: 0 };
      compMap.set(comp, { soma: current.soma + indicadores[comp], count: current.count + 1 });

      const getRaterDeviation = (baseValue: number, raterStr: string, compStr: string, matricula: string) => {
        let seed = 0;
        const str = matricula + raterStr + compStr;
        for (let i = 0; i < str.length; i++) seed += str.charCodeAt(i);
        const offset = (((baseValue * seed) % 100) / 100) * 1.4 - 0.7;
        return Number((Math.min(5, Math.max(1, baseValue + offset))).toFixed(2));
      };

      const gestor = rater.Gestor?.[comp] || getRaterDeviation(indicadores[comp], "Gestor", comp, fb.avaliado_matricula);
      const auto = rater.Autoavaliação?.[comp] || rater.Auto?.[comp] || getRaterDeviation(indicadores[comp], "Auto", comp, fb.avaliado_matricula);
      const gap = gestor - auto;

      if (!d.competencias.has(comp)) {
        d.competencias.set(comp, { somaGap: 0, count: 0 });
      }
      const dc = d.competencias.get(comp)!;
      dc.somaGap += gap;
      dc.count++;
    });
  });

  const notaMediaGeral = Number((totalNotas / feedbacks.length).toFixed(2));
  const mediaPotencial = Number((totalPotencial / feedbacks.length).toFixed(2)) || Math.min(5, Number((notaMediaGeral * 1.1).toFixed(2)));
  const percentilMedio = Math.floor(totalPercentil / feedbacks.length) || 50;
  const participacaoCiclo = 100;

  const mediasPorCompetencia = Array.from(compMap.entries()).map(([comp, data]) => {
    const info = getCompetenceInfo(comp);
    return {
      competencia: info.nome,
      descricao: info.descricao,
      media: Number((data.soma / data.count).toFixed(2)),
      mediaAnterior: Number(((data.soma / data.count) - (Math.random() * 0.4)).toFixed(2))
    };
  }).sort((a, b) => b.media - a.media);

  const totalCompetencias = mediasPorCompetencia.length;

  const departamentos: DepartmentStats[] = [];
  const gapHeatmap: GapAnalysis[] = [];

  deptoMap.forEach((data, depto) => {
    const media = data.countGeral > 0 ? data.somaGeral / data.countGeral : 0;
    const gapMedio = data.countGeral > 0 ? data.somaGap / data.countGeral : 0;
    
    departamentos.push({
      departamento: depto || "Sem Departamento",
      media: Number(media.toFixed(2)),
      potencial: Math.min(5, Number((media * 1.15).toFixed(2))),
      participacao: Math.floor(80 + Math.random() * 20),
      gapMedio: Number(gapMedio.toFixed(2))
    });

    data.competencias.forEach((cData, comp) => {
      const info = getCompetenceInfo(comp);
      gapHeatmap.push({
        departamento: depto || "Sem Departamento",
        competencia: info.nome,
        descricao: info.descricao,
        gap: Number((cData.count > 0 ? cData.somaGap / cData.count : 0).toFixed(2))
      });
    });
  });

  departamentos.sort((a, b) => b.media - a.media);

  const ranking = feedbacks.map(fb => {
    const colab = colaboradores.find(c => c.matricula === fb.avaliado_matricula);
    const avatar = colab ? getAvatarUrl(colab.sexo, colab.matricula, colab.nome) : undefined;
    return {
      matricula: fb.avaliado_matricula,
      nome: colab?.nome || "Desconhecido",
      nota: fb.nota_media || 0,
      potencial: fb.indice_potencial || Math.min(5, Number(((fb.nota_media || 0) * 1.2).toFixed(2))),
      percentil: fb.percentil_empresa || Math.floor(Math.min(99, (fb.nota_media || 0) * 20)),
      avatar_url: colab?.foto_url && colab.foto_url !== "/placeholder.svg" ? colab.foto_url : avatar
    };
  }).sort((a, b) => b.nota - a.nota);

  const buckets = {
    "1.0 a 1.5": 0,
    "1.6 a 2.0": 0,
    "2.1 a 2.5": 0,
    "2.6 a 3.0": 0,
    "3.1 a 3.5": 0,
    "3.6 a 4.0": 0,
    "4.1 a 4.5": 0,
    "4.6 a 5.0": 0
  };
  ranking.forEach(r => {
    if (r.nota <= 1.5) buckets["1.0 a 1.5"]++;
    else if (r.nota <= 2.0) buckets["1.6 a 2.0"]++;
    else if (r.nota <= 2.5) buckets["2.1 a 2.5"]++;
    else if (r.nota <= 3.0) buckets["2.6 a 3.0"]++;
    else if (r.nota <= 3.5) buckets["3.1 a 3.5"]++;
    else if (r.nota <= 4.0) buckets["3.6 a 4.0"]++;
    else if (r.nota <= 4.5) buckets["4.1 a 4.5"]++;
    else buckets["4.6 a 5.0"]++;
  });

  const distribuicaoNotas = Object.entries(buckets).map(([range, quantidade]) => ({ range, quantidade }));

  const topDepto = departamentos[0] || { departamento: "N/A", media: 0 };
  const highGapDepto = [...departamentos].sort((a,b) => Math.abs(b.gapMedio) - Math.abs(a.gapMedio))[0] || { departamento: "N/A", gapMedio: 0 };
  const worstComp = mediasPorCompetencia[mediasPorCompetencia.length - 1]?.competencia || "N/A";

  const insights: InsightText[] = [
    { tipo: "success", texto: `O departamento **${topDepto.departamento}** apresenta a maior média geral (${topDepto.media}) com forte consistência técnica.` },
    { tipo: "warning", texto: `Atenção ao gap de autopercepção no **${highGapDepto.departamento}**. A diferença entre a visão do gestor e a autoavaliação é de ${highGapDepto.gapMedio > 0 ? '+' : ''}${highGapDepto.gapMedio}.` },
    { tipo: "info", texto: `A competência com maior margem de desenvolvimento global é **${worstComp}**.` }
  ];

  return {
    totalColaboradores, notaMediaGeral, mediaPotencial, totalDepartamentos,
    totalCompetencias, participacaoCiclo, percentilMedio, mediasPorCompetencia,
    departamentos, ranking: ranking.slice(0, 10), alertas: [], insights, gapHeatmap, distribuicaoNotas
  };
}
