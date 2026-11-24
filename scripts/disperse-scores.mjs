// Gera src/lib/real_scores.json a partir de data/evaluations_360.csv,
// redistribuindo as médias para uma curva de notas mais realista. Não acessa o banco.
// Uso (na raiz do projeto): node scripts/disperse-scores.mjs
import fs from "fs";
import readline from "readline";

const csvPath = "data/evaluations_360.csv";
const outFile = "src/lib/real_scores.json";

// Target distribution
// 1.0 a 1.5: ~3%
// 1.6 a 2.0: ~7%
// 2.1 a 2.5: ~15%
// 2.6 a 3.0: ~25%
// 3.1 a 3.5: ~25%
// 3.6 a 4.0: ~15%
// 4.1 a 4.5: ~7%
// 4.6 a 5.0: ~3%

async function disperse() {
  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const collaborators = new Set();
  const comps = new Set();

  let isHeader = true;
  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }
    if (!line.trim()) continue;

    const parts = line.split(",");
    collaborators.add(parts[0]);
    comps.add(parts[2]);
  }

  const colabsArray = Array.from(collaborators);
  const total = colabsArray.length;

  // Shuffle for random distribution
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colabsArray[i], colabsArray[j]] = [colabsArray[j], colabsArray[i]];
  }

  const compArray = Array.from(comps);

  const buckets = [
    { min: 1.0, max: 1.5, pct: 0.03 },
    { min: 1.6, max: 2.0, pct: 0.07 },
    { min: 2.1, max: 2.5, pct: 0.15 },
    { min: 2.6, max: 3.0, pct: 0.25 },
    { min: 3.1, max: 3.5, pct: 0.25 },
    { min: 3.6, max: 4.0, pct: 0.15 },
    { min: 4.1, max: 4.5, pct: 0.07 },
    { min: 4.6, max: 5.0, pct: 0.03 },
  ];

  let currentIndex = 0;
  const finalData = [];

  for (const bucket of buckets) {
    const count = Math.round(bucket.pct * total);

    for (let i = 0; i < count && currentIndex < total; i++, currentIndex++) {
      const mat = colabsArray[currentIndex];

      const indicadores = {};
      let sum = 0;

      for (const comp of compArray) {
        // Generate a random score within or slightly outside the bucket to simulate variance
        // Center it around the bucket average, but with some noise
        const targetAvg = bucket.min + Math.random() * (bucket.max - bucket.min);
        let note = targetAvg + (Math.random() * 1.0 - 0.5);
        note = Math.max(1.0, Math.min(5.0, note));

        indicadores[comp] = Number(note.toFixed(2));
        sum += note;
      }

      const nota_media = Number((sum / compArray.length).toFixed(2));

      finalData.push({
        avaliado_matricula: mat,
        indicadores,
        nota_media,
      });
    }
  }

  // Any remaining
  while (currentIndex < total) {
    const mat = colabsArray[currentIndex];
    const indicadores = {};
    let sum = 0;
    const bucket = buckets[3]; // put in 2.6-3.0
    for (const comp of compArray) {
      let note = bucket.min + Math.random() * (bucket.max - bucket.min);
      indicadores[comp] = Number(note.toFixed(2));
      sum += note;
    }
    finalData.push({
      avaliado_matricula: mat,
      indicadores,
      nota_media: Number((sum / compArray.length).toFixed(2)),
    });
    currentIndex++;
  }

  fs.writeFileSync(outFile, JSON.stringify(finalData, null, 2));
  console.log(`Generated ${finalData.length} records in ${outFile}`);
}

disperse().catch(console.error);
