// Manutenção: converte as matrículas do banco para o formato inicial do cargo + número
// e atualiza src/lib/real_scores.json. ESCREVE no Supabase (exige permissão de escrita).
// Uso (na raiz do projeto): node scripts/update-matriculas.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Carregar variáveis de ambiente simples
const envContent = fs.readFileSync(path.resolve(".env"), "utf-8");
const envLines = envContent.split("\n");
const env = {};
envLines.forEach((line) => {
  const [key, ...values] = line.split("=");
  if (key && values.length > 0) {
    let value = values.join("=").trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[key.trim()] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials not found in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Conectando ao Supabase para realizar atualizações...");

  // 1. Fetch all colaboradores
  const { data: colaboradores, error } = await supabase
    .from("colaboradores")
    .select("matricula, cargo");

  if (error) {
    console.error("Erro ao buscar colaboradores:", error);
    return;
  }

  console.log(`Encontrados ${colaboradores.length} colaboradores. Preparando mapeamento...`);

  // 2. Prepare the mapping
  const updates = colaboradores
    .map((c) => {
      let cargo = c.cargo || "Desconhecido";
      let firstLetter = cargo.charAt(0).toUpperCase();
      if (!/^[A-Z]$/.test(firstLetter)) firstLetter = "D";
      const numericPart = c.matricula.replace(/\D/g, "").padStart(3, "0");
      const newMatricula = `${firstLetter}${numericPart}`;

      return {
        old: c.matricula,
        new: newMatricula,
        cargo: c.cargo,
      };
    })
    .filter((u) => u.old !== u.new);

  console.log(`Há ${updates.length} matrículas para atualizar.`);

  let successCount = 0;
  let failCount = 0;

  const batchSize = 50;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async ({ old, new: newMat }) => {
        const { error: updErr } = await supabase
          .from("colaboradores")
          .update({ matricula: newMat })
          .eq("matricula", old);
        if (updErr) {
          console.error(`Erro ao atualizar ${old} -> ${newMat}:`, updErr.message);
          failCount++;
        } else {
          successCount++;
        }
      }),
    );

    console.log(`Progresso: ${Math.min(i + batchSize, updates.length)}/${updates.length}`);
  }

  console.log(`Atualização no BD: ${successCount} sucessos, ${failCount} falhas.`);

  // Update real_scores.json
  const scoresPath = path.resolve("src/lib/real_scores.json");
  if (fs.existsSync(scoresPath)) {
    console.log("Atualizando real_scores.json...");
    let scoresData = fs.readFileSync(scoresPath, "utf-8");
    let scores = JSON.parse(scoresData);
    let scoreUpdates = 0;

    // Create a fast lookup map
    const matriculaMap = new Map();
    updates.forEach((u) => matriculaMap.set(u.old, u.new));

    scores = scores.map((s) => {
      if (s.avaliado_matricula && matriculaMap.has(s.avaliado_matricula)) {
        s.avaliado_matricula = matriculaMap.get(s.avaliado_matricula);
        scoreUpdates++;
      }
      return s;
    });

    fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
    console.log(`real_scores.json atualizado com ${scoreUpdates} alterações.`);
  }
}

main().catch(console.error);
