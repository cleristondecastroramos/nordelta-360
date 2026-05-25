
-- Allow anon read on listing tables so dashboard renders without auth
DROP POLICY IF EXISTS "Authenticated can read colaboradores" ON public.colaboradores;
CREATE POLICY "Public can read colaboradores" ON public.colaboradores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated can read feedbacks" ON public.feedbacks_finais;
CREATE POLICY "Public can read feedbacks" ON public.feedbacks_finais FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated can read ciclos" ON public.ciclos_avaliacao;
CREATE POLICY "Public can read ciclos" ON public.ciclos_avaliacao FOR SELECT USING (true);
