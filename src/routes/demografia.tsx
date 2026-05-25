import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getColaboradoresList } from "@/lib/data-service";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Users, UserPlus, GraduationCap, Building2 } from "lucide-react";

export const Route = createFileRoute("/demografia")({
  component: DemografiaPage,
});

function DemografiaPage() {
  const [data, setData] = useState<{
    idadeGroups: any[];
    tenureGroups: any[];
    leadershipData: any[];
    kpis: any;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      const colaboradores = await getColaboradoresList();
      
      const enriched = colaboradores.map(c => {
        const isLeader = ["Diretor", "Gerente", "Coordenador", "Head", "Líder"].some(cargo => (c.cargo || "").includes(cargo));
        
        // Calcula anos de empresa de forma simplificada
        let anosEmpresa = 0;
        if (c.data_admissao) {
          const admission = new Date(c.data_admissao);
          const diff = new Date().getTime() - admission.getTime();
          anosEmpresa = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }

        return { ...c, isLeader, anosEmpresa, idadeReal: c.idade || 0 };
      });

      // KPI
      const total = enriched.length;
      const validAges = enriched.filter(c => c.idadeReal > 0);
      const avgAge = validAges.length > 0 ? Math.round(validAges.reduce((acc, c) => acc + c.idadeReal, 0) / validAges.length) : 0;
      const avgTenure = (enriched.reduce((acc, c) => acc + c.anosEmpresa, 0) / (total || 1)).toFixed(1);
      
      // Idade
      const ageBuckets = { "18-25": 0, "26-35": 0, "36-45": 0, "46-55": 0, "56+": 0 };
      enriched.forEach(c => {
        if (c.idadeReal === 0) return; // ignora quem não tem idade
        if (c.idadeReal <= 25) ageBuckets["18-25"]++;
        else if (c.idadeReal <= 35) ageBuckets["26-35"]++;
        else if (c.idadeReal <= 45) ageBuckets["36-45"]++;
        else if (c.idadeReal <= 55) ageBuckets["46-55"]++;
        else ageBuckets["56+"]++;
      });
      const idadeGroups = Object.entries(ageBuckets).map(([name, value]) => ({ name, value }));

      // Tenure
      const tenureBuckets = { "Até 1 ano": 0, "1 a 3 anos": 0, "3 a 5 anos": 0, "5 a 10 anos": 0, "Mais de 10 anos": 0 };
      enriched.forEach(c => {
        if (c.anosEmpresa <= 1) tenureBuckets["Até 1 ano"]++;
        else if (c.anosEmpresa <= 3) tenureBuckets["1 a 3 anos"]++;
        else if (c.anosEmpresa <= 5) tenureBuckets["3 a 5 anos"]++;
        else if (c.anosEmpresa <= 10) tenureBuckets["5 a 10 anos"]++;
        else tenureBuckets["Mais de 10 anos"]++;
      });
      const tenureGroups = Object.entries(tenureBuckets).map(([name, value]) => ({ name, value }));

      // Leadership
      const totalLeaders = enriched.filter(c => c.isLeader).length;
      const leadershipData = [
        { name: "Liderança", value: totalLeaders, color: "#2563eb" },
        { name: "Contribuintes Individuais", value: total - totalLeaders, color: "#94a3b8" }
      ];

      setData({
        idadeGroups,
        tenureGroups,
        leadershipData,
        kpis: { total, avgAge, avgTenure, totalLeaders }
      });
    }
    loadData();
  }, []);

  if (!data) {
    return <div className="flex h-[80vh] items-center justify-center animate-pulse">Carregando dados demográficos...</div>;
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">People Analytics: Demografia</h2>
        <p className="text-muted-foreground mt-1">Análise populacional, tempo de casa e perfis de liderança da companhia.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <h3 className="text-sm font-medium">Total de Colaboradores</h3>
            <Users className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">{data.kpis.total}</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <h3 className="text-sm font-medium">Média de Idade</h3>
            <UserPlus className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">{data.kpis.avgAge} <span className="text-sm font-normal text-muted-foreground">anos</span></p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <h3 className="text-sm font-medium">Tempo Médio de Casa</h3>
            <Building2 className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">{data.kpis.avgTenure} <span className="text-sm font-normal text-muted-foreground">anos</span></p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <h3 className="text-sm font-medium">Posições de Liderança</h3>
            <GraduationCap className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">{data.kpis.totalLeaders} <span className="text-sm font-normal text-muted-foreground">({Math.round((data.kpis.totalLeaders/data.kpis.total)*100)}%)</span></p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Distribuição Etária</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.idadeGroups}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.idadeGroups.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Tempo de Empresa (Tenure)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.tenureGroups} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h3 className="font-semibold text-lg mb-2">Estrutura Organizacional: Liderança vs Operação</h3>
          <p className="text-sm text-muted-foreground mb-6">Proporção de colaboradores em cargos de gestão comparado a contribuintes individuais.</p>
          <div className="h-[300px] w-full flex justify-center">
            <div className="w-full max-w-md h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.leadershipData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.leadershipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
