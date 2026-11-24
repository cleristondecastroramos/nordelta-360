import fs from "fs";
import readline from "readline";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uqdswlmloawvpghdwanh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZHN3bG1sb2F3dnBnaGR3YW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjgyMDMsImV4cCI6MjA5NTIwNDIwM30.c3GwPu6RuJXg7VxcV7Vzt0GKWsHWqPw72-2FE85y6vQ",
);

const filePath = "data/evaluations_360.csv";

async function processCSV() {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let isHeader = true;

  const data = {};

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }
    if (!line.trim()) continue;

    const [avaliado, avaliador, competencia, notaStr] = line.split(",");
    const nota = parseFloat(notaStr);

    if (!data[avaliado]) {
      data[avaliado] = {
        competencias: {},
        totalSum: 0,
        totalCount: 0,
      };
    }

    if (!data[avaliado].competencias[competencia]) {
      data[avaliado].competencias[competencia] = { sum: 0, count: 0 };
    }

    data[avaliado].competencias[competencia].sum += nota;
    data[avaliado].competencias[competencia].count += 1;
    data[avaliado].totalSum += nota;
    data[avaliado].totalCount += 1;
  }

  console.log(
    `Aggregated data for ${Object.keys(data).length} collaborators. Fetching existing records...`,
  );

  // Fetch all records, handle pagination if more than 1000
  let existingRecords = [];
  let page = 0;
  let hasMore = true;
  while (hasMore) {
    const { data: pageData, error: fetchError } = await supabase
      .from("feedbacks_finais")
      .select("*")
      .range(page * 1000, (page + 1) * 1000 - 1);

    if (fetchError) {
      console.error("Error fetching existing records:", fetchError);
      return;
    }
    if (pageData.length === 0) {
      hasMore = false;
    } else {
      existingRecords.push(...pageData);
      page++;
    }
  }

  console.log(`Found ${existingRecords.length} records in DB. Updating...`);

  const updates = [];

  for (const record of existingRecords) {
    const matricula = record.avaliado_matricula;
    const agg = data[matricula];
    if (agg) {
      const indicadores = {};
      for (const [comp, stats] of Object.entries(agg.competencias)) {
        const mean = Number((stats.sum / stats.count).toFixed(2));
        indicadores[comp] = mean;
      }
      const nota_media = Number((agg.totalSum / agg.totalCount).toFixed(2));

      updates.push({
        ...record,
        indicadores,
        nota_media,
      });
    }
  }

  console.log(`Prepared ${updates.length} updates. Executing...`);

  const chunkSize = 100;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    const { error: upsertError } = await supabase.from("feedbacks_finais").upsert(chunk);
    if (upsertError) {
      console.error(`Error updating chunk ${i}:`, upsertError);
    } else {
      console.log(`Updated chunk ${i} to ${i + chunk.length}`);
    }
  }

  console.log("Finished updating notes.");
}

processCSV().catch(console.error);
