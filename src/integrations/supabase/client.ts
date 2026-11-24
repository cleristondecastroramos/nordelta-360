import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// App é uma SPA (Vite): em desenvolvimento as variáveis vêm do .env local;
// no build de produção, do .env.production (valores públicos, versionado).
function createSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    const missing = [
      ...(!url ? ["VITE_SUPABASE_URL"] : []),
      ...(!key ? ["VITE_SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    throw new Error(`[Supabase] Variável(is) de ambiente ausente(s): ${missing.join(", ")}.`);
  }

  // O login do app é de demonstração (sessionStorage); não usamos o Auth do Supabase.
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// Criação preguiçosa: só falha por falta de env quando alguém de fato consulta o banco.
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
