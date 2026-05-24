
WITH ciclo AS (SELECT ciclo_id FROM public.ciclos_avaliacao WHERE nome='Importado CSV' LIMIT 1),
notes AS (
  SELECT a.*, c_eval.cargo AS cargo_avaliador, c_eval.departamento AS dep_avaliador,
         c_avd.cargo AS cargo_avaliado, c_avd.departamento AS dep_avaliado
  FROM public.avaliacoes a
  JOIN public.colaboradores c_eval ON c_eval.matricula = a.avaliador_matricula
  JOIN public.colaboradores c_avd ON c_avd.matricula = a.avaliado_matricula
  WHERE a.ciclo_id = (SELECT ciclo_id FROM ciclo) AND a.nota IS NOT NULL
),
classified AS (
  SELECT *,
    CASE
      WHEN avaliador_matricula = avaliado_matricula THEN 'auto'
      WHEN cargo_avaliador ~* '(Gerente|Coordenador|Supervisor|Executivo|Diretor|Líder|Lider|Chefe|Head)'
           AND dep_avaliador = dep_avaliado THEN 'gestor'
      WHEN cargo_avaliado ~* '(Gerente|Coordenador|Supervisor|Executivo|Diretor|Líder|Lider|Chefe|Head)'
           AND dep_avaliador = dep_avaliado THEN 'subordinado'
      ELSE 'pares'
    END AS rgroup
  FROM notes
),
per_comp AS (SELECT avaliado_matricula, competencia, avg(nota)::numeric(10,2) AS media FROM classified GROUP BY avaliado_matricula, competencia),
per_group AS (SELECT avaliado_matricula, rgroup, count(*) AS n, avg(nota)::numeric(10,2) AS media FROM classified GROUP BY avaliado_matricula, rgroup),
agg_comp AS (SELECT avaliado_matricula, jsonb_object_agg(competencia, media) AS indicadores, avg(media)::numeric(10,2) AS nota_media FROM per_comp GROUP BY avaliado_matricula),
agg_group AS (
  SELECT avaliado_matricula, jsonb_object_agg(rgroup, jsonb_build_object('n', n, 'mean', media)) AS rater_breakdown,
    max(CASE WHEN rgroup='gestor' THEN media END) AS m_gestor,
    max(CASE WHEN rgroup='auto' THEN media END) AS m_auto
  FROM per_group GROUP BY avaliado_matricula
),
potencial AS (
  SELECT a.avaliado_matricula,
    (COALESCE((a.indicadores->>'resp_lideranca')::numeric,0)*0.4
   + COALESCE((a.indicadores->>'resp_iniciativa')::numeric,0)*0.3
   + COALESCE((a.indicadores->>'resp_desenvolvimento')::numeric,0)*0.3)::numeric(10,2) AS indice_potencial
  FROM agg_comp a
),
ranked AS (SELECT avaliado_matricula, nota_media, percent_rank() OVER (ORDER BY nota_media) * 100 AS percentil FROM agg_comp)
INSERT INTO public.feedbacks_finais (ciclo_id, avaliado_matricula, indicadores, nota_media, percentil_empresa, gap_gestor_auto, indice_potencial, rater_breakdown)
SELECT (SELECT ciclo_id FROM ciclo), a.avaliado_matricula, a.indicadores, a.nota_media,
       round(r.percentil::numeric, 1), (g.m_gestor - g.m_auto), p.indice_potencial, g.rater_breakdown
FROM agg_comp a
JOIN ranked r ON r.avaliado_matricula = a.avaliado_matricula
JOIN agg_group g ON g.avaliado_matricula = a.avaliado_matricula
JOIN potencial p ON p.avaliado_matricula = a.avaliado_matricula
ON CONFLICT (ciclo_id, avaliado_matricula) DO UPDATE SET
  indicadores = EXCLUDED.indicadores, nota_media = EXCLUDED.nota_media,
  percentil_empresa = EXCLUDED.percentil_empresa, gap_gestor_auto = EXCLUDED.gap_gestor_auto,
  indice_potencial = EXCLUDED.indice_potencial, rater_breakdown = EXCLUDED.rater_breakdown;

UPDATE public.colaboradores c SET
  resp_competencia_tecnica = (f.indicadores->>'resp_competencia_tecnica')::numeric,
  resp_qualidade_trabalho = (f.indicadores->>'resp_qualidade_trabalho')::numeric,
  resp_produtividade = (f.indicadores->>'resp_produtividade')::numeric,
  resp_trabalho_em_equipe = (f.indicadores->>'resp_trabalho_em_equipe')::numeric,
  resp_comunicacao = (f.indicadores->>'resp_comunicacao')::numeric,
  resp_lideranca = (f.indicadores->>'resp_lideranca')::numeric,
  resp_iniciativa = (f.indicadores->>'resp_iniciativa')::numeric,
  resp_resolucao_problemas = (f.indicadores->>'resp_resolucao_problemas')::numeric,
  resp_orientacao_cliente = (f.indicadores->>'resp_orientacao_cliente')::numeric,
  resp_etica = (f.indicadores->>'resp_etica')::numeric,
  resp_adaptacao = (f.indicadores->>'resp_adaptacao')::numeric,
  resp_desenvolvimento = (f.indicadores->>'resp_desenvolvimento')::numeric
FROM public.feedbacks_finais f
WHERE f.avaliado_matricula = c.matricula;
