import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ficha-individual/")({
  beforeLoad: () => {
    throw redirect({
      to: "/colaboradores",
    });
  },
});
