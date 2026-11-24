import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Book,
  HelpCircle,
  MessageSquare,
  Phone,
  Ticket,
  ArrowRight,
  LifeBuoy,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/ajuda")({
  component: AjudaPage,
});

function AjudaPage() {
  const [ticketStatus, setTicketStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketStatus("submitting");
    setTimeout(() => {
      setTicketStatus("success");
      toast.success("Chamado aberto com sucesso! Número do ticket: #TK-8492");
      setTimeout(() => setTicketStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-700 relative w-full">
      {/* HERO / SEARCH SECTION */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 md:p-16 border border-primary/10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <LifeBuoy className="w-64 h-64 text-primary" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow">
            Central de Suporte 24/7
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Como podemos ajudar?
          </h1>
          <p className="text-lg text-muted-foreground">
            Pesquise em nossa base de conhecimento ou abra um chamado técnico para falar com
            especialistas.
          </p>

          <div className="relative flex items-center max-w-xl mx-auto mt-8 shadow-sm">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ex: Como redefinir a senha do colaborador..."
              className="pl-12 pr-32 h-14 text-base rounded-full border-primary/20 bg-background"
            />
            <Button className="absolute right-1.5 h-11 rounded-full px-6">Pesquisar</Button>
          </div>
        </div>
      </section>

      {/* CATEGORIAS POPULARES */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Book className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Categorias Populares</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Avaliação 360°</CardTitle>
              <CardDescription>
                Guias de configuração de ciclos, formulários e envio de lembretes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Matriz 9-Box</CardTitle>
              <CardDescription>
                Entendendo a calibragem, eixos de potencial e performance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Gestão de Acessos</CardTitle>
              <CardDescription>
                Criação de papéis, permissões (RBAC) e reset de senhas.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Integrações API</CardTitle>
              <CardDescription>
                Como sincronizar o Nordelta 360 com seu HRMS / Folha.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* BOTTOM SECTION: FAQ + SUPPORT TICKET */}
      <section className="grid lg:grid-cols-2 gap-10">
        {/* FAQ */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Perguntas Frequentes (FAQ)</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold">
                Os feedbacks dos pares são 100% anônimos?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim. Por padrão, avaliações feitas por pares e subordinados não exibem o nome do
                autor para o avaliado, garantindo segurança psicológica. Gestores possuem acesso aos
                nomes a depender das configurações em "Configurações &gt; Avaliação 360".
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-semibold">
                Como reativar um colaborador inativo?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Vá até o módulo "Administração de Perfis", pesquise pelo nome ou matrícula do
                usuário, clique no ícone de edição e altere o Status de "Inativo" ou "Bloqueado"
                para "Ativo".
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-semibold">
                Qual a diferença entre Potencial e Desempenho no 9-Box?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                O Desempenho (Eixo X) mede a entrega de resultados passados/atuais, geralmente
                baseado no atingimento de metas. O Potencial (Eixo Y) avalia comportamentos, fit
                cultural e a capacidade do indivíduo assumir maiores responsabilidades no futuro.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-semibold">
                Posso exportar os relatórios para Excel?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim, todos os painéis, incluindo "Ciclos" e "Relatórios", possuem um botão
                "Exportar" que gera arquivos nos formatos CSV ou PDF.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-semibold">
                O sistema possui integração com o Slack ou Teams?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim. Você pode configurar webhooks para notificar colaboradores sobre novos
                feedbacks recebidos ou lembretes de ciclo diretamente nas configurações de
                "Integrações".
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* SUPPORT TICKET FORM */}
        <div>
          <Card className="h-full border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Abrir Chamado Técnico
              </CardTitle>
              <CardDescription>
                Não encontrou o que precisava? Envie sua dúvida para nosso time de especialistas N3.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ticketStatus === "success" ? (
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 h-64 border border-dashed rounded-lg bg-emerald-500/5">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                  <div>
                    <h3 className="text-lg font-bold text-emerald-700">Ticket Enviado!</h3>
                    <p className="text-sm text-emerald-600/80">
                      Nossa equipe retornará em até 2 horas úteis. Acompanhe pelo seu e-mail.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setTicketStatus("idle")}
                    className="mt-4"
                  >
                    Abrir novo chamado
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria do Problema</Label>
                    <Select defaultValue="duvida">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="duvida">Dúvida de Uso</SelectItem>
                        <SelectItem value="bug">Reportar Erro (Bug)</SelectItem>
                        <SelectItem value="acesso">Problemas de Acesso</SelectItem>
                        <SelectItem value="sugestao">Sugestão de Melhoria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      required
                      placeholder="Ex: Erro ao gerar relatório do ciclo atual"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Descrição Detalhada</Label>
                    <Textarea
                      id="desc"
                      required
                      placeholder="Descreva passo a passo o que aconteceu ou a sua dúvida..."
                      className="min-h-[120px] resize-y"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={ticketStatus === "submitting"}>
                    {ticketStatus === "submitting" ? "Enviando..." : "Enviar Solicitação"}
                  </Button>
                </form>
              )}
            </CardContent>
            {ticketStatus !== "success" && (
              <CardFooter className="bg-muted/30 border-t flex items-center justify-between p-4 mt-2">
                <div className="text-sm text-muted-foreground">Precisa de urgência?</div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="w-3 h-3" /> (11) 4002-8922
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
