import Papa from "papaparse";
import type { Colaborador, Avaliacao360, ColaboradorResultados, CompetenciaScore, DashboardMetrics } from "./types";

// Função para normalizar chaves do CSV (lidar com variações de nomes de colunas)
function normalizeKeys(obj: any): any {
  const normalized: any = {};
  for (const key in obj) {
    const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Fallbacks para perfis
    if (cleanKey.includes('matricula') || cleanKey === 'id') normalized.matricula = obj[key];
    else if (cleanKey.includes('nome')) normalized.nome = obj[key];
    else if (cleanKey.includes('cargo')) normalized.cargo = obj[key];
    else if (cleanKey.includes('departamento') || cleanKey.includes('area')) normalized.departamento = obj[key];
    else if (cleanKey.includes('estado') || cleanKey.includes('status')) normalized.estado = obj[key] || 'Ativo';
    else if (cleanKey.includes('foto') || cleanKey.includes('imagem')) normalized.foto_url = obj[key] || '/placeholder.svg';
    else if (cleanKey.includes('email')) normalized.email = obj[key];
    else if (cleanKey.includes('telefone') || cleanKey.includes('celular')) normalized.telefone = obj[key];
    
    // Fallbacks para avaliações
    else if (cleanKey.includes('ciclo')) normalized.ciclo = obj[key];
    else if (cleanKey.includes('tipoavaliador') || cleanKey.includes('relacao')) normalized.tipo_avaliador = obj[key];
    else if (cleanKey.includes('avaliadorid') || cleanKey.includes('idavaliador')) normalized.avaliador_id = obj[key];
    else if (cleanKey.includes('competencia') || cleanKey.includes('habilidade')) normalized.competencia = obj[key];
    else if (cleanKey.includes('nota') || cleanKey.includes('score')) normalized.nota = obj[key];
    else if (cleanKey.includes('comentario') || cleanKey.includes('feedback')) normalized.comentario = obj[key];
    else normalized[key] = obj[key];
  }

  // Preenchimentos padrão de fallback extremo
  if (!normalized.foto_url) normalized.foto_url = '/placeholder.svg';
  if (!normalized.estado) normalized.estado = 'Ativo';
  
  return normalized;
}

