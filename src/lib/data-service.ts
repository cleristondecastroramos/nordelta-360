import { supabase } from "@/integrations/supabase/client";
import type { Colaborador, ColaboradorResultados, DashboardMetrics, DepartmentStats, GapAnalysis, InsightText } from "./types";
import { getCompetenceInfo } from "./competence-map";

export function checkIsLideranca(cargo: string): boolean {
  const c = (cargo || "").toLowerCase();
  return c.includes('gerente') || c.includes('coordenador') || c.includes('supervisor') || c.includes('líder') || c.includes('lider') || c.includes('head') || c.includes('diretor') || c.includes('executivo');
}

export function calculateRaterScores(baseValue: number, depto: string, comp: string, matricula: string, isLideranca: boolean) {
  // 1. Department Bonus/Penalty
  const d = (depto || "").toLowerCase();
  const c = (comp || "").toLowerCase();
  let deptOffset = 0;
  
  if (d.includes('ti') || d.includes('tecnologia')) {
    if (c.includes('técnica') || c.includes('problema')) deptOffset = 0.4;
  } else if (d.includes('rh') || d.includes('recursos')) {
    if (c.includes('desenvolvimento') || c.includes('equipe')) deptOffset = 0.4;
  } else if (d.includes('comercial') || d.includes('venda') || d.includes('marketing')) {
    if (c.includes('comunica') || c.includes('cliente')) deptOffset = 0.4;
  } else if (d.includes('finança') || d.includes('controladoria')) {
    if (c.includes('qualidade') || c.includes('ética')) deptOffset = 0.4;
  } else if (d.includes('operaç') || d.includes('produç') || d.includes('atendimento')) {
    if (c.includes('produtividade') || c.includes('adaptação')) deptOffset = 0.4;
  }

  const generateSeed = (seedStr: string) => {
    let hash = 5381;
    for (let i = 0; i < seedStr.length; i++) {
      hash = ((hash << 5) + hash) + seedStr.charCodeAt(i);
    }
    return Math.abs(hash);
  };

  // Nível global do colaborador (-2.0 a +2.0) para forçar presença nos extremos do histograma
  // Elevando ao cubo para criar uma curva mais espalhada e evitar que tudo se concentre no meio
  let empLevelRaw = ((generateSeed(matricula + "level") % 100) / 50) - 1; // -1 to 1
  const empLevel = Math.pow(empLevelRaw, 3) * 2.5; // push toward edges, amplitude -2.5 a +2.5
  
  // Nível específico da competência (-0.5 a +0.5)
  const compLevel = (((generateSeed(matricula + comp + "comp") % 100) / 100) * 1.0) - 0.5;

  const adjustedBase = Math.min(5, Math.max(1, baseValue + deptOffset + empLevel + compLevel));

  // 2. Generate Rater Noise (-0.5 a +0.5)
  const generateNoise = (seedStr: string) => {
    return (((generateSeed(seedStr) % 100) / 100) * 1.0) - 0.5;
  };

  // Distribuição aleatória de viés (para o Heatmap ter cores variadas)
  const raterProfile = generateSeed(matricula + comp + "profile") % 100;
  let gestorBias = 0;
  let autoBias = 0;

  if (raterProfile < 33) {
    // Síndrome do impostor: Gestor avalia melhor que Auto (Azul)
    gestorBias = 0.4;
    autoBias = -0.4;
  } else if (raterProfile < 66) {
    // Efeito Dunning-Kruger: Auto avalia melhor que Gestor (Vermelho)
    gestorBias = -0.4;
    autoBias = 0.4;
  } else {
    // Alinhados (Branco/Transparente)
    gestorBias = 0.1;
    autoBias = -0.1;
  }

  const gestor = Math.min(5, Math.max(1, adjustedBase + gestorBias + generateNoise(matricula + comp + "Gestor")));
  const auto = Math.min(5, Math.max(1, adjustedBase + autoBias + generateNoise(matricula + comp + "Auto")));
  const pares = Math.min(5, Math.max(1, adjustedBase + generateNoise(matricula + comp + "Pares")));
  
  let subordinados = 0;
  if (isLideranca) {
    subordinados = Math.min(5, Math.max(1, adjustedBase + 0.2 + generateNoise(matricula + comp + "Sub")));
  }

  // 3. True Analytical Average
  const totalRaters = isLideranca ? 4 : 3;
  const sum = gestor + auto + pares + subordinados;
  const mediaFinal = sum / totalRaters;

  return {
    mediaGestor: Number(gestor.toFixed(2)),
    mediaAuto: Number(auto.toFixed(2)),
    mediaPares: Number(pares.toFixed(2)),
    mediaSubordinados: isLideranca ? Number(subordinados.toFixed(2)) : 0,
    mediaGeral: Number(mediaFinal.toFixed(2))
  };
}

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
  const isLideranca = checkIsLideranca(colaborador.cargo);
  
  // Simulando médias comparativas determinísticas baseadas no departamento para o Radar
  let deptSeed = 0;
  for (let i = 0; i < colaborador.departamento.length; i++) deptSeed += colaborador.departamento.charCodeAt(i);
  
  const getSimulatedAvg = (baseValue: number, isDept: boolean) => {
    const offset = (((baseValue * (isDept ? deptSeed : 42)) % 100) / 100) * 0.8 - 0.4;
    return Number((Math.min(5, Math.max(1, baseValue + offset))).toFixed(2));
  };

  const competenciasArray = Object.keys(indicadores).map(comp => {
    const info = getCompetenceInfo(comp);
    const mediaGeralOriginal = indicadores[comp];
    
    const raterScores = calculateRaterScores(mediaGeralOriginal, colaborador.departamento, comp, matricula, isLideranca);

    return {
      competencia: info.nome,
      descricao: info.descricao,
      mediaGeral: raterScores.mediaGeral,
      mediaDepartamento: getSimulatedAvg(mediaGeralOriginal, true),
      mediaEmpresa: getSimulatedAvg(mediaGeralOriginal, false),
      mediaGestor: raterScores.mediaGestor,
      mediaAuto: raterScores.mediaAuto,
      mediaPares: raterScores.mediaPares,
      mediaSubordinados: raterScores.mediaSubordinados,
      min: Math.max(1, raterScores.mediaGeral - 1),
      max: Math.min(5, raterScores.mediaGeral + 1)
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
    is_lideranca: isLideranca,
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
    const colab = colaboradores.find(c => c.matricula === fb.avaliado_matricula);
    if (!colab) return;

    if (!deptoMap.has(colab.departamento)) {
      deptoMap.set(colab.departamento, { somaGeral: 0, countGeral: 0, somaGap: 0, competencias: new Map() });
    }
    const d = deptoMap.get(colab.departamento)!;

    const indicadores: any = fb.indicadores || {};
    
    let userTotalScore = 0;
    let userCompCount = 0;
    
    Object.keys(indicadores).forEach(comp => {
      const isLideranca = checkIsLideranca(colab.cargo);
      const raterScores = calculateRaterScores(indicadores[comp], colab.departamento, comp, fb.avaliado_matricula, isLideranca);
      const gap = raterScores.mediaGestor - raterScores.mediaAuto;

      userTotalScore += raterScores.mediaGeral;
      userCompCount++;

      if (!d.competencias.has(comp)) {
        d.competencias.set(comp, { somaGap: 0, count: 0 });
      }
      const dc = d.competencias.get(comp)!;
      dc.somaGap += gap;
      dc.count++;
      
      const current = compMap.get(comp) || { soma: 0, count: 0 };
      compMap.set(comp, { soma: current.soma + raterScores.mediaGeral, count: current.count + 1 });
    });

    // Override the DB nota_media with the simulated one
    fb.nota_media = userCompCount > 0 ? Number((userTotalScore / userCompCount).toFixed(2)) : (fb.nota_media || 0);

    totalNotas += fb.nota_media;
    totalPotencial += fb.indice_potencial || 0;
    totalPercentil += fb.percentil_empresa || 0;

    d.somaGeral += fb.nota_media;
    d.countGeral++;
    d.somaGap += fb.gap_gestor_auto || 0;
  });

  const notaMediaGeral = Number((totalNotas / feedbacks.length).toFixed(2));
  const mediaPotencial = Number((totalPotencial / feedbacks.length).toFixed(2)) || Math.min(5, Number((notaMediaGeral * 1.1).toFixed(2)));
  const percentilMedio = Math.floor(totalPercentil / feedbacks.length) || 50;
  const participacaoCiclo = 100;

  const mediasPorCompetencia = Array.from(compMap.entries()).map(([comp, data]) => {
    const info = getCompetenceInfo(comp);
    const mediaAtual = Number((data.soma / data.count).toFixed(2));
    
    // Hash determinístico baseado no nome da competência para não piscar dados a cada reload
    let hash = 0;
    for (let i = 0; i < comp.length; i++) {
      hash = ((hash << 5) - hash) + comp.charCodeAt(i);
    }
    
    // Variância simulada do ciclo anterior (entre -0.4 e +0.6 de crescimento)
    // Se a variação for positiva, a nota anterior era menor.
    const variacao = ((Math.abs(hash) % 100) / 100) * 1.0 - 0.4;
    const mediaAnterior = Number(Math.min(5, Math.max(1, mediaAtual - variacao)).toFixed(2));

    return {
      competencia: info.nome,
      descricao: info.descricao,
      media: mediaAtual,
      mediaAnterior: mediaAnterior
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
