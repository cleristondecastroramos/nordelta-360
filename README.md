<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

# Nordelta 360°

**Sistema Corporativo de Avaliação 360° e People Analytics**

Um dashboard executivo avançado para análise de performance, simulação de feedbacks e desenvolvimento de talentos corporativos.

*⚠️ Aviso: Este é um **projeto fictício** construído como case oficial para portfólio de engenharia de software e design de produto.*

</div>

---

## 📸 Demonstração Visual

*(Substitua as marcações abaixo pelas imagens e GIFs reais da sua aplicação para demonstrar a UI/UX aos recrutadores)*

| **Dashboard Executivo** | **Ficha de Colaborador** |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x350/1a1a1a/ffffff?text=Screenshot+Dashboard+Aqui" alt="Dashboard Executivo"> | <img src="https://via.placeholder.com/600x350/1a1a1a/ffffff?text=Screenshot+Ficha+Aqui" alt="Ficha Individual"> |
| Visão geral de performance, engajamento e métricas organizacionais. | Análise profunda com radar de competências e histórico de feedbacks. |

| **Rankings e Demografia** | **Ciclos de Avaliação** |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x350/1a1a1a/ffffff?text=Screenshot+Demografia+Aqui" alt="Análise Demográfica"> | <img src="https://via.placeholder.com/600x350/1a1a1a/ffffff?text=Screenshot+Ciclos+Aqui" alt="Ciclos 360"> |
| Visualização clara da distribuição de talentos por setor e cargo. | Administração das rodadas de avaliação e gestão de status. |

---

## 🎯 Sobre o Projeto

O **Nordelta 360°** simula a operação interna da "Nordelta Soluções Corporativas", uma empresa de fachada para fins deste case. O sistema foi desenvolvido para atuar como uma plataforma robusta de **People Analytics e Avaliação 360°**, modelando o fluxo de dados típico de um setor de Recursos Humanos de alta maturidade analítica.

O objetivo principal deste repositório é servir como uma **prova de conceito (PoC) para o meu portfólio**, atestando competências sólidas em:
- Desenvolvimento e engenharia de interfaces web (B2B).
- Arquitetura de aplicações front-end modernas.
- Estruturação e visualização de grandes volumes de dados (Data Visualization).
- UX/UI aplicados a dashboards corporativos e alta densidade de informação.
- Domínio do ciclo de vida e engenharia de software voltados para produto.

---

## 🚀 Funcionalidades

O sistema conta com um ecossistema focado na avaliação e retenção de talentos:

- **📊 Dashboard Executivo:** Visão macro da empresa com indicadores de performance e engajamento.
- **👤 Ficha Individual Premium:** Perfil consolidado de cada colaborador.
- **🎯 Visualização de Dados (Data Viz):** Gráficos de radar para soft/hard skills, histogramas de distribuição, heatmaps e rankings setoriais.
- **👥 Diretório de Talentos:** Listagem interativa e filtro multidimensional de profissionais.
- **📈 Evolução Histórica:** Acompanhamento do progresso de colaboradores através de métricas comparativas em ciclos anteriores.
- **⚙️ Administração de Ciclos 360°:** Criação, andamento e finalização de ciclos de avaliação.
- **💬 Feedbacks e Calibragem:** Painel para leitura e calibração de avaliações (pares, gestores, autoavaliação).

---

## 🛠 Tecnologias Utilizadas

Este projeto foi construído empregando tecnologias estabelecidas no ecossistema front-end para garantir performance e escalabilidade:

- **[React](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**: Base de UI robusta e estaticamente tipada.
- **[Tailwind CSS](https://tailwindcss.com/)**: Estilização utilitária e responsiva.
- **[TanStack Router](https://tanstack.com/router/latest)**: Roteamento modular com segurança de tipos (type-safe).
- **[Recharts](https://recharts.org/)**: Motor de composição para os componentes de gráficos.
- **[shadcn/ui](https://ui.shadcn.com/)**: Primitivas de interface acessíveis e customizáveis.
- **Vite**: Ferramenta de build extremamente rápida.

---

## 🏗 Arquitetura e Dados

O design arquitetural do Nordelta 360° foca em modularização e performance de renderização:

- **Dados Sintéticos:** Todos os colaboradores, resultados de avaliações, feedbacks e departamentos são providos por uma base de dados *mockada*, gerada especificamente para alimentar a UI com cenários realistas de People Analytics sem depender de APIs externas.
- **Simulação de Operação:** O projeto emula chamadas assíncronas de um backend para que quem avalie o repositório observe os estados de carregamento (loading, success, error) idênticos aos de uma aplicação em produção.
- **Modularização:** Os componentes visuais (via shadcn/ui) operam desacoplados da lógica de extração e manipulação de métricas (custom hooks) e da camada de exibição gráfica (Recharts).

---

## ⚙️ Instalação e Execução

Instruções para executar o projeto localmente em seu ambiente de desenvolvimento.

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/nordelta-360.git
cd nordelta-360
```

2. **Instale as dependências**
O projeto pode ser executado usando `npm` (ou equivalente).
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
Abra [http://localhost:8080](http://localhost:8080) para visualizar a aplicação local.

5. **Gerar build estático**
Para validar a geração de assets voltada a produção:
```bash
npm run build
```

---

## 📁 Estrutura de Pastas

Uma breve visão geral da organização do código-fonte:
```
nordelta-360/
├── public/              # Assets estáticos 
├── src/
│   ├── components/      # Componentes reutilizáveis (UI, Gráficos, Layouts)
│   ├── hooks/           # Custom hooks para encapsular lógica de negócios
│   ├── lib/             # Utilitários globais e padronizações (ex: tailwind merge)
│   ├── routes/          # Definições e tree do TanStack Router
│   ├── services/        # Lógica de conexão aos dados sintéticos e mock APIs
│   └── types/           # Definições e interfaces TypeScript da aplicação
├── package.json
└── vite.config.ts
```

---

## 🌱 Melhorias Futuras

Embora este seja um case de demonstração concluído com foco no front-end, a arquitetura permite as seguintes expansões para um ambiente de produção:

- [ ] Integração com backend real (Ex: Node.js, NestJS) e banco de dados relacional.
- [ ] Sistema robusto de Autenticação com RBAC (Administrador, RH, Líder e Colaborador).
- [ ] Exportação de fichas individuais com relatórios analíticos em PDF.
- [ ] Dashboards preditivos com modelos para retenção e risco de evasão de talentos.

---

## 👨‍💻 Autor

**Clériston de Castro Ramos**

O planejamento, design de produto, modelagem de dados simulados e a engenharia front-end desta aplicação foram executados inteiramente para este case.

* 🌐 **Portfólio:** [Inserir Link do seu site/portfólio]
* 💼 **LinkedIn:** [Inserir Link do LinkedIn]
* 🐙 **GitHub:** [Inserir Link do GitHub]

---
*Construído com foco em design de produto, engenharia visual e performance de dados. 2026.*