// Função genérica para carregar CSV da pasta public
async function fetchAndParseCSV<T>(url: string): Promise<T[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Falha HTTP: ${response.status}`);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn(`Avisos ao parsear ${url}:`, results.errors);
          }
          // Filtra linhas totalmente vazias ou sem matricula
          const validData = results.data
            .map(normalizeKeys)
            .filter((row: any) => row.matricula && row.matricula.trim() !== "");
          resolve(validData as T[]);
        },
        error: (error: any) => {
          console.error(`Erro fatal no parse de ${url}:`, error);
          resolve([]); // Fallback para array vazio em vez de reject
        },
      });
    });
  } catch (error) {
    console.error(`Falha ao buscar CSV ${url}:`, error);
    return [];
  }
}

// Data store temporário em memória para evitar requests repetitivos no cliente
let colaboradoresCache: Colaborador[] | null = null;
let avaliacoesCache: Avaliacao360[] | null = null;

export async function loadDados() {
  if (colaboradoresCache && avaliacoesCache) {
    return { colaboradores: colaboradoresCache, avaliacoes: avaliacoesCache };
  }

  const [cols, avs] = await Promise.all([
    fetchAndParseCSV<Colaborador>("/data/data_profiles_applied.csv"),
    fetchAndParseCSV<any>("/data/evaluations_360.csv"),
  ]);

  colaboradoresCache = cols;
  
  avaliacoesCache = avs.map((a) => {
    let notaParsed = parseFloat(a.nota);
    if (isNaN(notaParsed)) notaParsed = 0;
    return {
      ...a,
      nota: notaParsed,
    };
  });

  return { colaboradores: colaboradoresCache, avaliacoes: avaliacoesCache };
}

// --- Funções de Cálculo e Agregação ---

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { colaboradores, avaliacoes } = await loadDados();

  if (colaboradores.length === 0 || avaliacoes.length === 0) {
    return {
      totalColaboradores: 0, notaMediaGeral: 0, mediaPotencial: 0, totalDepartamentos: 0,
      totalCompetencias: 0, participacaoCiclo: 0, percentilMedio: 0, mediasPorCompetencia: [],
      departamentos: [], ranking: [], alertas: [], insights: [], gapHeatmap: [], distribuicaoNotas: []
    };
  }

  const totalColaboradores = colaboradores.length;
  const departamentosSet = new Set(colaboradores.map((c) => c.departamento));
  const totalDepartamentos = departamentosSet.size;

  const competencias = new Set(avaliacoes.map((a) => a.competencia));
  const totalCompetencias = competencias.size;

  const totalNotas = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
  const notaMediaGeral = Number((totalNotas / avaliacoes.length).toFixed(2));
  
  // Dummy calculations for demo purposes
  const mediaPotencial = Math.min(5, Number((notaMediaGeral * 1.1).toFixed(2)));
  const participacaoCiclo = 92; 
  const percentilMedio = 85;

  // Médias por Competência (Global)
  const compMap = new Map<string, { soma: number; count: number }>();
  avaliacoes.forEach((a) => {
    const current = compMap.get(a.competencia) || { soma: 0, count: 0 };
    compMap.set(a.competencia, { soma: current.soma + a.nota, count: current.count + 1 });
  });
  const mediasPorCompetencia = Array.from(compMap.entries()).map(([comp, data]) => ({
    competencia: comp,
    media: Number((data.soma / data.count).toFixed(2)),
    mediaAnterior: Number(((data.soma / data.count) - (Math.random() * 0.4)).toFixed(2)) // Simulating past cycle
  })).sort((a, b) => b.media - a.media);

  // Análise por Departamento
  const deptoMap = new Map<string, { 
    somaGeral: number; countGeral: number;
    somaGestor: number; countGestor: number;
    somaAuto: number; countAuto: number;
    competencias: Map<string, {somaGestor: number; countGestor: number; somaAuto: number; countAuto: number}>
  }>();

  avaliacoes.forEach((a) => {
    const colab = colaboradores.find((c) => c.matricula === a.matricula);
    if (!colab) return;
    
    if (!deptoMap.has(colab.departamento)) {
      deptoMap.set(colab.departamento, {
        somaGeral: 0, countGeral: 0, somaGestor: 0, countGestor: 0, somaAuto: 0, countAuto: 0,
        competencias: new Map()
      });
    }
    const d = deptoMap.get(colab.departamento)!;
    d.somaGeral += a.nota; d.countGeral++;
    
    if (!d.competencias.has(a.competencia)) {
      d.competencias.set(a.competencia, { somaGestor: 0, countGestor: 0, somaAuto: 0, countAuto: 0 });
    }
    const dc = d.competencias.get(a.competencia)!;

    if (a.tipo_avaliador === "Gestor") {
      d.somaGestor += a.nota; d.countGestor++;
      dc.somaGestor += a.nota; dc.countGestor++;
    } else if (a.tipo_avaliador === "Autoavaliação") {
      d.somaAuto += a.nota; d.countAuto++;
      dc.somaAuto += a.nota; dc.countAuto++;
    }
  });

  const departamentos: DepartmentStats[] = [];
  const gapHeatmap: GapAnalysis[] = [];

  deptoMap.forEach((data, depto) => {
    const mediaGestor = data.countGestor > 0 ? data.somaGestor / data.countGestor : 0;
    const mediaAuto = data.countAuto > 0 ? data.somaAuto / data.countAuto : 0;
    const media = data.countGeral > 0 ? data.somaGeral / data.countGeral : 0;
    
    departamentos.push({
      departamento: depto,
      media: Number(media.toFixed(2)),
      potencial: Math.min(5, Number((media * 1.15).toFixed(2))),
      participacao: Math.floor(80 + Math.random() * 20),
      gapMedio: Number((mediaGestor - mediaAuto).toFixed(2))
    });

    data.competencias.forEach((cData, comp) => {
      const mG = cData.countGestor > 0 ? cData.somaGestor / cData.countGestor : media;
      const mA = cData.countAuto > 0 ? cData.somaAuto / cData.countAuto : media;
      gapHeatmap.push({
        departamento: depto,
        competencia: comp,
        gap: Number((mG - mA).toFixed(2))
      });
    });
  });

  departamentos.sort((a, b) => b.media - a.media);

  // Ranking
  const rankingMap = new Map<string, { nome: string; soma: number; count: number }>();
  avaliacoes.forEach((a) => {
    const colab = colaboradores.find((c) => c.matricula === a.matricula);
    if (colab) {
      const current = rankingMap.get(colab.matricula) || { nome: colab.nome, soma: 0, count: 0 };
      rankingMap.set(colab.matricula, { nome: colab.nome, soma: current.soma + a.nota, count: current.count + 1 });
    }
  });
  
  const ranking = Array.from(rankingMap.entries())
    .map(([matricula, data]) => {
      const nota = Number((data.soma / data.count).toFixed(2));
      return {
        matricula,
        nome: data.nome,
        nota,
        potencial: Math.min(5, Number((nota * 1.2).toFixed(2))),
        percentil: Math.floor(Math.min(99, nota * 20))
      };
    })
    .sort((a, b) => b.nota - a.nota);

  // Distribuição de notas (Histogram)
  const buckets = { "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0 };
  ranking.forEach(r => {
    if (r.nota <= 2) buckets["1-2"]++;
    else if (r.nota <= 3) buckets["2-3"]++;
    else if (r.nota <= 4) buckets["3-4"]++;
    else buckets["4-5"]++;
  });
  const distribuicaoNotas = Object.entries(buckets).map(([range, quantidade]) => ({ range, quantidade }));

  // Insights Dinâmicos
  const topDepto = departamentos[0];
  const bottomDepto = departamentos[departamentos.length - 1];
  const highGapDepto = [...departamentos].sort((a,b) => Math.abs(b.gapMedio) - Math.abs(a.gapMedio))[0];

  const insights: InsightText[] = [
    { tipo: "success", texto: `O departamento **${topDepto.departamento}** apresenta a maior média geral (${topDepto.media}) com forte consistência técnica.` },
    { tipo: "warning", texto: `Atenção ao gap de autopercepção no **${highGapDepto.departamento}**. A diferença entre a visão do gestor e a autoavaliação é de ${highGapDepto.gapMedio > 0 ? '+' : ''}${highGapDepto.gapMedio}.` },
    { tipo: "info", texto: `A competência com maior margem de desenvolvimento global é **${mediasPorCompetencia[mediasPorCompetencia.length - 1].competencia}**.` }
  ];

  const alertas = [
    `Participação do ciclo em ${participacaoCiclo}%, faltam ${100 - participacaoCiclo}% para conclusão.`,
    `Gap de percepção alto detectado em ${highGapDepto.departamento}.`
  ];

  return {
    totalColaboradores, notaMediaGeral, mediaPotencial, totalDepartamentos,
    totalCompetencias, participacaoCiclo, percentilMedio, mediasPorCompetencia,
    departamentos, ranking: ranking.slice(0, 10), alertas, insights, gapHeatmap, distribuicaoNotas
  };
}

export async function getColaboradoresList() {
  const { colaboradores, avaliacoes } = await loadDados();
  
  return colaboradores.map(c => {
    const avs = avaliacoes.filter(a => a.matricula === c.matricula);
    const mediaGeral = avs.length > 0 ? avs.reduce((sum, a) => sum + a.nota, 0) / avs.length : 0;
    return {
      ...c,
      notaMediaGeral: Number(mediaGeral.toFixed(2)),
    };
  });
}

export async function getColaboradorResultados(matricula: string): Promise<ColaboradorResultados | null> {
  const { colaboradores, avaliacoes } = await loadDados();
  
  const colaborador = colaboradores.find(c => c.matricula === matricula);
  if (!colaborador) return null;

  const minhasAvaliacoes = avaliacoes.filter(a => a.matricula === matricula);
  
  if (minhasAvaliacoes.length === 0) {
    return {
        colaborador, notaMediaGeral: 0, gapGestorAuto: 0, indicePotencial: 0, percentil: 0,
        competencias: [], comentariosAnonimizados: [], historicoCiclos: []
    };
  }

  // Media Geral
  const notaMediaGeral = minhasAvaliacoes.reduce((sum, a) => sum + a.nota, 0) / minhasAvaliacoes.length;

  // Calculo de Competências
  const compMap = new Map<string, Avaliacao360[]>();
  minhasAvaliacoes.forEach(a => {
    if (!compMap.has(a.competencia)) compMap.set(a.competencia, []);
    compMap.get(a.competencia)!.push(a);
  });

  const competencias: CompetenciaScore[] = Array.from(compMap.entries()).map(([comp, avs]) => {
    const getMedia = (tipo: string) => {
        const filtered = avs.filter(a => a.tipo_avaliador === tipo);
        return filtered.length > 0 ? filtered.reduce((s, a) => s + a.nota, 0) / filtered.length : 0;
    };

    const notas = avs.map(a => a.nota);
    return {
      competencia: comp,
      mediaGeral: Number((notas.reduce((s, n) => s + n, 0) / notas.length).toFixed(2)),
      mediaAuto: getMedia("Autoavaliação"),
      mediaGestor: getMedia("Gestor"),
      mediaPares: getMedia("Par"),
      mediaSubordinados: getMedia("Subordinado"),
      min: Math.min(...notas),
      max: Math.max(...notas),
      distribuicao: [
        { nota: 1, quantidade: notas.filter(n => Math.round(n) === 1).length },
        { nota: 2, quantidade: notas.filter(n => Math.round(n) === 2).length },
        { nota: 3, quantidade: notas.filter(n => Math.round(n) === 3).length },
        { nota: 4, quantidade: notas.filter(n => Math.round(n) === 4).length },
        { nota: 5, quantidade: notas.filter(n => Math.round(n) === 5).length },
      ]
    };
  });

  // Gap Gestor x Auto (Média de todas as competências)
  const mediaAutoAv = competencias.reduce((s, c) => s + c.mediaAuto, 0) / competencias.filter(c=>c.mediaAuto > 0).length || 0;
  const mediaGestorAv = competencias.reduce((s, c) => s + c.mediaGestor, 0) / competencias.filter(c=>c.mediaGestor > 0).length || 0;
  const gapGestorAuto = Number((mediaGestorAv - mediaAutoAv).toFixed(2));

  // Simulação de percentil simples
  const percentil = 85; 

  // Indice de potencial (peso simples para fins de demonstração)
  const indicePotencial = Number((notaMediaGeral * 1.1).toFixed(1)); 

  // Comentarios anonimizados
  const comentariosAnonimizados = minhasAvaliacoes
    .filter(a => a.comentario && a.comentario.trim() !== "" && a.tipo_avaliador !== "Autoavaliação")
    .map(a => ({ tipo_avaliador: a.tipo_avaliador, comentario: a.comentario! }));

  // Geração de histórico simulado (baseado na nota atual para ser realista)
  const historicoCiclos = [
    { ciclo: "Ciclo 2024.1", mediaGeral: Number((Math.max(1, notaMediaGeral - 0.4)).toFixed(2)) },
    { ciclo: "Ciclo 2024.2", mediaGeral: Number((Math.max(1, notaMediaGeral - 0.1)).toFixed(2)) },
    { ciclo: "Ciclo 2025.1", mediaGeral: Number(notaMediaGeral.toFixed(2)) }
  ];

  // Geração de Plano de Desenvolvimento (PDI) baseado nas menores notas
  const pioresCompetencias = [...competencias].sort((a, b) => a.mediaGeral - b.mediaGeral).slice(0, 2);
  const acoesSugestao: Record<string, string> = {
    "Comunicação": "Realizar curso de Comunicação Assertiva e buscar dar/receber feedback em reuniões 1:1.",
    "Liderança": "Assumir a condução de um projeto trimestral para praticar delegação e influência.",
    "Visão Sistêmica": "Agendar shadows com outras áreas para entender o impacto cruzado dos processos.",
    "Trabalho em Equipe": "Fomentar rituais de colaboração e buscar ouvir mais antes de propor soluções.",
    "Inovação": "Sugerir uma melhoria de processo documentada no próximo mês.",
    "Foco em Resultado": "Estabelecer OKRs mensais pessoais para garantir alinhamento com a meta da empresa.",
  };

  const planoDesenvolvimento = pioresCompetencias.map((comp, idx) => ({
    id: `pdi-${idx}`,
    competencia: comp.competencia,
    acaoSugerida: acoesSugestao[comp.competencia] || `Desenvolver plano de ação focado na melhoria prática de ${comp.competencia} no dia a dia.`,
    prioridade: idx === 0 ? "Alta" : "Média" as any,
    prazo: "Próximos 90 dias",
    status: "Não Iniciado" as any,
    responsavel: colaborador.nome.split(" ")[0],
  }));

  return {
    colaborador,
    notaMediaGeral: Number(notaMediaGeral.toFixed(2)),
    gapGestorAuto,
    indicePotencial: Math.min(5, indicePotencial),
    percentil,
    competencias,
    comentariosAnonimizados,
    historicoCiclos,
    planoDesenvolvimento
  };
}
