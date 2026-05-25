-- Fix: hide avaliador_matricula from non-admin/non-RH users to preserve 360° anonymity.
-- Strategy: restrict base table SELECT to admin/RH; expose an anonymized view to other authenticated users.

DROP POLICY IF EXISTS "Authenticated can read avaliacoes" ON public.avaliacoes;

CREATE POLICY "Admin and RH can read avaliacoes"
ON public.avaliacoes
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'rh'::app_role));

-- Anonymized view: exposes evaluation data without revealing the reviewer's identity.
CREATE OR REPLACE VIEW public.avaliacoes_anonimas
WITH (security_invoker = on) AS
SELECT
  id,
  ciclo_id,
  avaliado_matricula,
  competencia,
  nota,
  comentario,
  created_at
FROM public.avaliacoes;

GRANT SELECT ON public.avaliacoes_anonimas TO authenticated;

-- Hardening on user_roles: explicit policies that block self-escalation.
-- The existing "Admins manage roles" ALL policy already restricts writes, but we add
-- explicit per-command policies for clarity and defense-in-depth.
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));