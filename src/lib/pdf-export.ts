import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { DashboardMetrics } from "@/lib/types";

// ─── Logo helper ─────────────────────────────────────────────────────────────

async function imageToBase64(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ─── Chart capture ────────────────────────────────────────────────────────────
// The ONLY reliable way: scroll element into view, wait for Recharts to
// finish its animation, then call html2canvas(element) with no absolute
// coordinates – just let html2canvas clip to the element bounds directly.

async function captureElement(id: string): Promise<HTMLCanvasElement | null> {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`[pdf-export] Element #${id} not found in DOM.`);
    return null;
  }

  const savedScrollX = window.scrollX;
  const savedScrollY = window.scrollY;

  // Bring element fully into view
  el.scrollIntoView({ behavior: "instant", block: "center" });
  // Give the browser time to repaint and Recharts animations to settle
  await new Promise((r) => setTimeout(r, 600));

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      // Do NOT pass x/y/scrollX/scrollY – these are internal offsets, not
      // page coordinates, and cause the blank-canvas bug.
      onclone: (_clonedDoc, clonedEl) => {
        // Freeze any CSS transitions/animations that could cause blank renders
        const style = document.createElement("style");
        style.textContent = `* { animation-duration: 0s !important; transition-duration: 0s !important; }`;
        clonedEl.ownerDocument.head.appendChild(style);
      },
    });

    // Restore original scroll position
    window.scrollTo(savedScrollX, savedScrollY);
    return canvas;
  } catch (err) {
    console.error(`[pdf-export] html2canvas failed for #${id}:`, err);
    window.scrollTo(savedScrollX, savedScrollY);
    return null;
  }
}

// ─── PDF helpers ──────────────────────────────────────────────────────────────

function drawSectionHeader(doc: jsPDF, title: string, y: number, pageWidth: number): number {
  doc.setFillColor(235, 240, 252);
  doc.rect(16, y - 5, pageWidth - 32, 9, "F");
  doc.setDrawColor(170, 185, 220);
  doc.setLineWidth(0.3);
  doc.line(16, y + 4, pageWidth - 16, y + 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(title, 20, y + 0.5);
  return y + 13;
}

function drawBodyText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(75, 90, 115);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * 4.5 + 5;
}

function drawFooter(doc: jsPDF, pageWidth: number, pageHeight: number) {
  doc.setDrawColor(200, 210, 228);
  doc.setLineWidth(0.2);
  doc.line(16, pageHeight - 13, pageWidth - 16, pageHeight - 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(155, 168, 190);
  doc.text(
    "Nordelta Soluções Corporativas — Documento de uso interno e confidencial.",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" },
  );
  doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, pageWidth - 16, pageHeight - 8, {
    align: "right",
  });
}

function embedChart(
  doc: jsPDF,
  canvas: HTMLCanvasElement,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  centered = false,
): number {
  const marginX = 16;
  const maxW = centered ? Math.min(pageWidth * 0.7, 140) : pageWidth - marginX * 2;
  const imgW = maxW;
  const imgH = (canvas.height * imgW) / canvas.width;
  const x = centered ? (pageWidth - imgW) / 2 : marginX;

  if (currentY + imgH + 10 > pageHeight - 18) {
    doc.addPage();
    drawFooter(doc, pageWidth, pageHeight);
    currentY = 20;
  }

  doc.setDrawColor(210, 218, 232);
  doc.setLineWidth(0.25);
  doc.roundedRect(x - 1, currentY - 1, imgW + 2, imgH + 2, 1.5, 1.5);

  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  doc.addImage(imgData, "JPEG", x, currentY, imgW, imgH);
  return currentY + imgH + 12;
}

// ─── Main export function ─────────────────────────────────────────────────────

