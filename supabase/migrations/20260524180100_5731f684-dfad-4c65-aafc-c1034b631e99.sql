
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_updated_at() FROM PUBLIC, anon, authenticated;
-- has_role precisa ser chamável por policies; policies executam com privilégios do usuário no contexto.
-- Como é SECURITY DEFINER, ao ser usada em policies, o motor não exige EXECUTE para o usuário final.
-- Mas para uso direto via PostgREST, podemos manter authenticated com cautela:
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;
