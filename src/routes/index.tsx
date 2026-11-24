import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);

      if (email === "rh@nordelta.com.br" && password === "senha123") {
        sessionStorage.setItem("isAuthenticated", "true");
        toast.success("Acesso autorizado! Bem-vindo ao Nordelta 360°.");
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Credenciais inválidas. Utilize as credenciais de teste fornecidas.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex relative bg-slate-50 dark:bg-slate-950 overflow-hidden selection:bg-primary/20">
      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-50">
        <img
          src="/logo_nordelta_fundo_escuro.png"
          alt="Nordelta 360"
          className="h-20 lg:h-28 drop-shadow-xl transition-all"
        />
      </div>

      {/* Left side - Image & Branding */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent mix-blend-multiply" />

        {/* Background Image */}
        <img
          src="/hero_nordelta_clean.png?v=2"
          alt="Nordelta 360 Background"
          className="absolute inset-0 h-full w-full object-cover object-center animate-in fade-in duration-1000"
        />

        {/* Floating Brand Overlay */}
        <div className="relative z-20 mt-auto p-12 text-white animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <div className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-1 mb-6 backdrop-blur-md border border-white/20">
            <ShieldCheck className="mr-2 h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium tracking-wide">Plataforma Segura</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Gestão de Performance e
            <br />
            <span className="text-cyan-400">Inteligência de Pessoas</span>
          </h1>
          <p className="text-lg text-white/80 max-w-lg leading-relaxed">
            Decisões orientadas por dados para desenvolver talentos e fortalecer equipes.
          </p>

          <div className="mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center text-xs font-medium text-white/60 hover:text-white transition-colors border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm bg-white/5 hover:bg-white/10 cursor-pointer">
                  <Info className="w-3 h-3 mr-1.5" />
                  Case de portfólio
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl p-0 overflow-hidden flex flex-col border-slate-200 dark:border-slate-800 [&>button]:!text-white [&>button]:opacity-100 hover:[&>button]:opacity-80">
                <div className="bg-slate-900 dark:bg-slate-950 p-6 sm:p-8 border-b border-slate-800">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-white">
                      Case de Portfólio — Nordelta 360°
                    </DialogTitle>
                  </DialogHeader>
                </div>
                <div className="p-6 sm:p-8 space-y-5 text-sm text-slate-700 dark:text-slate-300 text-justify overflow-y-auto max-h-[60vh]">
                  <p className="leading-relaxed">
                    Este sistema foi desenvolvido como um{" "}
                    <strong>case autoral e estratégico de portfólio</strong> por{" "}
                    <strong>Clériston de Castro Ramos</strong>, com foco na concepção de produtos
                    digitais voltados à gestão de performance, desenvolvimento de talentos e análise
                    de dados em Recursos Humanos.{" "}
                    <strong>
                      Todos os dados são fictícios e foram estruturados intencionalmente para fins
                      demonstrativos.
                    </strong>
                  </p>

                  <section>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      Contexto fictício da Nordelta
                    </h4>
                    <p className="leading-relaxed">
                      A solução foi idealizada para a Nordelta Soluções Corporativas, uma empresa
                      fictícia de tecnologia e serviços corporativos. O cenário simula uma operação
                      com colaboradores distribuídos em departamentos distintos — Tecnologia,
                      Comercial, RH, Financeiro, Operações e Marketing — cada um com um perfil de
                      competências e desempenho propositalmente diferente.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      Base de dados heterogênea e intencional
                    </h4>
                    <p className="leading-relaxed mb-2">
                      A base de dados foi arquitetada para ser analiticamente rica e narrativamente
                      convincente, com dispersão real de notas e diversidade de perfis. O motor de
                      cálculo implementa:
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                      <li>
                        <strong>5 arquétipos de performance:</strong> Top Performer (15%), Acima da
                        Média (25%), Mediano (30%), Em Desenvolvimento (20%) e Baixo Desempenho
                        (10%).
                      </li>
                      <li>
                        <strong>6 perfis de departamento:</strong> cada área tem forças e fraquezas
                        específicas por competência — ex.: Tecnologia é forte em resolução de
                        problemas mas fraca em comunicação; Comercial é o inverso.
                      </li>
                      <li>
                        <strong>5 padrões de divergência entre avaliadores:</strong> Síndrome do
                        Impostor, Dunning-Kruger, Alinhamento Real, Pares Pessimistas e Liderança
                        Controversa — gerando heatmaps e radares com formas genuinamente distintas
                        entre colaboradores.
                      </li>
                      <li>
                        <strong>Inconsistência intencional de competências:</strong> 30% dos
                        colaboradores têm perfis assimétricos, com uma competência muito forte e
                        outra muito fraca.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Tecnologias e arquitetura
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside">
                      <li>
                        <strong>Frontend e interface:</strong> React, TypeScript, Tailwind CSS e
                        shadcn/ui, garantindo uma experiência moderna, responsiva e visualmente
                        consistente.
                      </li>
                      <li>
                        <strong>Navegação:</strong> TanStack Router, permitindo transições fluidas
                        entre dashboards, ficha individual, ciclos e relatórios executivos.
                      </li>
                      <li>
                        <strong>People Analytics:</strong> Recharts para visualizações avançadas,
                        incluindo gráficos de radar, histogramas, heatmaps, área e comparativos por
                        departamento.
                      </li>
                      <li>
                        <strong>Backend simulado:</strong> Supabase como BaaS com dados fictícios
                        enriquecidos por um motor de cálculo em TypeScript puro — sem dependência de
                        dados reais.
                      </li>
                      <li>
                        <strong>Metodologia de produto:</strong> Product Discovery, Design Thinking
                        aplicado ao ciclo do colaborador e boas práticas de Clean Code.
                      </li>
                    </ul>
                  </section>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 xl:p-24 relative">
        {/* Decorative background blobs for light/dark mode */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="w-full max-w-lg space-y-10 relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="flex flex-col items-center text-center space-y-6">
            <img
              src="/logo_nordelta_escuro.png"
              alt="Nordelta 360"
              className="h-24 block dark:hidden self-center"
            />
            <img
              src="/logo_nordelta_fundo_escuro.png"
              alt="Nordelta 360"
              className="h-24 hidden dark:block self-center"
            />

            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Bem-vindo
              </h2>
              <p className="text-muted-foreground text-sm">
                Insira suas credenciais corporativas para acessar o painel executivo.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300"
                  htmlFor="email"
                >
                  Email Corporativo
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@nordelta.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/30 transition-shadow"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300"
                    htmlFor="password"
                  >
                    Senha
                  </label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/30 transition-shadow"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end w-full">
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 text-xs cursor-pointer mb-2"
                title="Exibir credenciais de teste"
              >
                <Info className="h-3.5 w-3.5" />
                <span>Credenciais de acesso</span>
              </button>

              {showCredentials && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-md p-3 flex gap-3 text-sm text-blue-800 dark:text-blue-300 w-full animate-in fade-in zoom-in-95 duration-200 text-left">
                  <Info className="h-5 w-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-semibold mb-1">Acesso de Demonstração (Portfólio)</p>
                    <p>
                      E-mail:{" "}
                      <strong className="select-all font-mono font-normal">
                        rh@nordelta.com.br
                      </strong>
                    </p>
                    <p>
                      Senha: <strong className="select-all font-mono font-normal">senha123</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium group transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                  Autenticando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Acessar Plataforma
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="flex justify-center mt-4 pt-2 w-full">
            <a
              href="#"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Esqueceu a senha?
            </a>
          </div>

          <div className="text-center text-sm text-muted-foreground space-y-2 pt-6">
            <div>
              Acesso restrito para colaboradores autorizados.{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="underline underline-offset-4 hover:text-primary transition-colors cursor-pointer">
                    Política de Privacidade
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col border-slate-200 dark:border-slate-800 [&>button]:!text-white [&>button]:opacity-100 hover:[&>button]:opacity-80">
                  <div className="bg-slate-900 dark:bg-slate-950 p-6 sm:p-8 border-b border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-white">
                        Política de Privacidade
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Sistema de Avaliação de Desempenho 360° - Grupo Nordelta
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 text-justify overflow-y-auto">
                    <section>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                        1. Objetivo
                      </h3>
                      <p className="leading-relaxed">
                        Esta Política de Privacidade descreve como o Grupo Nordelta coleta, utiliza,
                        armazena e protege os dados pessoais e profissionais dos colaboradores no
                        contexto do Sistema de Avaliação de Desempenho 360°.
                      </p>
                    </section>

                    <section>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                        2. Coleta de Dados
                      </h3>
                      <p className="leading-relaxed">
                        Coletamos informações profissionais, metas, autoavaliações e avaliações
                        realizadas por pares, líderes e liderados. Estes dados são essenciais para o
                        mapeamento de competências e desenvolvimento contínuo (People Analytics).
                      </p>
                    </section>

                    <section>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                        3. Uso das Informações
                      </h3>
                      <p className="leading-relaxed">
                        As informações consolidadas são estritamente utilizadas para fins de gestão
                        de talentos, feedbacks construtivos, elaboração de Planos de Desenvolvimento
                        Individual (PDIs) e decisões estratégicas de RH, garantindo a
                        confidencialidade das avaliações anônimas.
                      </p>
                    </section>

                    <section>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                        4. Segurança e LGPD
                      </h3>
                      <p className="leading-relaxed">
                        Todos os dados são criptografados e armazenados em servidores seguros, com
                        acesso restrito apenas aos gestores autorizados e à equipe de Recursos
                        Humanos, em total conformidade com a Lei Geral de Proteção de Dados (LGPD).
                      </p>
                    </section>

                    <section>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                        5. Direitos do Colaborador
                      </h3>
                      <p className="leading-relaxed">
                        Você tem o direito de acessar seus resultados finais, solicitar
                        esclarecimentos sobre o processo de avaliação e atualizar suas informações
                        cadastrais junto ao setor de RH.
                      </p>
                    </section>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-xs opacity-70 whitespace-nowrap overflow-hidden text-ellipsis">
              © 2026 Grupo Nordelta Soluções Coorporativas | Sistema de Avaliação de Desempenho
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
