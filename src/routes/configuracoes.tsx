import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Building2, 
  Settings, 
  Shield, 
  Sliders, 
  Database,
  BellRing,
  Smartphone,
  Key,
  Webhook,
  Activity,
  Save,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Configurações salvas com sucesso!");
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">Gerencie parâmetros, segurança e integrações da plataforma.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="shrink-0 shadow-sm">
          <Save className="mr-2 h-4 w-4" /> 
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 h-auto p-1 bg-muted/50">
          <TabsTrigger value="geral" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Building2 className="mr-2 h-4 w-4" /> <span className="hidden md:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="avaliacao" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Sliders className="mr-2 h-4 w-4" /> <span className="hidden md:inline">Avaliação 360</span>
          </TabsTrigger>
          <TabsTrigger value="potencial" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Activity className="mr-2 h-4 w-4" /> <span className="hidden md:inline">Matriz 9-Box</span>
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Database className="mr-2 h-4 w-4" /> <span className="hidden md:inline">Integrações</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Shield className="mr-2 h-4 w-4" /> <span className="hidden md:inline">Segurança</span>
          </TabsTrigger>
        </TabsList>

        {/* ABA 1: GERAL */}
        <TabsContent value="geral" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Informações básicas que aparecem nos relatórios.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Nome da Organização</Label>
                  <Input id="empresa" defaultValue="Nordelta Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ / ID Fiscal</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-99" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Localização e Idioma</CardTitle>
              <CardDescription>Padrões de data, hora e idioma do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fuso Horário</Label>
                  <Select defaultValue="america-sao_paulo">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-sao_paulo">América/São Paulo (BRT)</SelectItem>
                      <SelectItem value="america-new_york">América/New York (EST)</SelectItem>
                      <SelectItem value="europe-lisbon">Europa/Lisboa (WET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Formato de Data</Label>
                  <Select defaultValue="ddmmyyyy">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 2: AVALIAÇÃO 360 */}
        <TabsContent value="avaliacao" className="space-y-6">
          <Card className="shadow-sm border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Escala de Avaliação</CardTitle>
              <CardDescription>Defina como as notas serão atribuídas durante os ciclos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Usar escala de 1 a 10</Label>
                  <p className="text-sm text-muted-foreground">Por padrão, a plataforma utiliza a escala de 1 a 5 (Likert).</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Regras de Anonimato</CardTitle>
              <CardDescription>Proteção de identidade para avaliações não gerenciais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mascarar comentários sensíveis</Label>
                  <p className="text-sm text-muted-foreground">Filtra automaticamente palavras ofensivas usando IA.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <hr className="border-border" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Mínimo de Pares para exibir nota (Pooling)</Label>
                  <Input type="number" defaultValue={3} className="w-24" />
                  <p className="text-xs text-muted-foreground">Se houver menos pares, a nota será somada à média geral.</p>
                </div>
                <div className="space-y-2">
                  <Label>Mínimo de Subordinados para exibir nota</Label>
                  <Input type="number" defaultValue={3} className="w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 3: MATRIZ E POTENCIAL */}
        <TabsContent value="potencial" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Calibragem e Comitê</CardTitle>
              <CardDescription>Regras para aprovação dos resultados finais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Exigir aprovação do Comitê de RH</Label>
                  <p className="text-sm text-muted-foreground">As notas só são publicadas após validação do RH na aba de Feedbacks.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Multiplicadores de Potencial</CardTitle>
              <CardDescription>Pesos aplicados sobre competências específicas para calcular o eixo Y da Matriz 9-Box.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Peso: Liderança</Label>
                  <Input defaultValue="1.5" type="number" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Peso: Inovação</Label>
                  <Input defaultValue="1.2" type="number" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Peso: Visão Sistêmica</Label>
                  <Input defaultValue="1.1" type="number" step="0.1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 4: INTEGRAÇÕES */}
        <TabsContent value="integracoes" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Sincronização de Dados (HRMS)</CardTitle>
              <CardDescription>Integração com folha de pagamento e gestão de pessoas (SAP, Senior, etc).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chave de API (API Key)</Label>
                <div className="flex gap-2">
                  <Input type="password" defaultValue="************************" readOnly className="font-mono text-muted-foreground" />
                  <Button variant="outline">Gerar Nova</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 flex justify-between border-t mt-4 pt-4">
              <span className="text-sm text-muted-foreground">Última sincronização: Há 2 horas</span>
              <Button variant="secondary" size="sm">Forçar Sincronização</Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2"><BellRing className="h-5 w-5" /> Slack & Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Envie notificações automáticas de lembretes e abertura de ciclos nos canais corporativos.</p>
                <Button variant="outline" className="w-full">Configurar Webhook</Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2"><Webhook className="h-5 w-5" /> Webhooks Abertos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Assine eventos do sistema (ex: evaluation.completed) para disparar fluxos externos.</p>
                <Button variant="outline" className="w-full">Gerenciar Endpoints</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABA 5: SEGURANÇA */}
        <TabsContent value="seguranca" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Autenticação e Sessão</CardTitle>
              <CardDescription>Políticas de acesso para todos os usuários.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex gap-3">
                  <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <Label className="text-base">Autenticação em Duas Etapas (2FA)</Label>
                    <p className="text-sm text-muted-foreground">Exigir token via app autenticador no login de gestores.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex gap-3">
                  <Key className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <Label className="text-base">Timeout de Sessão</Label>
                    <p className="text-sm text-muted-foreground">Tempo de inatividade até forçar logout.</p>
                  </div>
                </div>
                <div className="w-32">
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 Minutos</SelectItem>
                      <SelectItem value="30">30 Minutos</SelectItem>
                      <SelectItem value="60">1 Hora</SelectItem>
                      <SelectItem value="480">8 Horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-red-100 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Zona de Perigo</CardTitle>
              <CardDescription>Ações destrutivas que afetam todos os dados da plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Resetar todos os dados de testes e configurações</p>
                <Button variant="destructive">Factory Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

