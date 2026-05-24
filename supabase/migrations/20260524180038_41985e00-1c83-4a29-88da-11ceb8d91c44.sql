
-- Enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'rh', 'gestor', 'colaborador');

-- Tabela de colaboradores
CREATE TABLE public.colaboradores (
  matricula TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  departamento TEXT,
  email TEXT,
  data_nasc DATE,
  data_admissao DATE,
  sexo TEXT,
  idade INT,
  cpf TEXT,
  rg TEXT,
  mae TEXT,
  pai TEXT,
  cep TEXT,
  endereco TEXT,
  numero TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  telefone_fixo TEXT,
  celular TEXT,
  altura NUMERIC,
  peso NUMERIC,
  foto_url TEXT,
  resp_competencia_tecnica NUMERIC,
  resp_qualidade_trabalho NUMERIC,
  resp_produtividade NUMERIC,
  resp_trabalho_em_equipe NUMERIC,
  resp_comunicacao NUMERIC,
  resp_lideranca NUMERIC,
  resp_iniciativa NUMERIC,
  resp_resolucao_problemas NUMERIC,
  resp_orientacao_cliente NUMERIC,
  resp_etica NUMERIC,
  resp_adaptacao NUMERIC,
  resp_desenvolvimento NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_colaboradores_departamento ON public.colaboradores(departamento);
CREATE INDEX idx_colaboradores_cargo ON public.colaboradores(cargo);

-- Ciclos de avaliação
CREATE TABLE public.ciclos_avaliacao (
  ciclo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE,
  data_fim DATE,
  status TEXT NOT NULL DEFAULT 'planejado' CHECK (status IN ('planejado','aberto','fechado')),
  config JSONB NOT NULL DEFAULT '{"anonimato_on": true, "min_pool": 3}'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Avaliações raw (formato longo)
CREATE TABLE public.avaliacoes (
  id BIGSERIAL PRIMARY KEY,
  ciclo_id UUID REFERENCES public.ciclos_avaliacao(ciclo_id) ON DELETE SET NULL,
  avaliado_matricula TEXT NOT NULL REFERENCES public.colaboradores(matricula) ON DELETE CASCADE,
  avaliador_matricula TEXT NOT NULL REFERENCES public.colaboradores(matricula) ON DELETE CASCADE,
  competencia TEXT NOT NULL,
  nota INT,
  comentario TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_avaliacoes_avaliado ON public.avaliacoes(avaliado_matricula);
CREATE INDEX idx_avaliacoes_avaliador ON public.avaliacoes(avaliador_matricula);
CREATE INDEX idx_avaliacoes_ciclo ON public.avaliacoes(ciclo_id);
CREATE INDEX idx_avaliacoes_competencia ON public.avaliacoes(competencia);

-- Feedbacks finais consolidados
CREATE TABLE public.feedbacks_finais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ciclo_id UUID REFERENCES public.ciclos_avaliacao(ciclo_id) ON DELETE CASCADE,
  avaliado_matricula TEXT NOT NULL REFERENCES public.colaboradores(matricula) ON DELETE CASCADE,
  indicadores JSONB NOT NULL DEFAULT '{}'::jsonb,
  nota_media NUMERIC,
  percentil_empresa NUMERIC,
  gap_gestor_auto NUMERIC,
  indice_potencial NUMERIC,
  rater_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ciclo_id, avaliado_matricula)
);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nome TEXT,
  matricula TEXT REFERENCES public.colaboradores(matricula) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Security definer function para checar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger handler para criar profile no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email));
  -- Por padrão, novo usuário recebe role 'colaborador'
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'colaborador');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.tg_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tg_colaboradores_updated BEFORE UPDATE ON public.colaboradores
  FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE TRIGGER tg_ciclos_updated BEFORE UPDATE ON public.ciclos_avaliacao
  FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- Enable RLS
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ciclos_avaliacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks_finais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies: colaboradores
CREATE POLICY "Authenticated can read colaboradores"
  ON public.colaboradores FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "RH and admin can insert colaboradores"
  ON public.colaboradores FOR INSERT
  TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh')
  );

CREATE POLICY "RH and admin can update colaboradores"
  ON public.colaboradores FOR UPDATE
  TO authenticated USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh')
  );

CREATE POLICY "Admin can delete colaboradores"
  ON public.colaboradores FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Policies: ciclos
CREATE POLICY "Authenticated can read ciclos"
  ON public.ciclos_avaliacao FOR SELECT TO authenticated USING (true);
CREATE POLICY "RH and admin can manage ciclos"
  ON public.ciclos_avaliacao FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'));

-- Policies: avaliacoes
CREATE POLICY "Authenticated can read avaliacoes"
  ON public.avaliacoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "RH and admin can manage avaliacoes"
  ON public.avaliacoes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'));

-- Policies: feedbacks_finais
CREATE POLICY "Authenticated can read feedbacks"
  ON public.feedbacks_finais FOR SELECT TO authenticated USING (true);
CREATE POLICY "RH and admin can manage feedbacks"
  ON public.feedbacks_finais FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'));

-- Policies: profiles
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'rh'));
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Policies: user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
