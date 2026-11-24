// Consultas compartilhadas do React Query. As páginas usam `useQuery(xxxQuery)`,
// então o resultado fica em cache e voltar a uma página não refaz o cálculo.
import { queryOptions } from "@tanstack/react-query";
import {
  getAdminMetrics,
  getColaboradoresList,
  getColaboradorResultados,
  getDashboardMetrics,
  getDemographyMetrics,
  getEvolutionMetrics,
} from "./data-service";

export const dashboardQuery = queryOptions({
  queryKey: ["dashboard"],
  queryFn: getDashboardMetrics,
});

export const colaboradoresQuery = queryOptions({
  queryKey: ["colaboradores"],
  queryFn: getColaboradoresList,
});

export const demografiaQuery = queryOptions({
  queryKey: ["demografia"],
  queryFn: getDemographyMetrics,
});

export const evolucaoQuery = queryOptions({
  queryKey: ["evolucao"],
  queryFn: getEvolutionMetrics,
});

export const adminQuery = queryOptions({
  queryKey: ["admin"],
  queryFn: getAdminMetrics,
});

export const fichaQuery = (matricula: string) =>
  queryOptions({
    queryKey: ["ficha", matricula],
    queryFn: () => getColaboradorResultados(matricula),
  });