export async function exportDepartamentosToPDF(
  metrics: DashboardMetrics,
  selectedDepartment: string | null,
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth(); // 210
  const H = doc.internal.pageSize.getHeight(); // 297
  let y = 14;

  // ── PAGE 1 — HEADER ─────────────────────────────────────────────────────
  const logoBase64 = await imageToBase64("/logo_nordelta_escuro.png");

  if (logoBase64) {
    try {
      // Measure natural logo proportions
      const img = new Image();
      img.src = logoBase64;
      await new Promise<void>((res) => {
        img.onload = () => res();
        img.onerror = () => res();
      });
      const ratio = img.naturalWidth / img.naturalHeight;
      const logoH = 12;
      const logoW = logoH * ratio;
      doc.addImage(logoBase64, "PNG", 16, y, logoW, logoH);
      // Company name to the RIGHT of logo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text("Nordelta Soluções Corporativas", 16 + logoW + 4, y + logoH * 0.65);
    } catch {
      // Fallback
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text("Nordelta Soluções Corporativas", 16, y + 8);
    }
  } else {
    // Vector fallback: coloured square + name
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(16, y, 12, 12, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("N", 22, y + 8.5, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("Nordelta Soluções Corporativas", 32, y + 8.5);
  }

  // Right-side meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(55, 75, 120);
  doc.text("Relatório Executivo de Áreas", W - 16, y + 4, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 155, 180);
  doc.text(`Emissão: ${new Date().toLocaleDateString("pt-BR")}`, W - 16, y + 9, { align: "right" });

  y += 16;
  // Divider
  doc.setDrawColor(180, 192, 215);
  doc.setLineWidth(0.25);
  doc.line(16, y, W - 16, y);
  y += 10;

  // ── SECTION 1 ───────────────────────────────────────────────────────────
  y = drawSectionHeader(doc, "1. Visão Geral de Performance Corporativa", y, W);
  y = drawBodyText(
    doc,
    `Esta análise consolida os resultados das Avaliações de Desempenho 360° de ${metrics.totalDepartamentos} áreas organizacionais. ` +
      "A metodologia inclui quatro perspectivas: Gestor, Autoavaliação, Pares e Subordinados. " +
      `A média global é de ${metrics.notaMediaGeral.toFixed(2)}/5,00.`,
    20,
    y,
    W - 40,
  );

  // Table — ALL departments sorted by media desc
  const allDepts = [...metrics.departamentos].sort((a, b) => b.media - a.media);
  const ROW_H = 6.5;
  const tableTop = y;

  // Header row
  doc.setFillColor(15, 23, 42);
  doc.rect(16, y, W - 32, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Departamento", 20, y + 5);
  doc.text("Média Global", W - 80, y + 5);
  doc.text("Gap Médio", W - 40, y + 5);
  doc.text("Participação", W - 22, y + 5, { align: "right" });
  y += 7;

  allDepts.forEach((d, i) => {
    const bg = i % 2 === 0 ? [248, 250, 255] : [255, 255, 255];
    doc.setFillColor(bg[0], bg[1], bg[2]);
    doc.rect(16, y, W - 32, ROW_H, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 42, 65);
    doc.text(d.departamento, 20, y + 4.5);

    // Media in colour
    const mediaColor: [number, number, number] =
      d.media >= 3.5 ? [22, 120, 70] : d.media >= 2.8 ? [90, 90, 90] : [170, 50, 50];
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...mediaColor);
    doc.text(d.media.toFixed(2), W - 70, y + 4.5);

    // Gap
    const gapColor: [number, number, number] = d.gapMedio >= 0 ? [30, 130, 80] : [180, 40, 40];
    doc.setTextColor(...gapColor);
    doc.text(`${d.gapMedio >= 0 ? "+" : ""}${d.gapMedio.toFixed(2)}`, W - 38, y + 4.5);

    // Participation
    doc.setTextColor(80, 95, 120);
    doc.setFont("helvetica", "normal");
    doc.text(`${(d.participacao * 100).toFixed(0)}%`, W - 18, y + 4.5, { align: "right" });

    y += ROW_H;
  });

  // Table border
  doc.setDrawColor(195, 208, 228);
  doc.setLineWidth(0.2);
  doc.rect(16, tableTop, W - 32, y - tableTop);
  y += 8;

  drawFooter(doc, W, H);

  // ── PAGE 2 — HEATMAP ────────────────────────────────────────────────────
  doc.addPage();
  drawFooter(doc, W, H);
  y = 16;

  y = drawSectionHeader(doc, "2. Heatmap Analítico de Gaps — Gestor vs. Autoavaliação", y, W);
  y = drawBodyText(
    doc,
    "O mapa de calor exibe a magnitude das divergências de percepção por departamento e competência. " +
      "Células em vermelho indicam superestimativa do colaborador (Efeito Dunning-Kruger), " +
      "enquanto células em verde indicam subestimativa (Síndrome do Impostor).",
    20,
    y,
    W - 40,
  );

  const heatCanvas = await captureElement("heatmap-export");
  if (heatCanvas && heatCanvas.width > 10) {
    y = embedChart(doc, heatCanvas, y, W, H, false);
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(180, 60, 60);
    doc.text("⚠  Não foi possível capturar o gráfico Heatmap.", 20, y);
    y += 8;
  }

  // ── PAGE 3 — RADAR ──────────────────────────────────────────────────────
  doc.addPage();
  drawFooter(doc, W, H);
  y = 16;

  const deptName = selectedDepartment ?? "Departamento Selecionado";
  y = drawSectionHeader(doc, `3. Análise por Competências — ${deptName}`, y, W);
  y = drawBodyText(
    doc,
    `O gráfico de radar exibe as competências avaliadas no departamento "${deptName}". ` +
      "Cada eixo representa uma competência. A assimetria entre as perspectivas revela " +
      "os gaps de percepção que demandam atenção gerencial.",
    20,
    y,
    W - 40,
  );

  const radarCanvas = await captureElement("radar-export");
  if (radarCanvas && radarCanvas.width > 10) {
    y = embedChart(doc, radarCanvas, y, W, H, true);
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(180, 60, 60);
    doc.text("⚠  Não foi possível capturar o gráfico Radar.", 20, y);
    y += 8;
  }

  // ── SAVE ────────────────────────────────────────────────────────────────
  doc.save(`Nordelta_Analise_Areas_${new Date().toISOString().split("T")[0]}.pdf`);
}
