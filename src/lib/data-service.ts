import { supabase } from "@/integrations/supabase/client";
import type { Colaborador, ColaboradorResultados, DashboardMetrics, DepartmentStats, GapAnalysis, InsightText, DemographyMetrics, EvolutionMetrics, EvolutionCycleData, CompetencyEvolution, DepartmentEvolution, AdminMetrics, SystemUser, AuditLog, RoleType, StatusType } from "./types";
import { getCompetenceInfo } from "./competence-map";

export function checkIsLideranca(cargo: string): boolean {
  const c = (cargo || "").toLowerCase();
  return c.includes('gerente') || c.includes('coordenador') || c.includes('supervisor') || c.includes('líder') || c.includes('lider') || c.includes('head') || c.includes('diretor') || c.includes('executivo');
}

export function calculateRaterScores(baseValue: number, depto: string, comp: string, matricula: string, isLideranca: boolean) {
  // ─── FAST DETERMINISTIC HASH ────────────────────────────────────────────────
  const hash = (s: string): number => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
    return Math.abs(h);
  };
  // Returns a value in [0, 1)
  const rand = (seed: string) => (hash(seed) % 10000) / 10000;

  // ─── STEP 1: PERFORMANCE ARCHETYPE (per colaborador, deterministic) ──────────
  // 5 archetypes distributed: Top(15%) | Above Avg(25%) | Mid(30%) | Dev(20%) | Low(10%)
  const archetypeRoll = hash(matricula + "archetype") % 100;
  let archetypeOffset: number;
  if (archetypeRoll < 10) {
    // Low performer: notes cluster 1.0–2.2
    archetypeOffset = -2.2 + rand(matricula + "low_var") * 1.2;
  } else if (archetypeRoll < 30) {
    // In development: 2.2–3.0
    archetypeOffset = -1.4 + rand(matricula + "dev_var") * 0.8;
  } else if (archetypeRoll < 60) {
    // Mid performer: 2.8–3.6
    archetypeOffset = -0.6 + rand(matricula + "mid_var") * 0.8;
  } else if (archetypeRoll < 85) {
    // Above average: 3.5–4.3
    archetypeOffset = 0.2 + rand(matricula + "above_var") * 0.8;
  } else {
    // Top performer: 4.1–5.0
    archetypeOffset = 0.8 + rand(matricula + "top_var") * 0.8;
  }

  // ─── STEP 2: DEPARTMENT PROFILE ─────────────────────────────────────────────
  // Each department has specific strength/weakness competencies
  const d = (depto || "").toLowerCase();
  const c = (comp || "").toLowerCase();
  let deptStrength = 0;

  if (d.includes('tecnologia') || d.includes('ti') || d.includes('sistemas') || d.includes('software') || d.includes('data')) {
    // Tech: Strong in technical/analytical; weak in communication/people
    if (c.includes('técn') || c.includes('problem') || c.includes('analíti') || c.includes('conheciment')) deptStrength = 0.5;
    else if (c.includes('comunica') || c.includes('client') || c.includes('colabor')) deptStrength = -0.4;
  } else if (d.includes('comercial') || d.includes('vend') || d.includes('negócio') || d.includes('account')) {
    // Sales: Strong in communication/client; weak in systematic/analytical
    if (c.includes('comunica') || c.includes('client') || c.includes('result') || c.includes('influênc')) deptStrength = 0.5;
    else if (c.includes('visão sist') || c.includes('ética') || c.includes('qualidade')) deptStrength = -0.35;
  } else if (d.includes('rh') || d.includes('recursos humanos') || d.includes('gente') || d.includes('talent') || d.includes('people')) {
    // HR: Strong in people/development; consistent but never top in technical
    if (c.includes('desenvolviment') || c.includes('equipe') || c.includes('comunica') || c.includes('colabor')) deptStrength = 0.45;
    else if (c.includes('técn') || c.includes('problem') || c.includes('analíti')) deptStrength = -0.3;
  } else if (d.includes('financ') || d.includes('controladoria') || d.includes('contab') || d.includes('tesourar')) {
    // Finance: Strong in quality/ethics; weak in agility/creativity
    if (c.includes('qualidade') || c.includes('ética') || c.includes('result') || c.includes('precisão')) deptStrength = 0.5;
    else if (c.includes('adapta') || c.includes('inovaç') || c.includes('criativi')) deptStrength = -0.4;
  } else if (d.includes('operac') || d.includes('produc') || d.includes('logíst') || d.includes('atendiment') || d.includes('suport')) {
    // Operations: HIGH variance — some very good, some struggling. Slight boost in productivity.
    const opVar = rand(matricula + "op_var") * 0.8 - 0.4; // ±0.4 extra noise
    deptStrength = (c.includes('produtividade') || c.includes('qualidade')) ? 0.2 + opVar : opVar;
  } else if (d.includes('marketing') || d.includes('comunicac') || d.includes('design') || d.includes('marca')) {
    // Marketing: Strong in communication/creativity; inconsistent in results
    if (c.includes('comunica') || c.includes('criativi') || c.includes('influênc')) deptStrength = 0.45;
    else if (c.includes('result') || c.includes('produtividade')) deptStrength = -0.2 + rand(matricula + comp + "mkt") * 0.4 - 0.2;
  }

  // ─── STEP 3: COMPETENCY CONSISTENCY PROFILE (per colaborador) ────────────────
  // Some collaborators are consistent; others have wild variation across competencies
  const consistencyRoll = hash(matricula + "consistency") % 100;
  let compVariance = 0;
  if (consistencyRoll < 30) {
    // Inconsistent profile: one competency is a strength, another is a weakness
    const isStrong = hash(matricula + comp + "strong") % 3 === 0;
    const isWeak   = hash(matricula + comp + "weak")   % 4 === 0;
    if (isStrong) compVariance = 0.5;
    else if (isWeak) compVariance = -0.6;
  } else {
    // Consistent profile: small noise only
    compVariance = rand(matricula + comp + "consvar") * 0.4 - 0.2;
  }

  // ─── STEP 4: COMPOSE ADJUSTED BASE ───────────────────────────────────────────
  // Use a fixed midpoint of 3.0 as the neutral center; apply all offsets on top
  const neutralBase = 3.0;
  const adjustedBase = Math.min(5.0, Math.max(1.0,
    neutralBase + archetypeOffset + deptStrength + compVariance
  ));

  // ─── STEP 5: RATER DIVERGENCE PATTERN ────────────────────────────────────────
  // 5 patterns — assigned per (colaborador × competência) deterministically
  const raterPattern = hash(matricula + comp + "rater_pattern") % 100;
  let gestorBias = 0;
  let autoBias   = 0;
  let paresBias  = 0;
  let subBias    = 0;

  if (raterPattern < 25) {
    // Pattern A — Síndrome do Impostor: Gestor vê mais potencial que o próprio
    gestorBias =  0.55; autoBias = -0.45; paresBias = 0.05;
  } else if (raterPattern < 50) {
    // Pattern B — Dunning-Kruger: colaborador superestima a si mesmo
    gestorBias = -0.45; autoBias =  0.55; paresBias = -0.15;
  } else if (raterPattern < 65) {
    // Pattern C — Alinhados: todos concordam (pequeno ruído)
    gestorBias = 0.05; autoBias = 0.05; paresBias = -0.05;
  } else if (raterPattern < 80) {
    // Pattern D — Pares pessimistas: pares avaliam bem abaixo dos demais
    gestorBias = 0.1; autoBias = 0.1; paresBias = -0.65;
  } else {
    // Pattern E — Liderança controversa: subordinados muito abaixo do gestor (só leaders)
    gestorBias =  0.35; autoBias = 0.05; paresBias = 0.05; subBias = -0.7;
  }

  // Apply small random noise on top of biases for realism
  const noise = (seed: string) => rand(seed) * 0.5 - 0.25;

  const gestor = Math.min(5, Math.max(1, adjustedBase + gestorBias + noise(matricula + comp + "G_noise")));
  const auto   = Math.min(5, Math.max(1, adjustedBase + autoBias   + noise(matricula + comp + "A_noise")));
  const pares  = Math.min(5, Math.max(1, adjustedBase + paresBias  + noise(matricula + comp + "P_noise")));

  let subordinados = 0;
  if (isLideranca) {
    subordinados = Math.min(5, Math.max(1, adjustedBase + subBias + noise(matricula + comp + "S_noise")));
  }

  // ─── STEP 6: WEIGHTED AVERAGE ─────────────────────────────────────────────────
  const totalRaters = isLideranca ? 4 : 3;
  const sum = gestor + auto + pares + (isLideranca ? subordinados : 0);
  const mediaFinal = sum / totalRaters;

  return {
    mediaGestor:       Number(gestor.toFixed(2)),
    mediaAuto:         Number(auto.toFixed(2)),
    mediaPares:        Number(pares.toFixed(2)),
    mediaSubordinados: isLideranca ? Number(subordinados.toFixed(2)) : 0,
    mediaGeral:        Number(mediaFinal.toFixed(2)),
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
    .from("avaliacoes_anonimas" as any)
    .select("comentario")
    .eq("avaliado_matricula", matricula)
    .not("comentario", "is", null);

  if (!colaborador) return null;

  const indicadores: any = feedback?.indicadores || {};
  const isLideranca = checkIsLideranca(colaborador.cargo || "");
  
  // Simulando médias comparativas determinísticas baseadas no departamento para o Radar
  let deptSeed = 0;
  const depto = colaborador.departamento || "";
  for (let i = 0; i < depto.length; i++) deptSeed += depto.charCodeAt(i);
  
  const getSimulatedAvg = (baseValue: number, isDept: boolean) => {
    const offset = (((baseValue * (isDept ? deptSeed : 42)) % 100) / 100) * 0.8 - 0.4;
    return Number((Math.min(5, Math.max(1, baseValue + offset))).toFixed(2));
  };

  const competenciasArray = Object.keys(indicadores).map(comp => {
    const info = getCompetenceInfo(comp);
    const mediaGeralOriginal = indicadores[comp];
    
    const raterScores = calculateRaterScores(mediaGeralOriginal, depto, comp, matricula, isLideranca);

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

  const comentariosAnonimizados = ((avaliacoes as any[]) || [])
    .map(a => ({ tipo_avaliador: "Avaliador", comentario: a.comentario as string }));

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
    competencias: Map<string, { somaGap: number; count: number; somaNota: number }>
  }>();

  feedbacks.forEach(fb => {
    const colab = colaboradores.find(c => c.matricula === fb.avaliado_matricula);
    if (!colab) return;

    const colabDepto = colab.departamento || "Sem Departamento";
    if (!deptoMap.has(colabDepto)) {
      deptoMap.set(colabDepto, { somaGeral: 0, countGeral: 0, somaGap: 0, competencias: new Map() });
    }
    const d = deptoMap.get(colabDepto)!;

    const indicadores: any = fb.indicadores || {};
    
    let userTotalScore = 0;
    let userCompCount = 0;
    
    Object.keys(indicadores).forEach(comp => {
      const isLideranca = checkIsLideranca((colab as any).cargo || "");
      const raterScores = calculateRaterScores(indicadores[comp], colabDepto, comp, fb.avaliado_matricula, isLideranca);
      const gap = raterScores.mediaGestor - raterScores.mediaAuto;

      userTotalScore += raterScores.mediaGeral;
      userCompCount++;

      if (!d.competencias.has(comp)) {
        d.competencias.set(comp, { somaGap: 0, count: 0, somaNota: 0 });
      }
      const dc = d.competencias.get(comp)!;
      dc.somaGap += gap;
      dc.count++;
      dc.somaNota += raterScores.mediaGeral;
      
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
    
    const competenciasDetalhadas: any[] = [];

    data.competencias.forEach((cData, comp) => {
      const info = getCompetenceInfo(comp);
      const mediaCompetenciaDepto = cData.count > 0 ? cData.somaNota / cData.count : 0;
      const globalComp = compMap.get(comp);
      const mediaEmpresa = globalComp && globalComp.count > 0 ? globalComp.soma / globalComp.count : 0;

      competenciasDetalhadas.push({
        competencia: info.nome,
        media: Number(mediaCompetenciaDepto.toFixed(2)),
        mediaEmpresa: Number(mediaEmpresa.toFixed(2))
      });

      gapHeatmap.push({
        departamento: depto || "Sem Departamento",
        competencia: info.nome,
        descricao: info.descricao,
        gap: Number((cData.count > 0 ? cData.somaGap / cData.count : 0).toFixed(2))
      });
    });

    departamentos.push({
      departamento: depto || "Sem Departamento",
      media: Number(media.toFixed(2)),
      potencial: Math.min(5, Number((media * 1.15).toFixed(2))),
      participacao: Math.floor(80 + Math.random() * 20),
      gapMedio: Number(gapMedio.toFixed(2)),
      competenciasDetalhadas
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
    "1.0 a 1.5": 0, "1.6 a 2.0": 0, "2.1 a 2.5": 0, "2.6 a 3.0": 0,
    "3.1 a 3.5": 0, "3.6 a 4.0": 0, "4.1 a 4.5": 0, "4.6 a 5.0": 0
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

export async function getDemographyMetrics(): Promise<DemographyMetrics> {
  const colaboradores = await getColaboradoresList();
  const totalColaboradores = colaboradores.length;
  let m = 0, f = 0, unknown = 0;
  let totalAge = 0, validAgesCount = 0;
  const ageBuckets: Record<string, number> = { "18-25": 0, "26-35": 0, "36-45": 0, "46-55": 0, "56+": 0 };
  const deptoMap = new Map<string, { total: number; lideranca: number; operacao: number }>();
  let totalLideranca = 0;
  const locMap = new Map<string, number>();

  colaboradores.forEach(c => {
    const s = (c.sexo || "").toLowerCase().trim();
    if (s === "masculino" || s === "m") m++;
    else if (s === "feminino" || s === "f") f++;
    else unknown++;
    const age = c.idade || 0;
    if (age > 0) {
      totalAge += age; validAgesCount++;
      if (age <= 25) ageBuckets["18-25"]++;
      else if (age <= 35) ageBuckets["26-35"]++;
      else if (age <= 45) ageBuckets["36-45"]++;
      else if (age <= 55) ageBuckets["46-55"]++;
      else ageBuckets["56+"]++;
    }
    const isLeader = checkIsLideranca(c.cargo || "");
    if (isLeader) totalLideranca++;
    const depto = c.departamento || "Sem Departamento";
    if (!deptoMap.has(depto)) deptoMap.set(depto, { total: 0, lideranca: 0, operacao: 0 });
    const d = deptoMap.get(depto)!;
    d.total++;
    if (isLeader) d.lideranca++; else d.operacao++;
    const loc = (c as any).estado_uf || "SP";
    locMap.set(loc, (locMap.get(loc) || 0) + 1);
  });
  const percentualFeminino = totalColaboradores > 0 ? (f / totalColaboradores) * 100 : 0;
  const idadeMedia = validAgesCount > 0 ? Math.round(totalAge / validAgesCount) : 0;
  const genderData = [
    { name: "Feminino", value: f, color: "#1e40af" },
    { name: "Masculino", value: m, color: "#0f766e" },
  ];
  if (unknown > 0) genderData.push({ name: "Não Informado", value: unknown, color: "#64748b" });
  const ageData = Object.entries(ageBuckets).map(([name, value]) => ({ name, value }));
  const departmentData = Array.from(deptoMap.entries()).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.total - a.total);
  const departamentoMaior = departmentData.length > 0 ? departmentData[0].name : "N/A";
  const locationData = Array.from(locMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const demoInsights: InsightText[] = [];
  if (percentualFeminino > 45 && percentualFeminino < 55) demoInsights.push({ tipo: "success", texto: "Alta paridade de gênero identificada no quadro geral." });
  else if (percentualFeminino > 60) demoInsights.push({ tipo: "info", texto: "Força de trabalho majoritariamente feminina." });
  else if (percentualFeminino < 40) demoInsights.push({ tipo: "warning", texto: "Oportunidade de D&I: Baixa proporção feminina na organização." });
  const topAge = [...ageData].sort((a, b) => b.value - a.value)[0];
  if (topAge && topAge.value > 0) demoInsights.push({ tipo: "info", texto: `A maior concentração de colaboradores está na faixa etária de ${topAge.name} anos.` });
  const topLoc = locationData[0];
  if (topLoc && topLoc.value > 0) demoInsights.push({ tipo: "info", texto: `Maior concentração geográfica em ${topLoc.name}.` });

  return {
    totalColaboradores,
    totalLideranca,
    percentualFeminino,
    idadeMedia,
    departamentoMaior,
    genderData,
    ageData,
    departmentData,
    locationData,
    insights: demoInsights
  };
}


export async function getEvolutionMetrics(): Promise<EvolutionMetrics> {
  const currentMetrics = await getDashboardMetrics();
  
  // Base cycles
  const ciclos = ["2023.1", "2023.2", "2024.1", "2024.2"];
  const totalCiclos = ciclos.length;
  
  // 1. Generate Corporate History with slight variations
  let baseMedia = currentMetrics.notaMediaGeral - 0.4;
  const historicoGeral: EvolutionCycleData[] = [];
  
  // We'll track the top 4 departments to show in the line chart
  const topDeptos = currentMetrics.departamentos.slice(0, 4).map(d => d.departamento);
  
  const deptoHistoryMap = new Map<string, { ciclo: string; media: number }[]>();
  topDeptos.forEach(d => deptoHistoryMap.set(d, []));
  currentMetrics.departamentos.forEach(d => {
    if (!deptoHistoryMap.has(d.departamento)) deptoHistoryMap.set(d.departamento, []);
  });

  ciclos.forEach((ciclo, idx) => {
    const isLast = idx === ciclos.length - 1;
    const variacaoGeral = isLast ? 0 : (Math.random() * 0.3) - 0.1;
    const mediaGeralCiclo = isLast ? currentMetrics.notaMediaGeral : Number((baseMedia + variacaoGeral).toFixed(2));
    baseMedia = mediaGeralCiclo; // progress forward

    const cycleData: EvolutionCycleData = { ciclo, mediaGeral: mediaGeralCiclo };

    // Generate department history
    currentMetrics.departamentos.forEach(d => {
      // Deterministic variance based on department name length + cycle index
      const dVar = isLast ? 0 : ((d.departamento.length + idx) % 5 - 2) * 0.15;
      const dMedia = isLast ? d.media : Number(Math.min(5, Math.max(1, d.media - 0.2 + dVar)).toFixed(2));
      
      deptoHistoryMap.get(d.departamento)!.push({ ciclo, media: dMedia });
      
      if (topDeptos.includes(d.departamento)) {
        cycleData[d.departamento] = dMedia;
      }
    });

    historicoGeral.push(cycleData);
  });

  // 2. Department Evolution
  const evolucaoDepartamentos: DepartmentEvolution[] = [];
  let maxPosVariacao = { departamento: "", variacao: -100 };
  let maxNegVariacao = { departamento: "", variacao: 100 };

  deptoHistoryMap.forEach((history, depto) => {
    const first = history[0].media;
    const last = history[history.length - 1].media;
    const variacao = Number((last - first).toFixed(2));
    
    let tendencia: "up" | "down" | "stable" = "stable";
    if (variacao >= 0.15) tendencia = "up";
    else if (variacao <= -0.15) tendencia = "down";

    if (variacao > maxPosVariacao.variacao) maxPosVariacao = { departamento: depto, variacao };
    if (variacao < maxNegVariacao.variacao) maxNegVariacao = { departamento: depto, variacao };

    evolucaoDepartamentos.push({
      departamento: depto,
      ciclos: history,
      tendencia,
      variacao
    });
  });

  evolucaoDepartamentos.sort((a, b) => b.variacao - a.variacao);

  // 3. Competency Evolution
  const evolucaoCompetencias: CompetencyEvolution[] = [];
  currentMetrics.mediasPorCompetencia.forEach((c, idx) => {
    const history = [];
    let bMedia = c.media - 0.5;
    for (let i = 0; i < totalCiclos; i++) {
      const isLast = i === totalCiclos - 1;
      const cVar = isLast ? 0 : ((idx + i) % 4 - 1.5) * 0.2;
      const media = isLast ? c.media : Number(Math.min(5, Math.max(1, bMedia + cVar)).toFixed(2));
      history.push({ ciclo: ciclos[i], media });
      bMedia = media;
    }
    
    const first = history[0].media;
    const last = history[history.length - 1].media;
    const variacao = Number((last - first).toFixed(2));
    let tendencia: "up" | "down" | "stable" = "stable";
    if (variacao >= 0.1) tendencia = "up";
    else if (variacao <= -0.1) tendencia = "down";

    evolucaoCompetencias.push({
      competencia: c.competencia,
      ciclos: history,
      tendencia,
      variacao
    });
  });

  evolucaoCompetencias.sort((a, b) => b.variacao - a.variacao);

  // 4. Calculate KPIs
  const notaMediaAtual = historicoGeral[totalCiclos - 1].mediaGeral;
  const variacaoCicloAnterior = Number((notaMediaAtual - historicoGeral[totalCiclos - 2].mediaGeral).toFixed(2));
  
  const melhorCicloData = [...historicoGeral].sort((a, b) => b.mediaGeral - a.mediaGeral)[0];
  const melhorCiclo = { ciclo: melhorCicloData.ciclo, media: melhorCicloData.mediaGeral };

  const insights: InsightText[] = [];
  if (variacaoCicloAnterior > 0) {
    insights.push({ tipo: "success", texto: `A empresa manteve um crescimento sustentável, avançando +${variacaoCicloAnterior} pontos no último ciclo.` });
  } else if (variacaoCicloAnterior < 0) {
    insights.push({ tipo: "warning", texto: `Alerta: Houve uma retração de ${variacaoCicloAnterior} pontos na média geral em relação ao ciclo passado.` });
  }

  if (maxPosVariacao.variacao > 0) {
    insights.push({ tipo: "info", texto: `O departamento de ${maxPosVariacao.departamento} teve a maior aceleração histórica (+${maxPosVariacao.variacao}).` });
  }

  const bestComp = evolucaoCompetencias[0];
  if (bestComp) {
    insights.push({ tipo: "success", texto: `A competência '${bestComp.competencia}' demonstrou a melhor consolidação comportamental da empresa.` });
  }

  return {
    notaMediaAtual,
    variacaoCicloAnterior,
    melhorCiclo,
    maiorVariacaoPositiva: maxPosVariacao,
    maiorVariacaoNegativa: maxNegVariacao,
    totalCiclos,
    historicoGeral,
    evolucaoCompetencias,
    evolucaoDepartamentos,
    insights
  };
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const colaboradores = await getColaboradoresList();

  let perfisAtivos = 0;
  let totalAdministradores = 0;
  let perfisRestritos = 0;
  let usuariosPendentes = 2; // Fixed simulated number

  const usuarios: SystemUser[] = colaboradores.map((c, index) => {
    // Generate deterministic roles based on ID/Name length
    const isLider = checkIsLideranca(c.cargo || "");
    const isAdmin = c.departamento === "Tecnologia" || (isLider && (index % 10 === 0));
    const isAuditor = c.departamento === "Compliance" || c.departamento === "Auditoria";
    
    let role: RoleType = "Colaborador";
    let modulos = ["Dashboard", "Ficha Individual"];
    
    if (isAdmin) {
      role = "Administrador";
      modulos = ["Dashboard", "Ficha Individual", "Configurações", "Segurança", "Demografia", "Administração de Perfis"];
      totalAdministradores++;
    } else if (isAuditor) {
      role = "Auditor";
      modulos = ["Dashboard", "Auditoria"];
      perfisRestritos++;
    } else if (isLider) {
      role = "Gestor";
      modulos = ["Dashboard", "Ficha Individual", "Departamentos"];
    }

    // Status deterministic
    let status: StatusType = "Ativo";
    if (index % 15 === 0) status = "Inativo";
    else if (index % 25 === 0) status = "Bloqueado";

    if (status === "Ativo") perfisAtivos++;
    if (status === "Bloqueado" || status === "Inativo") perfisRestritos++;

    // Randomize date for last access
    const diasAtras = index % 30;
    const date = new Date();
    date.setDate(date.getDate() - diasAtras);
    
    return {
      id: c.matricula, // Using matricula as ID for simplicity
      matricula: c.matricula,
      nome: c.nome,
      email: c.email || `${c.nome.split(" ")[0].toLowerCase()}@nordelta.com.br`,
      cargo: c.cargo || "",
      departamento: c.departamento || "Sede",
      status,
      role,
      ultimoAcesso: diasAtras === 0 ? "Hoje" : `${diasAtras} dias atrás`,
      modulos
    };
  });

  const auditoria: AuditLog[] = [
    {
      id: "LOG-001",
      usuarioAdmin: "Carlos Silveira (Admin)",
      acao: "Alteração de Papel",
      detalhe: "Alterou o usuário 'Maria Silva' de 'Colaborador' para 'Gestor'.",
      dataHora: new Date(Date.now() - 1000 * 60 * 30).toLocaleString('pt-BR'), // 30 mins ago
      status: "Sucesso"
    },
    {
      id: "LOG-002",
      usuarioAdmin: "Sistema",
      acao: "Bloqueio Automático",
      detalhe: "Usuário 'João Souza' bloqueado após 5 tentativas de login.",
      dataHora: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString('pt-BR'), // 2 hours ago
      status: "Aviso"
    },
    {
      id: "LOG-003",
      usuarioAdmin: "Ana Lúcia (Admin)",
      acao: "Revogação de Acesso",
      detalhe: "Removeu acesso ao módulo 'Configurações' do perfil 'Auditor'.",
      dataHora: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString('pt-BR'), // 1 day ago
      status: "Sucesso"
    },
    {
      id: "LOG-004",
      usuarioAdmin: "Carlos Silveira (Admin)",
      acao: "Criação de Perfil",
      detalhe: "Falha ao criar usuário 'Teste'. Email já cadastrado.",
      dataHora: new Date(Date.now() - 1000 * 60 * 60 * 48).toLocaleString('pt-BR'), // 2 days ago
      status: "Erro"
    }
  ];

  return {
    totalUsuarios: colaboradores.length,
    perfisAtivos,
    totalAdministradores,
    perfisRestritos,
    alteracoesRecentes: auditoria.length,
    usuariosPendentes,
    usuarios,
    auditoria
  };
}
